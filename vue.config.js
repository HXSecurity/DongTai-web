const path = require('path')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
    publicPath: '/',
    outputDir: './dist',
    lintOnSave: true,
    chainWebpack: (config) => {
        config.resolve.alias.set('@', resolve('src'))
    },
    devServer: {
        // During local test, configure host and add 127.0.0.1 dev.iast.huoxian.cn
        host: process.env.DEVSERVER_HOST,
        // Module hot swap with webpack enabled
        hot: true,
        // Only hot replacements are allowed
        hotOnly: true,
        https: true,
        port: 1024,
        open: true,
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: process.env.VUE_TARGET_HOST,
                changeOrigin: true
            },
            [process.env.VUE_APP_BASE_API_V2]: {
                target: process.env.VUE_TARGET_HOST,
                changeOrigin: true
            },
            [process.env.VUE_APP_BASE_SCA_V1]: {
                target: process.env.VUE_TARGET_HOST,
                changeOrigin: true
            },
            [process.env.VUE_APP_BASE_SCA_V2]: {
                target: process.env.VUE_TARGET_HOST,
                changeOrigin: true
            },
            [process.env.VUE_APP_UPLOAD]: {
                target: process.env.VUE_TARGET_HOST,
                changeOrigin: true
            },
            '/openapi': {
                target: process.env.VUE_TARGET_HOST,
                changeOrigin: true
            },
        }
    }
}
