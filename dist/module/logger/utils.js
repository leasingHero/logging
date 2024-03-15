"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateRedactions(inputs, maxNestingLevel = 5) {
    const patterns = [];
    for (const input of inputs) {
        for (let i = 0; i <= maxNestingLevel; i++) {
            const prefix = Array(i).fill('*').join('.');
            patterns.push(`${prefix}${i > 0 ? '.' : ''}${input}`);
        }
    }
    return patterns;
}
exports.default = generateRedactions;
//# sourceMappingURL=utils.js.map