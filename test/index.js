import fs from 'fs';
import path from 'path';

fs.readdirSync(__dirname).forEach((testFile) => {
  require(path.join(__dirname, testFile));
});
