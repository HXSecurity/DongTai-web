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
    host: 'localhost',
    // 启用 webpack 的模块热替换
    hot: true,
    // 只允许热替换
    hotOnly: true,
    port: 8091,
    open: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_TARGET_HOST,
        changeOrigin: true
      }
    }
  }
}
