# Simple-DES 信息安全导论作业

### 项目介绍
这是信息安全导论的作业，编写了simple-des加密解密算法，能对简单的字符串数据进行加密, 算法流程如下图所示
<br>
![image](https://github.com/user-attachments/assets/ba99f7de-6d7e-4caf-abfd-0046bc8fb9a7)


### 项目环境
<ul>
  <li> HTML5 + CSS3 + JavaScript
  <li> Bootstrap 5.3
  <li> Node.js
</ul>

### 项目启动
```Bash
node app.js
```

### 项目目录
<ul>
  <li> app.js  //后端入口文件
  <li> node_modules //项目依赖
  <li> public //前端文件
  <li> routes //前后端接口
  <li> route-handle //加密解密算法、
  <li> readme.md //项目说明
  <li> report.pdf //测试报告
</ul>

### 使用说明
提供了三个功能:
1. 输入8bit二进制明密文进行加密解密
2. 输入任意长度字符串进行加密解密(通过ASCII码进行加密解密)
3. 输入任意对明密文进行暴力破解获取密钥


