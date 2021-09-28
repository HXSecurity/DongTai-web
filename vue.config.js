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
    host: 'dev-iast.huoxian.cn',
    // Module hot swap with webpack enabled
    hot: true,
    // Only hot replacements are allowed
    hotOnly: true,
    https:true,
    port: 80,
    open: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_TARGET_HOST,
        changeOrigin: true
      }
    }
  }
}
