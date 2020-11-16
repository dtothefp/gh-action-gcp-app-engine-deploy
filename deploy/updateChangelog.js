const path = require('path');
const { readFileSync, writeFileSync } = require('fs');
const changelogFp = path.resolve(__dirname, '..', 'CHANGELOG.md');

const semverRe = /^##\s\[[0-9]\.[0-9]\.[0-9]\]/
const { VERSION } = process.env;
const contents = readFileSync(changelogFp, 'utf8').split('\n');
const reducer = (re) => {
  return (idx, str, i) => {
    if (idx) return idx;

    return re.test(str) ? i : 0;
  };
};
const firstIndex = contents.reduce(reducer(/\[Unreleased\]$/), 0);
const lastIndex = contents.reduce(reducer(/^\[unreleased\]:/), 0);
var date = new Date();
var utcDate = new Date(date.toUTCString());

utcDate.setHours(utcDate.getHours()-8);

var usDate = new Date(utcDate)
  .toLocaleDateString('en-US')
  .split('/');

const formattedDate = [
  ...usDate.slice(-1),
  ...usDate.slice(0, 2),
].join('-');

const newContents = [
  ...contents.slice(0, firstIndex),
  ...[contents[firstIndex], '\n'],
  `## [${VERSION}] - ${formattedDate}`,
  ...contents.slice(firstIndex + 1, lastIndex),
  contents[lastIndex].replace(/^(.+?v)[0-9]\.[0-9]\.[0-9](\.\.\.HEAD)$/, (a, b, c) => {
    return b + VERSION + c;
  }),
  contents[lastIndex].replace(/^\[unreleased\](:\s.+?)HEAD$/, (a, b) => {
    return `[${VERSION}]${b}v${VERSION}`;
  }),
  ...contents.slice(lastIndex + 1, contents.length)
];

writeFileSync(changelogFp, newContents.join('\n'), 'utf8');
