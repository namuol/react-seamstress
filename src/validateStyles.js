import arrayify from './arrayify';
import getSubComponentStyles from './getSubComponentStyles';

import getInvalidSubComponents from './getInvalidSubComponents';
import getExpectedPropsFromSelector from './getExpectedPropsFromSelector';

const stringifyPropertyList = (props) => props.map((s) => `'::${s}'`).join('\n');

const validSelector = /^(\[\s*(\w+)\s*(\s*=\s*([^\]]+)\s*)?\s*\])+$|^(\[\s*(\w+)\s*(\s*=\s*([^\]]+)\s*)?\s*\]*(::\w+))$|^(::\w+)$/;

const validSelectorExamples = [
  '::subComponent',
  '[prop]',
  '[prop=false]',
  '[prop=42]',
  '[prop="string"]',
  '[prop]::subComponent',
  '[prop1][prop2="string"]::subComponent',
];

const helpfulExamplesString = `Here are some examples of valid selectors:\n${validSelectorExamples.map((s) => '  ' + s).join('\n')}`;

export default function validateStyles ({
  subComponentTypes,
  propTypes,
}, props, propName, componentName) {
  const errors = [];

  const styles = arrayify(props[propName]);

  styles.forEach((styleSet) => {
    if (typeof styleSet !== 'object') {
      return;
    }

    Object.keys(styleSet).forEach((selector) => {
      if (!validSelector.test(selector)) {
        errors.push(`Seamstress: Malformed selector: "${selector}"\n\n${helpfulExamplesString}`);
      }
    });
  });

  const subComponentStyles = getSubComponentStyles({
    styles,
  }) || {};

  delete subComponentStyles.root;

  const invalidSubComponents = getInvalidSubComponents({
    subComponents: Object.keys(subComponentStyles),
    subComponentTypes,
  });

  if (invalidSubComponents) {
    const errorIntro = (invalidSubComponents.length > 1
      ? `[${stringifyPropertyList(invalidSubComponents)}] are not valid sub-components of \`${componentName}\`.`
      : `${stringifyPropertyList(invalidSubComponents)} is not a valid sub-component of \`${componentName}\`.`
    );

    errors.push(
      errorIntro + ' ' + 'Valid sub-components are: [' +
        stringifyPropertyList(Object.keys(subComponentTypes)) +
      '].'
    );
  }

  if (propTypes) {
    styles.filter((s) => !!s && (typeof s === 'object')).forEach((styles) => {
      Object.keys(styles).forEach((propString) => {
        // const addendum = `\n\nHint: The invalid prop selector in question is \`${propString}\`.`;
        let expectedProps;
        try {
          expectedProps = getExpectedPropsFromSelector(propString);
        } catch (error) {
          errors.push(error.message || error);
        }

        if (expectedProps) {
          Object.keys(expectedProps).forEach((propName) => {
            try {
              const error = propTypes[propName](expectedProps, propName, componentName);
              if (error instanceof Error) {
                errors.push(error.message);
              }
            } catch (error) {
              errors.push(error.message || error);
            }
          });
        }
      });
    });
  }

  if (errors.length > 0) {
    return new Error(errors.join('\n'));
  }
}
