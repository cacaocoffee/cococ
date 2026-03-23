const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../src');
const TOP_LEVEL = ['lib', 'hooks', 'components', 'api', 'data', 'dto'];

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (/\.(jsx?|tsx?)$/.test(e.name)) out.push(full);
  }
  return out;
}

let totalFiles = 0;
for (const file of walk(SRC)) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  const fileDir = path.dirname(file);

  content = content.replace(/from\s+(["'])(\.[^"']+)\1/g, (match, quote, importPath) => {
    const resolved = path.resolve(fileDir, importPath);
    const relToSrc = path.relative(SRC, resolved).split(path.sep).join('/');
    const topDir = relToSrc.split('/')[0];
    if (TOP_LEVEL.includes(topDir)) {
      changed = true;
      return `from ${quote}@/${relToSrc}${quote}`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content);
    totalFiles++;
    console.log('✓', path.relative(SRC, file));
  }
}
console.log('\n총', totalFiles, '개 파일 업데이트 완료');
