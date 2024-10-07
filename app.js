const express = require('express') // 导入模块

const app = express() // 创建app实例

//导入cors
const cors=require('cors')
//将cors注册为全局
app.use(cors())
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // 解析 JSON 请求体
app.use(express.json()); // 处理 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 处理 URL 编码数据
// 注册路由
const DESRouter = require('./routes/des')
app.use('/api', DESRouter)

// 启动服务器
app.listen(8080, () => {
    console.log("server running at http://127.0.0.1:8080")
})
