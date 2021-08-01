import { types as Types, template as Template, PluginObj, PluginPass } from '@babel/core';
import { PluginOptions } from './types';
import { mergeStyleFunction, MERGE_STYLE_NAME } from './constant';

function findLastImportIndex(body: Types.Statement[]) {
  const bodyReverse = body.slice(0).reverse();
  let _index = 0;

  bodyReverse.some((node, index) => {
    if (node.type === 'ImportDeclaration') {
      _index = body.length - index - 1;
      return true;
    }
    return false;
  });

  return _index;
}

function getMatchRule(enableMultipleStyle: boolean) {
  if (enableMultipleStyle) {
    return {
      styleMatchRule: /[sS]tyle$/,
    };
  }

  return {
    styleMatchRule: /^style$/,
  };
}

function getPluginOpts(pluginPass: PluginPass) {
  return (pluginPass.opts || {}) as PluginOptions;
}

export default function (babel: { types: typeof Types; template: typeof Template }): PluginObj {
  const { types: babelTypes, template } = babel;
  const mergeStyleTemplate = template(mergeStyleFunction);
  const mergeStyleTemplateStat = mergeStyleTemplate();
  let needInjectMergeStyleTemplate = false;

  return {
    name: 'rn-merge-style',
    visitor: {
      Program: {
        enter(astPath, state: PluginPass) {},
        exit(astPath, state: PluginPass) {
          const { file } = state;
          const node = astPath.node;

          const lastImportIndex = findLastImportIndex(node.body);

          if (needInjectMergeStyleTemplate) {
            node.body.splice(lastImportIndex + 1, 0, ...([] as Types.Statement[]).concat(mergeStyleTemplateStat));
          }
        },
      },
      JSXOpeningElement({ node }, state) {
        const { file, opts = {} } = state;
        const { enableMultipleStyle = false } = getPluginOpts(state);
        const attributes = node.attributes;

        const { styleMatchRule } = getMatchRule(enableMultipleStyle);

        attributes.forEach((attribute) => {
          if (!babelTypes.isJSXAttribute(attribute)) return;
          const name = attribute.name;
          if (!name || typeof name.name !== 'string') return;
          const attrNameString = name.name;

          if (!attrNameString.match(styleMatchRule)) return;
          if (!attribute.value || babelTypes.isStringLiteral(attribute.value)) return;
          if (!('expression' in attribute!.value!)) return;
          const value = attribute.value;
          const expression = value.expression;
          const expressionType = expression.type;

          if (expressionType !== 'ObjectExpression') {
            needInjectMergeStyleTemplate = true;

            attribute.value = babelTypes.jSXExpressionContainer(
              babelTypes.callExpression(babelTypes.identifier(MERGE_STYLE_NAME), [expression as any]),
            );
          }
        });

        return '';
      },
    },
  };
}
