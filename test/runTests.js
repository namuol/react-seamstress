import tape from 'tape';

function isFunc (obj) {
  return typeof obj === 'function';
}

export default function runTests ({funcName, func, tests, expandArguments=false}) {
  funcName = funcName || func.name;
  
  tape.test(`${funcName}`, (t) => {
    tests.forEach(({input, expected, capability}, testNum) => {
      const result = expandArguments ? func(...input) : func(input);
      t.deepEqual(result, expected, capability || `#${testNum}`);
    });
    t.end();
  });
}
