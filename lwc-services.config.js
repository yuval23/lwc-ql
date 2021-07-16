// Find the full example of all available configuration options at
// https://github.com/muenzpraeger/create-lwc-app/blob/main/packages/lwc-services/example/lwc-services.config.js


const buildFolder = './dist';
const srcFolder = 'src/client';

module.exports = {
    buildDir: `${buildFolder}`,
    sourceDir: `./${srcFolder}`,
    bundler: 'webpack',
    mode: 'development',
    resources: [
        { from: `${srcFolder}/resources/`, to: `${buildFolder}/resources/` },
        {
            from: 'node_modules/@salesforce-ux/design-system/assets',
            to: `${srcFolder}/assets`
        },
        { from: `${srcFolder}/assets/`, to: `${buildFolder}/assets/` },
    ],
    
    devServer: {
        proxy: { '/': 'http://localhost:5000' }
    },

    // Find the detailed description here: https://www.npmjs.com/package/@lwc/compiler
    lwcCompilerOutput: {
        production: {
            compat: false,
            minify: true,
            env: {
                NODE_ENV: 'production'
            }
        }
    },
    lwcCompilerStylesheetConfig: {
        customProperties: { allowDefinition: true }
    }
};