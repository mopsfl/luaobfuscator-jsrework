export default class Misc {
    randomHex(num: number, max: number) {
        var hue = Math.floor(360 * num / max);
        return "#" + this.hslToHex(hue, 100, 50);
    }

    getRandomHex(index: number, max: number, hueStart: number, hueEnd: number, satStart: number, satEnd: number, lightStart: number, lightEnd: number) {
        const hueRange = hueEnd - hueStart;
        const hueInterval = hueRange / max;
        const hue = hueStart + index * hueInterval;
        const satRange = satEnd - satStart;
        const satInterval = satRange / max;
        const sat = satStart + index * satInterval;
        const lightRange = lightEnd - lightStart;
        const lightInterval = lightRange / max;
        const light = lightStart + index * lightInterval;
        return this.hslToHex(hue, sat, light);
    }

    hslToHex(h: number, s: number, l: number) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        return toHex(r) + toHex(g) + toHex(b);
    }

    getTick() {
        return new Date().getTime()
    }

    toCamelCase(str: string) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    formatBytes(bytes: number, decimals: number = 2): string {
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        if (!+bytes) return `0 ${sizes[0]}`
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizes[i]}`;
    }
}