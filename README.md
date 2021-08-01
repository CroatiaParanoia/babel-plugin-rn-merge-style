# 安装依赖
npm i
# 构建 index.js react.js 等 eslintrc 配置
npm run build
# 执行测试
npm test
# 自动修复 ESLint 错误
npm run eslint:fix
# 自动修复格式错误
npm run prettier:fix
# 检查当前是否覆盖了所有的规则
npm run test:rulesCoverage
# 发布新版本
npm version <major|minor|patch>
git push --follow-tags
npm publish
