// vue.config.js

module.exports = {

    //publicPath: '/dist/',  //打包运行环境的根路径为/dist

    devServer: {  // 开发调试服务器配置项

        open: true,  // npm run serve后自动打开页面

        port: 10000,  // 开发服务器运行端口号

        compress: true, // 启用静态资源压缩算法

        disableHostCheck: true
    }

}