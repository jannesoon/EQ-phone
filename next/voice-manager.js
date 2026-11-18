(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.XingyueVoice = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
    const MAX_SPEECH_LENGTH = 1000;
    const MAX_EXPRESSIVE_TAGS = 6;
    const MAX_EXPRESSIVE_TAG_LENGTH = 24;
    const MAX_EXPRESSIVE_CANDIDATE_LENGTH = MAX_SPEECH_LENGTH
        + MAX_EXPRESSIVE_TAGS * (MAX_EXPRESSIVE_TAG_LENGTH + 4);

    // These are the only v4-style tags the UI/director may insert.  The map
    // keeps model-facing mood names separate from the literal ElevenLabs tag
    // names; `neutral` can simply use the untagged original text.
    const EXPRESSIVE_SPEECH_TAG_MAP = Object.freeze({
        neutral: 'calmly',
        warm: 'warmly',
        curious: 'curious',
        sad: 'sadly',
        urgent: 'urgently',
        shy: 'shyly',
        playful: 'playfully',
        soft: 'softly',
        excited: 'excited',
        laugh: 'laughs',
        sigh: 'sighs'
    });
    const ALLOWED_EXPRESSIVE_SPEECH_TAGS = Object.freeze(
        Object.values(EXPRESSIVE_SPEECH_TAG_MAP).map(tag => `[${tag}]`)
    );
    const EXPRESSIVE_SPEECH_TAGS = ALLOWED_EXPRESSIVE_SPEECH_TAGS;
    const EXPRESSIVE_SPEECH_TAG_NAME_SET = new Set(Object.values(EXPRESSIVE_SPEECH_TAG_MAP));

    const codePointLength = value => Array.from(value).length;
    const isWhitespace = value => /^\s$/u.test(value);

    const prepareSpeechText = (value) => {
        let text = String(value || '')
            .replace(/<think>[\s\S]*?<\/think>/gi, '')
            .replace(/!\[[\s\S]*?\]\([\s\S]*?\)/g, '')
            .replace(/\[([\s\S]*?)\]\([\s\S]*?\)/g, '$1')
            .replace(/\([\s\S]*?\)/g, '')
            .replace(/（[\s\S]*?）/g, '')
            .replace(/【[\s\S]*?】/g, '')
            .replace(/\[[\s\S]*?\]/g, '')
            .replace(/[*#`>~\-]/g, '')
            .replace(/\n+/g, ' ')
            .trim();
        const truncated = text.length > MAX_SPEECH_LENGTH;
        if (truncated) text = text.slice(0, MAX_SPEECH_LENGTH) + '......';
        return { text: text || '嗯……', truncated };
    };

    /**
     * Parse a candidate without ever treating arbitrary bracket content as a
     * speech instruction.  An unmatched bracket, nested bracket, or unknown
     * tag makes the whole candidate invalid.
     */
    const parseExpressiveSpeechCandidate = (candidate) => {
        const tokens = [];
        let tagCount = 0;
        let cursor = 0;
        while (cursor < candidate.length) {
            if (candidate[cursor] === '[') {
                const closing = candidate.indexOf(']', cursor + 1);
                if (closing < 0) return null;
                const tagName = candidate.slice(cursor + 1, closing);
                if (!tagName || codePointLength(tagName) > MAX_EXPRESSIVE_TAG_LENGTH
                    || !EXPRESSIVE_SPEECH_TAG_NAME_SET.has(tagName)) return null;
                tagCount += 1;
                if (tagCount > MAX_EXPRESSIVE_TAGS) return null;
                tokens.push({ type: 'tag', value: tagName });
                cursor = closing + 1;
                continue;
            }
            if (candidate[cursor] === ']') return null;

            const start = cursor;
            while (cursor < candidate.length && candidate[cursor] !== '[' && candidate[cursor] !== ']') {
                cursor += 1;
            }
            tokens.push({ type: 'text', value: candidate.slice(start, cursor) });
        }
        return { tokens, tagCount };
    };

    /**
     * Flatten text tokens and mark only whitespace directly touching a tag as
     * optional.  Every non-whitespace character, and every original
     * whitespace character, must still match in order below.
     */
    const expressiveCandidateCharacters = (tokens) => {
        const characters = [];
        tokens.forEach((token, index) => {
            if (token.type !== 'text') return;
            const values = Array.from(token.value);
            let leadingWhitespaceEnd = 0;
            while (leadingWhitespaceEnd < values.length && isWhitespace(values[leadingWhitespaceEnd])) {
                leadingWhitespaceEnd += 1;
            }
            let trailingWhitespaceStart = values.length;
            while (trailingWhitespaceStart > 0 && isWhitespace(values[trailingWhitespaceStart - 1])) {
                trailingWhitespaceStart -= 1;
            }
            const tagBefore = index > 0 && tokens[index - 1].type === 'tag';
            const tagAfter = index + 1 < tokens.length && tokens[index + 1].type === 'tag';
            values.forEach((value, valueIndex) => {
                const optionalEdgeWhitespace = isWhitespace(value)
                    && ((tagBefore && valueIndex < leadingWhitespaceEnd)
                        || (tagAfter && valueIndex >= trailingWhitespaceStart));
                characters.push({ value, optionalEdgeWhitespace });
            });
        });
        return characters;
    };

    /**
     * Match candidate text to the prepared source.  This small dynamic
     * matcher lets edge whitespace be either the source whitespace or newly
     * introduced around a tag, while never allowing a changed/deleted/added
     * non-whitespace character.
     */
    const expressiveTextMatches = (originalPreparedText, candidateCharacters) => {
        const originalCharacters = Array.from(originalPreparedText);
        let reachable = new Set([0]);
        for (const candidateCharacter of candidateCharacters) {
            const next = new Set();
            for (const originalIndex of reachable) {
                if (originalCharacters[originalIndex] === candidateCharacter.value) {
                    next.add(originalIndex + 1);
                }
                if (candidateCharacter.optionalEdgeWhitespace && isWhitespace(candidateCharacter.value)) {
                    next.add(originalIndex);
                }
            }
            if (next.size === 0) return false;
            reachable = next;
        }
        return reachable.has(originalCharacters.length);
    };

    /**
     * Validate a model/director-produced expressive ElevenLabs script.
     *
     * The return value is the original candidate only when it is safe to send
     * to the voice adapter; invalid candidates return null so callers can use
     * the ordinary cleaned text instead.
     */
    const validateExpressiveSpeechText = (originalPreparedText, candidate) => {
        if (typeof originalPreparedText !== 'string' || typeof candidate !== 'string') return null;
        if (codePointLength(originalPreparedText) < 1
            || originalPreparedText.trim().length === 0
            || codePointLength(originalPreparedText) > MAX_SPEECH_LENGTH) return null;
        if (codePointLength(candidate) < 1
            || candidate.trim().length === 0
            || codePointLength(candidate) > MAX_EXPRESSIVE_CANDIDATE_LENGTH) return null;

        const parsed = parseExpressiveSpeechCandidate(candidate);
        if (!parsed) return null;
        // The all-neutral path is deliberately valid and does not need a tag.
        if (candidate === originalPreparedText && parsed.tagCount === 0) return candidate;
        if (parsed.tagCount === 0) return null;
        return expressiveTextMatches(originalPreparedText, expressiveCandidateCharacters(parsed.tokens))
            ? candidate
            : null;
    };

    const normalizeUrl = (value, fallback) => {
        let url = String(value || fallback || '').trim();
        if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
        return url;
    };

    const withOptionalProxy = (url, enabled) => enabled
        ? `https://corsproxy.io/?${encodeURIComponent(url)}`
        : url;

    const buildSpeechRequest = (config, text) => {
        const engine = config.ttsEngine || 'minimax';
        if (engine === 'elevenlabs') throw new Error('ElevenLabs 朗读需要连接本地主机');
        if (engine === 'siliconflow') {
            if (!String(config.siliconflowKey || '').trim()) throw new Error('请先配置 SiliconFlow 语音 Key');
            const url = 'https://api.siliconflow.cn/v1/audio/speech';
            return {
                engine,
                url: withOptionalProxy(url, config.enableCorsProxy),
                options: {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${config.siliconflowKey.trim()}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'FunAudioLLM/CosyVoice2-0.5B',
                        input: text,
                        voice: 'FunAudioLLM/CosyVoice2-0.5B:alex',
                        speed: Number.parseFloat(config.siliconflowSpeed) || 1
                    })
                }
            };
        }

        if (engine === 'openai') {
            if (!String(config.openaiTtsKey || '').trim()) throw new Error('请先配置 OpenAI 语音 Key');
            let url = normalizeUrl(config.openaiTtsUrl, 'https://api.openai.com/v1');
            if (url.endsWith('/chat/completions')) url = url.slice(0, -'/chat/completions'.length);
            if (!url.includes('/audio/speech')) url = `${url.replace(/\/$/, '')}/audio/speech`;
            return {
                engine,
                url: withOptionalProxy(url, config.enableCorsProxy),
                options: {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${config.openaiTtsKey.trim()}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: 'tts-1', input: text, voice: config.openaiTtsVoice || 'echo' })
                }
            };
        }

        if (!String(config.minimaxKey || '').trim()) throw new Error('请先配置 MiniMax 语音 Key');
        let url = normalizeUrl(config.minimaxUrl, 'https://api.minimaxi.com/v1/t2a_v2');
        url = url.replace('api.minimax.chat', 'api.minimaxi.com');
        if (!url.includes('/t2a_v2') && !url.includes('/audio/')) url = `${url.replace(/\/$/, '')}/v1/t2a_v2`;
        if (String(config.minimaxGroupId || '').trim() && !url.includes('GroupId=')) {
            url += `${url.includes('?') ? '&' : '?'}GroupId=${encodeURIComponent(config.minimaxGroupId.trim())}`;
        }
        return {
            engine: 'minimax',
            url: withOptionalProxy(url, config.enableCorsProxy),
            options: {
                method: 'POST',
                headers: { Authorization: `Bearer ${config.minimaxKey.trim()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: config.minimaxModel || 'speech-01-turbo',
                    text,
                    stream: false,
                    voice_setting: {
                        voice_id: config.minimaxVoiceId || 'male-qn-qingse',
                        speed: Number.parseFloat(config.minimaxSpeed) || 1,
                        vol: 1,
                        pitch: Number.parseInt(config.minimaxPitch, 10) || 0
                    }
                })
            }
        };
    };

    const hexToBlob = (hex) => {
        if (!hex || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) throw new Error('音频解析失败');
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
        return new Blob([bytes], { type: 'audio/mpeg' });
    };

    const requestSpeechAudio = async (
        config,
        value,
        fetchImpl,
        requestElevenLabs,
        expressiveSpeechText
    ) => {
        const { text, truncated } = prepareSpeechText(value);
        if (config.ttsEngine === 'elevenlabs') {
            if (!String(config.elevenlabsKey || '').trim()) throw new Error('请先配置 ElevenLabs 语音 Key');
            if (!String(config.elevenlabsVoiceId || '').trim()) throw new Error('请先配置 ElevenLabs 声音 ID');
            if (typeof requestElevenLabs !== 'function') throw new Error('ElevenLabs 朗读需要连接本地主机');
            const expressiveText = validateExpressiveSpeechText(text, expressiveSpeechText) || text;
            const blob = await requestElevenLabs({
                text: expressiveText,
                apiKey: config.elevenlabsKey.trim(),
                voiceId: config.elevenlabsVoiceId.trim(),
                modelId: config.elevenlabsModel === 'eleven_v4_turbo' ? 'eleven_v4_turbo' : 'eleven_v4'
            });
            if (!blob || blob.size === 0) throw new Error('ElevenLabs 音频解析失败');
            return { blob, truncated };
        }
        const request = buildSpeechRequest(config, text);
        const runFetch = fetchImpl || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
        if (!runFetch) throw new Error('当前环境无法连接语音服务');
        const response = await runFetch(request.url, request.options);
        if (!response.ok) throw new Error(`语音接口返回错误（HTTP ${response.status}）`);
        let blob = await response.blob();
        if (request.engine === 'minimax' && blob.type.includes('application/json')) {
            const payload = JSON.parse(await blob.text());
            if (payload.base_resp && payload.base_resp.status_code !== 0) {
                throw new Error(payload.base_resp.status_msg || 'MiniMax 语音生成失败');
            }
            blob = hexToBlob(payload.data && payload.data.audio);
        }
        if (!blob || blob.size === 0) throw new Error('音频解析失败');
        return { blob, truncated };
    };

    const recognitionErrorMessage = (code) => {
        if (code === 'not-allowed' || code === 'service-not-allowed') return '麦克风权限未开启：请在浏览器地址栏的网站设置中允许麦克风，然后刷新重试';
        if (code === 'no-speech') return '没有检测到语音，请再试一次';
        if (code === 'audio-capture') return '没有找到可用的麦克风';
        if (code === 'network') return '语音识别网络连接失败';
        return '语音识别出错，请重试';
    };

    const createSpeechRecognition = ({ scope, onStart, onTranscript, onError, onEnd } = {}) => {
        const host = scope || (typeof window !== 'undefined' ? window : {});
        const Recognition = host.SpeechRecognition || host.webkitSpeechRecognition;
        if (!Recognition) return null;
        const recognition = new Recognition();
        recognition.lang = 'zh-CN';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.maxAlternatives = 1;
        recognition.onstart = () => onStart && onStart();
        recognition.onresult = (event) => {
            let finalText = '';
            let interimText = '';
            for (let i = 0; i < event.results.length; i += 1) {
                const transcript = event.results[i][0] ? event.results[i][0].transcript : '';
                if (event.results[i].isFinal) finalText += transcript;
                else interimText += transcript;
            }
            if (onTranscript) onTranscript({ finalText, interimText });
        };
        recognition.onerror = (event) => onError && onError(recognitionErrorMessage(event.error), event.error);
        recognition.onend = () => onEnd && onEnd();
        return recognition;
    };

    return {
        MAX_SPEECH_LENGTH,
        MAX_EXPRESSIVE_TAGS,
        MAX_EXPRESSIVE_TAG_LENGTH,
        MAX_EXPRESSIVE_CANDIDATE_LENGTH,
        EXPRESSIVE_SPEECH_TAG_MAP,
        EXPRESSIVE_SPEECH_TAGS,
        EXPRESSIVE_SPEECH_TAG_NAMES: Object.freeze(Array.from(EXPRESSIVE_SPEECH_TAG_NAME_SET)),
        ALLOWED_EXPRESSIVE_SPEECH_TAGS,
        prepareSpeechText,
        validateExpressiveSpeechText,
        buildSpeechRequest,
        hexToBlob,
        requestSpeechAudio,
        recognitionErrorMessage,
        createSpeechRecognition
    };
});
