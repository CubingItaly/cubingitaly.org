import * as sanitizeHtml from 'sanitize-html';

export function sanitize(source: string) {
    return sanitizeHtml(source, {
        allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'strong',
            'i', 'em', 'code', 'span', 'hr', 'br', 'table', 'thead', 'tbody', 'th', 'tr', 'td', 'div', 'frame', 'img',
            'blockquote', 'mark', 'figure', 'figcaption', 'oembed', 'iframe'],
        allowedAttributes: {
            '*': ['style', "class"],
            a: ['href', 'name', 'target'],
            img: ['src'],
            iframe: ['src','style','frameboard','allow','allowfullscreen'],
            table: ['class'],
            figure: ['class'],
            div: ['data-oembed-url']
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
        allowedSchemes: ['http', 'https', 'mailto'],
        allowedSchemesByTag: {
            img: ['data', 'http', 'https']
        },
        selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
        allowedIframeHostnames: ['www.youtube.com']
    });
}