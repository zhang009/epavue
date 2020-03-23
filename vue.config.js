//首先定义代理对象
let proxyObj = {};
proxyObj['/ws'] = {
    ws: true,
    target: "ws://localhost:8081"
};
proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8081',//目标转发地址，即把http请求转发到哪里
    changeOrigin: true,
    pathRewrite: {//请求地址需不需要重写
        '^/': ''
    }
}
module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
}