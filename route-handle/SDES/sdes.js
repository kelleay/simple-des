const IP = [2, 6, 3, 1, 4, 8, 5, 7]
const _IP = [4, 1, 3, 5, 7, 2, 8, 6]
const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6]
const P8 = [6, 3, 7, 4, 8, 5, 10, 9]
const EPBox = [4, 1, 2, 3, 2, 3, 4, 1]
const SBox1 = [
    [1, 0, 3, 2],
    [3, 2, 1, 0],
    [0, 2, 1, 3],
    [3, 1, 0, 2]
]
const SBox2 = [
    [0, 1, 2, 3],
    [2, 3, 1, 0],
    [3, 0, 1, 2],
    [2, 1, 0, 3]
]
const SPBox = [2, 3, 4, 1]

// 明文
const plainText = [1, 0, 0, 1, 1, 0, 1, 0]

// 密钥
let K = [1, 0, 0, 0, 1, 0, 1, 0, 1, 0]  //密钥(需要输入)
let K1 = [], K2 = [] // 生成的轮密钥


const test = [
    {
        plain: "hello",
        cipher: "? ~~L"
    }
]
// cracking(test)



// 处理输入的长字符串
function processPlainText(inputString){
    const groups = []
    for(let char of inputString){
        const codePoint = char.charCodeAt(0);
        const ASCIIBinary = codePoint.toString(2).padStart(8, '0'); //转化为二进制
        const groupBlock = []
        for(let index = 0; index < 8; index ++) {
            groupBlock[index] = ASCIIBinary[index];
        } 
        groups.push(groupBlock);
    }
    return groups;
}



// 加密
function Encryption(plainBlock, key) {
    // plainBlock是输入的字符串， 转化为数组
    let plainBlockArr = []
    for(let index = 0; index < 8; index ++) plainBlockArr[index] = plainBlock[index]
    // key是输入的字符串， 转化为数组
    for(let index = 0; index < 10; index ++){
        K[index] = key[index];
    }
    keysExtension(); //生成轮密钥
    return permute(roundF(Swap(roundF(permute(plainBlock, IP), 1)), 2), _IP)
}

// 解密
function Decryption(cipherTextBlock, key) {
    let cipherBlockArr = []
    for(let index = 0; index < 8; index ++) cipherBlockArr[index] = cipherTextBlock[index]
    for(let index = 0; index < 10; index ++){
        K[index] = key[index];
    }
    keysExtension();
    return permute(roundF(Swap(roundF(permute(cipherBlockArr, IP), 2)), 1), _IP)
}

// 扩展加密
function exEncryption(inputString, key){
    for(let index = 0; index < 10; index ++){
        K[index] = key[index];
    }
    const Blocks = processPlainText(inputString)
    let res = ""
    for(let index = 0; index < Blocks.length; index ++){
        const cipherBlock = Encryption(Blocks[index], K) // 二进制
        var ASCIIValue = 0;  // ASCII码值
        for(let i = 0; i < 8; i ++){ 
            ASCIIValue += cipherBlock[i] * Math.pow(2, 7 - i);
        }
        res += String.fromCharCode(ASCIIValue); //转化成字符
    }
    return res;
}

// 扩展解密
function exDecryption(cipherString, key) {
    for(let index = 0; index < 10; index ++){
        K[index] = key[index];
    }
    const Blocks = processPlainText(cipherString)
    let res = ""
    for(let index = 0; index < Blocks.length; index ++){
        const cipherBlock = Decryption(Blocks[index], K) // 二进制
        var ASCIIValue = 0;  // ASCII码值
        for(let i = 0; i < 8; i ++){ 
            ASCIIValue += cipherBlock[i] * Math.pow(2, 7 - i);
        }
        res += String.fromCharCode(ASCIIValue); //转化成字符
    }
    return res;
}

