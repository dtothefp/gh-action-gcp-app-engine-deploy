const path = require('path');
const { readFileSync, writeFileSync } = require('fs');
const changelogFp = path.resolve(__dirname, '..', 'CHANGELOG.md');

const { VERSION } = process.env;
const contents = readFileSync(changelogFp, 'utf8').split('\n');
const reducer = (re) => {
  return (idx, str, i) => {
    if (idx) return idx;

    return re.test(str) ? i : 0;
  };
};
const firstIndex = contents.reduce(reducer(/\[Unreleased\]$/), 0);
const lastIndex = contents.reduceRight(reducer(/^\[unreleased\]:/), 0);
var date = new Date();
var utcDate = new Date(date.toUTCString());

utcDate.setHours(utcDate.getHours() - 8);

var usDate = new Date(utcDate)
  .toLocaleDateString('en-US')
  .split('/');

const formattedDate = [
  ...usDate.slice(-1),
  ...usDate.slice(0, 2),
].join('-');

const newVersionLink = `## [${VERSION}] - ${formattedDate}`;
const headCompareLink = contents[lastIndex]
  .replace(/^(.+?v)[0-9]\.[0-9]\.[0-9](\.\.\.HEAD)$/, (a, b, c) => {
    return b + VERSION + c;
  });
const prevVsCurrComparLink = contents[lastIndex]
  .replace(/^\[unreleased\](:\s.+?)HEAD$/, (a, b) => {
    return `[${VERSION}]${b}v${VERSION}`;
  });

const newContents = [
  ...contents.slice(0, firstIndex),
  ...[contents[firstIndex], ''],
  newVersionLink,
  ...contents.slice(firstIndex + 1, lastIndex),
  headCompareLink,
  prevVsCurrComparLink,
  ...contents.slice(lastIndex + 1, contents.length)
];

console.log(`*** Writing CHANGELOG.md version: ${VERSION} ***`);

writeFileSync(changelogFp, newContents.join('\n'), 'utf8');
