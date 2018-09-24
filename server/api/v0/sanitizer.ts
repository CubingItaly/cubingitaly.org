import * as sanitizeHtml from 'sanitize-html';

export function sanitize(source: string) {
    return sanitizeHtml(source, {
        allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'strong',
            'i', 'em', 'code', 'span', 'hr', 'br', 'table', 'thead', 'tbody', 'th', 'tr', 'td', 'div', 'frame', 'img',
            'blockquote', 'mark', 'figure', 'figcaption'],
        allowedAttributes: {
            '*': ['style', "class"],
            a: ['href', 'name', 'target'],
            img: ['src'],
            table: ['class']
        },
        allowedStyle: {
            '*': {
                'color': [/^\#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
                'background-color': [/^\#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
                'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
                // Match any number with px, em, or %
                'font-size': [/^\d+(?:px|em|%)$/]
            }
        },
        allowedSchemes: ['http', 'https'],
        allowedSchemesByTag: {
            img: ['data', 'http', 'https']
        },
        selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
        allowedIframeHostnames: ['www.youtube.com']
    });
}