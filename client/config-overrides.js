const { override, fixBabelImports, addLessLoader, removeModuleScopePlugin,babelInclude } = require('customize-cra');
const path = require("path");

module.exports = override(
    babelInclude([path.resolve("src/"),path.resolve("../shared")]),

    removeModuleScopePlugin(),
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#274eff' },
    }),
);