// 暴力破解密钥
function cracking(PlainAndCipherPair){
    let currTime = new Date();
    console.log("破解前时间: " +  currTime.getHours() + ":" + currTime.getMinutes() + ":" + 
currTime.getSeconds() + " . " + currTime.getMilliseconds() + "ms")
    let isCracking = false
    let resKey = []
    for(let k = 0; k < 1024; k ++)  // 密钥只有8bit 最大只有127
    {   
        let key = []; // 密钥数组
        let count = 0
        for(let index = 0; index < 10; index ++){
            key[index] = (k >> (9 - index)) & 1;
        }
        K = key;
        for(let pair of PlainAndCipherPair){
            const plain = pair.plain
            const cipher = pair.cipher
            if(judgeBinary(plain) && judgeBinary(cipher)){
                if(judge(Encryption(plain, K), cipher)){
                    count ++
                }
            }
            else if(exEncryption(plain, K) === cipher){
                count ++
            }
        }
        if(count === PlainAndCipherPair.length) {
            resKey.push(K)
            isCracking = true
        }
    }
    let currTime1 = new Date();
    console.log("破解后时间: " +  currTime1.getHours() + ":" + currTime1.getMinutes() + ":" + 
currTime1.getSeconds() + " . " + currTime1.getMilliseconds() + "ms")
    const time = currTime1.getMilliseconds() - currTime.getMilliseconds()
    console.log("破解时间: ", time + "ms")
    if(isCracking === false) {
        return {
            res: false,
            time: time
        }
    }    
    return {
        res: resKey,
        time: time
    }   
}

// 判断是否为八位二进制
function judgeBinary(text){
    if(text.length !== 8) return false
    for(let index = 0; index < 8; index ++){
        if(text[index] !== "0" && text[index] !== "1") return false
    }
    return true
}

// 判断是否相符
function judge(en, ci){
    for(let index = 0; index < 8; index ++) {
        if(en[index] !== ci[index] - '0') return false
    }
    return true
}

// 密钥扩展
function keysExtension() {
    let P10_K = permute(K, P10)
    let shift1_P10_K = shift(P10_K, 1)
    let shift2_P10_K = shift(P10_K, 2)
    K1 = permute(shift1_P10_K, P8)
    K2 = permute(shift2_P10_K, P8)
}
// 左移 i 位
function shift(input, i){
    const res = []
    const len = input.length / 2
    // 左
    for(let index = 0; index < len; index ++) {
        res[index] = input[(index + i) % len]
    }
    // 右
    for(let index = len; index < input.length; index ++){
        res[index] = input[(index + i) % len + len]
    }
    return res
}
// 置换
function permute(inBlock, permutationBox){
    const res = []
    for(let index = 0; index < permutationBox.length; index ++) {
        res[index] = inBlock[permutationBox[index] - 1]
    }
    return res
}
// 轮函数
function roundF(inBlock, i){
    let leftBlock = [], rightBlock = []
    const len = inBlock.length / 2
    for(let index = 0; index < len; index ++) {
        leftBlock[index] = inBlock[index]
        rightBlock[index] = inBlock[index + len]
    }
    let EPBox_rightBlock = permute(rightBlock, EPBox)
    for(let index = 0; index < EPBox_rightBlock.length; index ++) {
        if(i === 1) EPBox_rightBlock[index] ^= K1[index]
        else  EPBox_rightBlock[index] ^= K2[index]
    }
    SBox1_rowIndex = (EPBox_rightBlock[0] << 1) + EPBox_rightBlock[3]
    SBox1_colIndex = (EPBox_rightBlock[1] << 1) + EPBox_rightBlock[2]
    SBox2_rowIndex = (EPBox_rightBlock[4] << 1) + EPBox_rightBlock[7]
    SBox2_colIndex = (EPBox_rightBlock[5] << 1) + EPBox_rightBlock[6]
    let SBox_EPBox_rightBlock = []
    SBox_EPBox_rightBlock[0] = (SBox1[SBox1_rowIndex][SBox1_colIndex] >> 1) & 1
    SBox_EPBox_rightBlock[1] = SBox1[SBox1_rowIndex][SBox1_colIndex] & 1
    SBox_EPBox_rightBlock[2] = (SBox2[SBox2_rowIndex][SBox2_colIndex] >> 1) & 1
    SBox_EPBox_rightBlock[3] = SBox2[SBox2_rowIndex][SBox2_colIndex] & 1
    const SPBox_SBox_EPBox_rightBlock = permute(SBox_EPBox_rightBlock, SPBox)
    let res = [] // 结果
    for(let index = 0; index < 4; index ++) {
        leftBlock[index] ^= SPBox_SBox_EPBox_rightBlock[index]
        res[index] = leftBlock[index]
        res[index + 4] = rightBlock[index]
    }
    return res;
}
// 左右交换
function Swap(input) {
    const res = []
    for(let index = 0; index < input.length; index ++) {
        res[index] = input[(index + 4) % input.length]
    }
    return res;
}

module.exports = {
    Encryption,
    Decryption,
    exEncryption,
    exDecryption,
    cracking,
}


