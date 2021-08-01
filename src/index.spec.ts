import { transform } from '@babel/core';
import syntaxJSX from 'babel-plugin-syntax-jsx';
import mergePlugin from './index';
import { PluginOptions } from './types';
import { mergeStyleFunction } from './constant';
import { format } from 'prettier';
// @ts-ignore
import formatOptions from './../.prettierrc.js';

function formatCode(sourceCode: string) {
  // return sourceCode;

  const codeString = format(sourceCode, formatOptions);
  console.log(codeString, 'codeString');
  return codeString;
}

function transformCode(source: string, debug = false, options: PluginOptions = {}) {
  const { enableMultipleStyle = false } = options;
  const code = formatCode(
    transform(source, {
      plugins: [[mergePlugin, { enableMultipleStyle }], syntaxJSX],
      configFile: false,
    })?.code ?? '',
  );
  if (debug) {
    // eslint-disable-next-line
    console.group('=======');
    // console.log(formatCode(source) + '\n');
    // eslint-disable-next-line
    // console.log(code);
    console.groupEnd();
  }
  return code;
}

describe('rn-merge-style', () => {
  it('value expression of style attribute: ObjectExpression', () => {
    expect(
      transformCode(
        `
import React from 'react'

function App() {
  return (
    <View style={{ width: 100 }} />
  )
}
`,
        true,
      ),
    ).toBe(
      formatCode(
        `
import React from 'react'

function App() {
  return <View style={{ 
      width: 100
    }}
  />
}
`,
      ),
    );
  });

  it('array expression', () => {
    expect(
      transformCode(
        `
          import React from 'react'

          function App() {
            return (
              <View style={[{ width: 100 }]} headerStyle={[{ width: 50 }]} />
            )
}
`,
        true,
      ),
    ).toBe(
      formatCode(
        `
          import React from 'react'

          ${mergeStyleFunction}
          function App() {
            return <View style={_mergeStyle([{ 
                width: 100
              }])}
              headerStyle={[
                { 
                  width: 50
                },
              ]}
            />
          }
`,
      ),
    );
  });

  it('array expression and multiple style', () => {
    expect(
      transformCode(
        `
          import React from 'react'

          function App() {
            return (
              <View style={[{ width: 100 }]} headerStyle={[{ width: 50 }]} />
            )
}
`,
        true,
        { enableMultipleStyle: true },
      ),
    ).toBe(
      formatCode(
        `
          import React from 'react'

          ${mergeStyleFunction}
          function App() {
            return <View style={_mergeStyle([{ 
                width: 100
              }])}
              headerStyle={_mergeStyle([
                { 
                  width: 50 
                }
              ])}
            />
          }
`,
      ),
    );
  });

  it('member expression', () => {
    expect(
      transformCode(
        `
import React from 'react'

function App() {
  return (
    <View 
    style={style.content} headerStyle={style.header} />
  )
}
`,
        true,
      ),
    ).toBe(
      formatCode(
        `
import React from 'react'

${mergeStyleFunction}

function App() {
  return (
    <View
      style={_mergeStyle(style.content)} headerStyle={style.header}
    />
  )
}
`,
      ),
    );
  });

  it('member expression and multiple style', () => {
    expect(
      transformCode(
        `
        import React from 'react'

        function App() {
          return (
            <View 
            style={style.content} headerStyle={style.header} />
          )
        }
`,
        true,
        { enableMultipleStyle: true },
      ),
    ).toBe(
      formatCode(
        `
        import React from 'react'

        ${mergeStyleFunction}

        function App() {
          return (
            <View
              style={_mergeStyle(style.content)}
              headerStyle={_mergeStyle(style.header)}
            />
          )
        }
`,
      ),
    );
  });
});
