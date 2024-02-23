function generateRedactions(
    inputs: string[],
    maxNestingLevel: number = 5,
): string[] {
    const patterns: string[] = [];

    for (const input of inputs) {
        for (let i = 0; i <= maxNestingLevel; i++) {
            const prefix: string = Array(i).fill('*').join('.');
            patterns.push(`${prefix}${i > 0 ? '.' : ''}${input}`);
        }
    }

    return patterns;
}

export default generateRedactions;
