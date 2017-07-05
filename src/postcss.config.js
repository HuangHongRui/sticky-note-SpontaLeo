//打包的时候出现错误，No Postcss config found，根据字面意义即Postcss没有配置，
//可能是版本原因导致，需要新建postcss.config.js文件对postcss进行配置

module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers: ['last 5 versions']
        })
    ]
}