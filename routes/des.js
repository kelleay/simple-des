const express = require('express')

const router = express.Router()

const DESHandle = require('../route-handle/SDES/sdes.js')

router.post('/encrypt', (req, res) => {
    console.log(req.body)
    const { plainBlock, key } = req.body; // 提取参数
    try {
        let cipherBlock = DESHandle.Encryption(plainBlock, key).toString().replace(/,/g, ''); // 假设这是你的加密函数
        res.send({ data: cipherBlock });
    } catch (error) {
        console.error('加密过程中出现错误:', error);
        res.status(500).send({ error: '加密失败' });
    }
})

router.post('/decrypt', (req, res) => {
    const { cipherBlock, key } = req.body; // 提取参数
    try {
        let plainBlock = DESHandle.Decryption(cipherBlock, key).toString().replace(/,/g, ''); // 假设这是你的加密函数
        res.send({ data: plainBlock });
    } catch (error) {
        console.error('加密过程中出现错误:', error);
        res.status(500).send({ error: '加密失败' });
    }
})

router.post('/exencrypt', (req, res) => {
    const { plainText, key } = req.body; // 提取参数
    try {
        let cipherText = DESHandle.exEncryption(plainText, key)
        res.send({ data: cipherText });
    } catch (error) {
        console.error('加密过程中出现错误:', error);
        res.status(500).send({ error: '加密失败' });
    }
})

router.post('/exdecrypt', (req, res) => {
    const { cipherText, key } = req.body; // 提取参数
    try {
        let plainText = DESHandle.exDecryption(cipherText, key)
        res.send({ data: plainText });
    } catch (error) {
        console.error('加密过程中出现错误:', error);
        res.status(500).send({ error: '加密失败' });
    }
})

router.post('/cracking', (req, res) => {
    const PlainAndCipherPair = req.body.PlainAndCipherPair; // 提取参数
    console.log(PlainAndCipherPair)
    let data = DESHandle.cracking(PlainAndCipherPair)
    res.send(data)
})


module.exports = router