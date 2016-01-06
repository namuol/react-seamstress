import arrayify from './arrayify';
import mergeStyles from './mergeStyles';
import getSubComponentStyles from './getSubComponentStyles';

import getInvalidStyleStates from './getInvalidStyleStates';
import getInvalidSubComponents from './getInvalidSubComponents';

const stringifyPropertyList = styleStates => styleStates.map(s=>`\`${s}\``).join(', ');

export default function validateStyles ({ styleStateTypes, subComponentTypes }, displayName, props, propName, component) {
  const subComponentStyles = getSubComponentStyles({
    styles: arrayify(props.styles),
  }) || {};

  const invalidStyleStates = getInvalidStyleStates({
    // We're only worried about root styles:
    style: mergeStyles(subComponentStyles.root),
    styleStateTypes,
  });

  const errors = [];

  if (invalidStyleStates) {
    const errorIntro = (invalidStyleStates.length > 1
      ? `[${stringifyPropertyList(invalidStyleStates)}] are not valid style-states of \`${displayName || component}\`.`
      : `${stringifyPropertyList(invalidStyleStates)} is not a valid style-state of \`${displayName || component}\`.`
    );

    errors.push(
      errorIntro + ' ' + 'Valid style-states are: [' +
        stringifyPropertyList(Object.keys(styleStateTypes)) +
      '].'
    );
  }
  
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