module.exports = {
    publicPath: '/vuepneumonia/',
    devServer: {
        proxy: {
            '/forum/home/v1/info': {
                target: 'https://i.snssdk.com/forum/home/v1/info/',
                pathRewrite: {
                    '^/forum/home/v1/info': ''
                }
            }
        }
    },
    configureWebpack: {
        externals: {
            vue: "Vue",
            //vuex: "Vuex",
            //"vue-router": "VueRouter",
            "element-ui": "ELEMENT"
        }
    }
}