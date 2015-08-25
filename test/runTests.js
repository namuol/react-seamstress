import tape from 'tape';

function isFunc (obj) {
  return typeof obj === 'function';
}

export default function runTests ({funcName, func, tests, expandArguments=false}) {
  funcName = funcName || func.name;
  
  tests.forEach(({input, expected, capability}, testNum) => {
    tape.test(`${funcName} ${capability || `#${testNum}`}`, (t) => {
      const result = expandArguments ? func(...input) : func(input);
      
      t.deepEqual(result, expected);
      t.end();
    });
  });
}
