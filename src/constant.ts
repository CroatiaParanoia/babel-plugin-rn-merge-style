export const MERGE_STYLE_NAME = '_mergeStyle';

export const mergeStyleFunction = `
function ${MERGE_STYLE_NAME}(styleArr) {
  return [].concat(styleArr).reduce((result, style) => {
    return Object.assign(result, style);
  }, {});
}
`;
