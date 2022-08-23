const path = require('path')
// 引入当前文件
let versionQa = require('./versionQa.json')
let versionProd = require('./versionProd.json')
// 引用 fs 模块，用于写入文件
const fs = require('fs')
// 递增版本号
function addVersion(pJson) {
    let version = '1.0.9'
    if (!pJson.version) return version
    const strList = pJson.version.split('.')
    strList[2]++
    if (strList[1] >= 99) {
        strList[0]++
        strList[1] = 0
    }
    if (strList[2] >= 99) {
        strList[1]++
        strList[2] = 0
    }
    return strList.join('.')
}
// 版本号递增
if (process.env.VUE_APP_TYPE === 'prod') {
    versionProd.version = addVersion(versionProd)
    fs.writeFile('./versionProd.json', JSON.stringify(versionProd), (err) => {
        if (err) {
            console.error(err)
            return false
        }
        let newPack = require('./versionProd.json')
        console.log('生产新版本号生成成功', newPack)
    })
} else if (process.env.VUE_APP_TYPE === 'qa') {
    versionQa.version = addVersion(versionQa)
    fs.writeFile('./versionQa.json', JSON.stringify(versionQa), (err) => {
        if (err) {
            console.error(err)
            return false
        }
        let newPack = require('./versionQa.json')
        console.log('测试新版本号生成成功', newPack)
    })
}

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? (process.env.VUE_APP_TYPE === 'saas' ? process.env.VUE_APP_BASE + '/app/' : './') : '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap: false,
    // //反向代理的配置
    devServer: {
        port: '8090',
        //不显示警告
        overlay: {
            warnings: false,
            errors: false,
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        proxy: {
            '^/mapi/app': {
                target: 'https://salesdev.rsun.com',
                // target: 'http://172.20.69.48:15006',
                ws: true, //// 是否启用websockets
                changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRewrite: {}, //这里重写路径
            },
            '/mapi': {
                target: 'https://salesdev.rsun.com',
                // target: 'http://172.19.10.159:15006' , //秋缘
                // target: 'http://172.19.10.104:15006', //秋缘
                // target: 'http://172.19.10.104:15006', // chale
                ws: true, //// 是否启用websockets
                changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRewrite: {}, //这里重写路径
            },
            '^/mapi/appointment': {
                target: 'https://salesdev.rsun.com',
                // target: 'http://172.19.10.159:15006', //秋缘

                ws: true, //// 是否启用websockets
                changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRewrite: {}, //这里重写路径
            },
            '/captchaapi': {
                target: 'https://salesdev2.rsun.com',
                ws: true, //// 是否启用websockets
                changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRewrite: { '^/captchaapi': '/captchaapi' }, //这里重写路径
            },
            '/rptapi': {
                target: 'https://salesdev.rsun.com',
                // target: 'http://172.19.10.104:15017', // chale
                // target: 'http://172.19.10.159:15017', // 秋缘
                ws: true, //// 是否启用websockets
                changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRewrite: {
                    '^/rptapi': '/rptapi',
                }, //这里重写路径
            },
        },
    },
    configureWebpack: {
        name: '弘客云',
        resolve: {
            alias: {
                '@': resolve('src'),
                '@c': resolve('src/components'),
                '@u': resolve('src/utils'),
                '@v': resolve('src/views'),
            },
        },
        plugins: [],
        output: {
            library: 'app',
            libraryTarget: 'umd',
        },
    },
    chainWebpack(config) {
        // set preserveWhitespace
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap((options) => {
                options.compilerOptions.preserveWhitespace = true
                return options
            })
            .end()
        config.module
            .rule('images')
            .test(/\.(png|jpeg|jpg)$/)
            .use('url-loader')
            .loader('url-loader')
            .options({
                limit: 1024 * 10,
                name: 'static/[name].[ext]',
            })
            .end()

        config
            // https://webpack.js.org/configuration/devtool/#development
            .when(
                process.env.NODE_ENV === 'development',
                //config => config.devtool('cheap-source-map')
                (config) => config.devtool('source-map')
            )
        config.when(process.env.NODE_ENV !== 'development', (config) => {
            config.optimization
                // 是否压缩代码
                .minimize(true)
                .minimizer('terser')
                .tap((args) => {
                    let { terserOptions } = args[0]
                    // 正式环境下，删除console和debugger
                    terserOptions.compress.drop_console = true
                    terserOptions.compress.drop_debugger = true
                    return args
                })
        })
    },
    css: {
        loaderOptions: {
            less: {
                globalVars: {
                    imgUrl: `~${process.env.VUE_APP_IMG_URL}`,
                },
                modifyVars: {
                    hack: `true; @import "${path.join(__dirname, './src/theme/index.less')}";`,
                },
                javascriptEnabled: true,
            },
        },
    },
    // 三方插件的选项
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [path.resolve(__dirname, './src/assets/styles/variables.less'), path.resolve(__dirname, './src/assets/styles/mixins.less')],
        },
    },
}
