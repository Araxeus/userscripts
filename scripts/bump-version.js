#!/usr/bin/env node
// Usage: node scripts/bump-version.js <file.user.js>...
// Bumps the patch version of the `// @version` field in each userscript header.
import { readFileSync, writeFileSync } from 'node:fs';

const VERSION_LINE = /^(\/\/\s*@version\s+)(\d+)\.(\d+)\.(\d+)(.*)$/m;

let failed = false;

for (const file of process.argv.slice(2)) {
    const source = readFileSync(file, 'utf8');
    const match = VERSION_LINE.exec(source);
    if (!match) {
        console.error(`${file}: no semver @version field found`);
        failed = true;
        continue;
    }
    const [line, prefix, major, minor, patch, rest] = match;
    const next = `${prefix}${major}.${minor}.${Number(patch) + 1}${rest}`;
    writeFileSync(file, source.replace(line, () => next));
    console.log(`${file}: ${major}.${minor}.${patch} -> ${major}.${minor}.${Number(patch) + 1}`);
}

process.exit(failed ? 1 : 0);
