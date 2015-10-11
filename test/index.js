import fs from 'fs';
import path from 'path';

// TODO: Implement a better smoke-test...
import '../src/index.js';

const tests = fs.readdirSync(__dirname).forEach((testFile) => {
  require(path.join(__dirname, testFile));
});
