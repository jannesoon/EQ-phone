(function () {
    const SAFE_HTML_TAGS = new Set([
        'a', 'b', 'blockquote', 'br', 'button', 'code', 'del', 'details', 'div', 'em',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'li', 'ol', 'p',
        'pre', 'span', 'strong', 'summary', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul',
        'svg', 'g', 'path', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'rect', 'text',
        'defs', 'lineargradient', 'radialgradient', 'stop', 'clippath', 'mask', 'pattern',
        'math', 'mrow', 'mi', 'mn', 'mo', 'mtext', 'mspace', 'msup', 'msub', 'mfrac',
        'mstyle', 'munderover', 'mover', 'munder', 'mtable', 'mtr', 'mtd', 'menclose',
        'msqrt', 'mroot', 'mpadded', 'none', 'semantics', 'annotation'
    ]);
    const DROP_WITH_CONTENT = new Set([
        'script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'form', 'input',
        'textarea', 'select', 'option', 'video', 'audio', 'source', 'foreignobject',
        'animate', 'animatetransform', 'set', 'use', 'template'
    ]);
    const SAFE_ATTRIBUTES = new Set([
        'alt', 'aria-hidden', 'aria-label', 'class', 'colspan', 'd', 'data-copy-raw',
        'data-imgid', 'data-legacy-pol-img', 'data-prompt', 'data-ar', 'data-retry',
        'data-draw-action', 'data-draw-uid',
        'data-base-url', 'data-ts', 'data-uid', 'fill', 'fill-opacity', 'height', 'href',
        'id', 'loading', 'marker-end', 'marker-start', 'points', 'preserveaspectratio',
        'rel', 'role', 'rowspan', 'rx', 'ry', 'src', 'stroke', 'stroke-dasharray',
        'stroke-linecap', 'stroke-linejoin', 'stroke-opacity', 'stroke-width', 'style',
        'target', 'title', 'transform', 'type', 'viewbox', 'width', 'x', 'x1', 'x2',
        'y', 'y1', 'y2', 'cx', 'cy', 'r', 'offset', 'stop-color', 'stop-opacity',
        'xmlns', 'opacity', 'font-family', 'font-size', 'font-weight', 'text-anchor',
        'dominant-baseline', 'gradientunits', 'spreadmethod', 'encoding', 'stretchy',
        'accent', 'separator', 'mathvariant', 'scriptlevel', 'displaystyle'
    ]);

    const isSafeUrl = (value, attribute, tagName) => {
        const normalized = String(value || '').trim().replace(/[\u0000-\u001F\u007F\s]+/g, '');
        if (!normalized) return true;
        if (normalized.startsWith('#')) return true;
        const lower = normalized.toLowerCase();
        if (attribute === 'src' && tagName === 'img' && lower.startsWith('data:image/')) {
            return /^data:image\/(png|jpeg|jpg|gif|webp);base64,/i.test(normalized);
        }
        return /^(https?:|mailto:)/i.test(normalized);
    };

    const sanitizeStyle = (value) => {
        const style = String(value || '');
        if (/expression\s*\(|url\s*\(|javascript:|vbscript:|behavior\s*:|-moz-binding/i.test(style)) return '';
        return style;
    };

    const sanitizeHtml = (html) => {
        if (typeof DOMParser === 'undefined') return String(html || '')
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
            .replace(/javascript\s*:/gi, '');

        const documentNode = new DOMParser().parseFromString(`<div id="xingyue-safe-root">${String(html || '')}</div>`, 'text/html');
        const root = documentNode.getElementById('xingyue-safe-root');
        if (!root) return '';

        const cleanNode = (node) => {
            [...node.children].forEach(child => {
                const tagName = child.tagName.toLowerCase();
                if (!SAFE_HTML_TAGS.has(tagName)) {
                    if (DROP_WITH_CONTENT.has(tagName)) {
                        child.remove();
                    } else {
                        cleanNode(child);
                        child.replaceWith(...child.childNodes);
                    }
                    return;
                }

                [...child.attributes].forEach(attribute => {
                    const name = attribute.name.toLowerCase();
                    if (name.startsWith('on') || (!SAFE_ATTRIBUTES.has(name) && !name.startsWith('aria-'))) {
                        child.removeAttribute(attribute.name);
                        return;
                    }
                    if ((name === 'href' || name === 'src') && !isSafeUrl(attribute.value, name, tagName)) {
                        child.removeAttribute(attribute.name);
                        return;
                    }
                    if (name === 'data-base-url' && !isSafeUrl(attribute.value, 'src', 'img')) {
                        child.removeAttribute(attribute.name);
                        return;
                    }
                    if (name === 'style') {
                        const safeStyle = sanitizeStyle(attribute.value);
                        if (safeStyle) child.setAttribute('style', safeStyle);
                        else child.removeAttribute('style');
                    }
                });

                if (tagName === 'a' && child.getAttribute('href')) {
                    child.setAttribute('target', '_blank');
                    child.setAttribute('rel', 'noopener noreferrer');
                }
                cleanNode(child);
            });
        };

        cleanNode(root);
        return root.innerHTML;
    };

    const extractUrls = (text) => {
        const matches = String(text || '').match(/https?:\/\/[^\s\u4e00-\u9fa5,，。;；]+/g) || [];
        return [...new Set(matches.map(url => url.replace(/[.,;?!。，；？！)）]+$/, '')))].slice(0, 3);
    };

    const parseContentForVision = (text) => {
        const source = String(text || '');
        const imageRegex = /!\[[^\]]*\]\((data:image\/([^;]+);base64,([^\)]+))\)/g;
        let lastIndex = 0;
        let match;
        const content = [];
        while ((match = imageRegex.exec(source)) !== null) {
            if (match.index > lastIndex) content.push({ type: 'text', text: source.slice(lastIndex, match.index) });
            content.push({ type: 'image_url', image_url: { url: match[1] } });
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < source.length) content.push({ type: 'text', text: source.slice(lastIndex) });
        return content.length ? content : source;
    };

    const filterImageFiles = (files, maximum = 9) => {
        const list = Array.from(files || []);
        const accepted = list.filter(file => String(file?.type || '').toLowerCase().startsWith('image/')).slice(0, maximum);
        return { accepted, rejectedCount: list.length - accepted.length };
    };

    window.XingyueRichContent = { sanitizeHtml, extractUrls, parseContentForVision, filterImageFiles };
})();
