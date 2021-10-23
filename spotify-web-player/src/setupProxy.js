const {createProxyMiddleware} = require('http-proxy-middleware');

const target = 'http://127.0.0.1:5000/ '

module.exports = function (app) {
    app.use(createProxyMiddleware(`/auth/**`, { 
        target
    }));
};