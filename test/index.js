import fs from 'fs';
import path from 'path';

const tests = fs.readdirSync(__dirname).forEach((testFile) => {
  require(path.join(__dirname, testFile));
});
