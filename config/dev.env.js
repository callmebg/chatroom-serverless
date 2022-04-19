'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    IMG_URL: '"https://chatroom-1257987061.cos.ap-guangzhou.myqcloud.com"',
    SOCKET_URL: '"ws://service-mti0j9ns-1257987061.gz.apigw.tencentcs.com/release/websocket"',
    API_URL: '"http://service-mti0j9ns-1257987061.gz.apigw.tencentcs.com/release/api"'
})