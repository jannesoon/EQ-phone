(function initXingyueSyncQueue(global) {
    'use strict';

    const DB_NAME = 'xingyue_sync_queue_v1';
    const STORE_NAME = 'operations';
    const REVISION_KEY = 'xingyue_host_sync_revisions_v1';
    const CONFLICT_KEY = 'xingyue_host_sync_conflicts_v1';

    const randomId = () => {
        const bytes = new Uint8Array(12);
        if (global.crypto?.getRandomValues) global.crypto.getRandomValues(bytes);
        else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
        return Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
    };

    const readJson = (storage, key, fallback) => {
        try { return JSON.parse(storage?.getItem(key) || '') || fallback; } catch (_) { return fallback; }
    };
    const writeJson = (storage, key, value) => {
        try { storage?.setItem(key, JSON.stringify(value)); } catch (_) {}
    };

    const createIndexedDbAdapter = () => {
        let databasePromise = null;
        const open = () => {
            if (!global.indexedDB) return Promise.reject(new Error('当前浏览器不支持离线同步队列'));
            if (!databasePromise) {
                databasePromise = new Promise((resolve, reject) => {
                    const request = global.indexedDB.open(DB_NAME, 1);
                    request.onupgradeneeded = () => {
                        if (!request.result.objectStoreNames.contains(STORE_NAME)) {
                            request.result.createObjectStore(STORE_NAME, { keyPath: 'resourceKey' });
                        }
                    };
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error || new Error('无法打开离线同步队列'));
                });
            }
            return databasePromise;
        };
        const transact = async (mode, action) => {
            const database = await open();
            return new Promise((resolve, reject) => {
                const transaction = database.transaction(STORE_NAME, mode);
                const store = transaction.objectStore(STORE_NAME);
                let request;
                try { request = action(store); } catch (error) { reject(error); return; }
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error || new Error('离线同步队列操作失败'));
            });
        };
        // Read/compare/write must share one transaction: another tab may enqueue
        // the completed reply while an earlier upload is being acknowledged.
        const update = async (key, transform) => {
            const database = await open();
            return new Promise((resolve, reject) => {
                const transaction = database.transaction(STORE_NAME, 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(key);
                let next;
                transaction.oncomplete = () => resolve(next);
                transaction.onerror = () => reject(transaction.error || new Error('离线队列更新失败'));
                transaction.onabort = () => reject(transaction.error || new Error('离线队列更新中断'));
                request.onsuccess = () => {
                    try {
                        next = transform(request.result);
                        if (next == null) store.delete(key);
                        else store.put(next);
                    } catch (error) { transaction.abort(); reject(error); }
                };
            });
        };
        return Object.freeze({
            update,
            get: key => transact('readonly', store => store.get(key)),
            put: value => transact('readwrite', store => store.put(value)),
            delete: key => transact('readwrite', store => store.delete(key)),
            list: () => transact('readonly', store => store.getAll())
        });
    };

    const createMemoryAdapter = () => {
        const values = new Map();
        return Object.freeze({
            update: async (key, transform) => {
                const next = transform(structuredClone(values.get(key)));
                if (next == null) values.delete(key);
                else values.set(key, structuredClone(next));
                return structuredClone(next);
            },
            get: async key => values.get(key),
            put: async value => { values.set(value.resourceKey, structuredClone(value)); return value.resourceKey; },
            delete: async key => values.delete(key),
            list: async () => Array.from(values.values()).map(value => structuredClone(value))
        });
    };

    const createQueue = (options = {}) => {
        const adapter = options.adapter || createIndexedDbAdapter();
        const storage = options.storage || global.localStorage;
        const now = options.now || (() => new Date().toISOString());

        const revisions = () => readJson(storage, REVISION_KEY, {});
        const conflicts = () => readJson(storage, CONFLICT_KEY, []);
        const getRevision = resourceKey => revisions()[resourceKey] || null;
        const setRevision = (resourceKey, revision) => {
            if (!resourceKey || !revision) return;
            const map = revisions();
            map[resourceKey] = revision;
            writeJson(storage, REVISION_KEY, map);
        };

        const enqueue = async operation => {
            const kind = String(operation.kind || '');
            const resourceId = String(operation.resourceId || '');
            const resourceKey = String(operation.resourceKey || `${kind}:${resourceId}`);
            if (!kind || !resourceId || !operation.path) throw new Error('同步记录缺少固定编号或目标接口');
            return adapter.update(resourceKey, existing => ({
                resourceKey,
                kind,
                resourceId,
                path: String(operation.path),
                payload: operation.payload,
                operationId: `${Date.now().toString(36)}-${randomId()}`,
                baseRevision: existing?.baseRevision ?? getRevision(resourceKey),
                createdAt: existing?.createdAt || now(),
                updatedAt: now(),
                attempts: Number(existing?.attempts || 0)
            }));
        };

        const markAttempt = async item => {
            return adapter.update(item.resourceKey, current => current?.operationId === item.operationId
                ? { ...current, attempts: Number(current.attempts || 0) + 1, lastAttemptAt: now() } : current);
        };

        const renewOperation = async item => {
            return adapter.update(item.resourceKey, current => {
                if (!current || current.operationId !== item.operationId) return current;
                const renewedAt = now();
                return {
                ...current,
                operationId: `${Date.now().toString(36)}-${randomId()}`,
                createdAt: renewedAt,
                updatedAt: renewedAt,
                attempts: 0
                };
            });
        };

        const acknowledge = async (item, revision) => {
            const map = revisions();
            if (revision) map[item.resourceKey] = revision;
            writeJson(storage, REVISION_KEY, map);
            await adapter.update(item.resourceKey, current => {
                if (!current || current.operationId === item.operationId) return null;
                // This newer payload has not been sent. Keep it and advance its
                // baseline only when it was based on the acknowledged operation.
                return revision && current.baseRevision === item.baseRevision
                    ? { ...current, baseRevision: revision } : current;
            });
        };

        const recordConflict = async (item, conflict) => {
            const current = conflicts().filter(value => value?.conflictId !== conflict?.conflictId);
            current.unshift({
                conflictId: conflict?.conflictId || `${item.operationId}-conflict`,
                resourceKey: item.resourceKey,
                resourceId: item.resourceId,
                kind: item.kind,
                createdAt: conflict?.createdAt || now(),
                message: conflict?.message || '电脑与手机都修改了同一条记录，已保留两个版本'
            });
            writeJson(storage, CONFLICT_KEY, current.slice(0, 100));
            await adapter.update(item.resourceKey, pending => pending?.operationId === item.operationId ? null : pending);
        };

        const clearPending = async () => {
            const items = await adapter.list();
            await Promise.all(items.map(item => adapter.delete(item.resourceKey)));
            return items.length;
        };

        return Object.freeze({
            enqueue,
            markAttempt,
            renewOperation,
            acknowledge,
            recordConflict,
            list: async () => (await adapter.list()).sort((left, right) => String(left.createdAt).localeCompare(String(right.createdAt))),
            pendingCount: async () => (await adapter.list()).length,
            getRevision,
            setRevision,
            getConflicts: conflicts,
            clearConflicts: () => writeJson(storage, CONFLICT_KEY, []),
            clearPending
        });
    };

    global.XingyueSyncQueue = Object.freeze({ createQueue, createMemoryAdapter });
})(window);
