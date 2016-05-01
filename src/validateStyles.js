import arrayify from './arrayify';
import getSubComponentStyles from './getSubComponentStyles';

import getInvalidSubComponents from './getInvalidSubComponents';

const stringifyPropertyList = (props) => props.map((s) => `\`${s}\``).join(', ');

export default function validateStyles ({ subComponentTypes }, displayName, props, propName, component) {
  const subComponentStyles = getSubComponentStyles({
    styles: arrayify(props.styles),
  }) || {};

  const errors = [];

  delete subComponentStyles.root;

  const invalidSubComponents = getInvalidSubComponents({
    subComponents: Object.keys(subComponentStyles),
    subComponentTypes,
  });

  if (invalidSubComponents) {
    const errorIntro = (invalidSubComponents.length > 1
      ? `[${stringifyPropertyList(invalidSubComponents)}] are not valid sub-components of \`${displayName || component}\`.`
      : `${stringifyPropertyList(invalidSubComponents)} is not a valid sub-component of \`${displayName || component}\`.`
    );

    errors.push(
      errorIntro + ' ' + 'Valid sub-components are: [' +
        stringifyPropertyList(Object.keys(subComponentTypes)) +
      '].'
    );
  }

  if (errors.length > 0) {
    return new Error(errors.join('\n'));
  }
}
