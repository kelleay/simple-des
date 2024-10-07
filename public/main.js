
// 功能 1 区域
    const inputBlock = document.querySelector("#inputBlock")
    const key1 = document.querySelector("#Key1")
    const floatingTextarea1 = document.querySelector("#floatingTextarea1")

    // 判断是否为二进制数据
    function isBinaryString(str){
        for(let char of str){
            if(char !== "0" && char !== "1") return false
        }
        return true
    }

    // 点击加密
    function handleClickEncryptInputBlock(){
        const data = {
            plainBlock: inputBlock.value.toString(),
            key: key1.value.toString()
        }
        // 判断格式
        if(data.plainBlock.length !== 8 || !isBinaryString(data.plainBlock)) {
            alert("输入的明文格式错误")
            inputBlock.value = ""
            return;
        }
        if(data.key.length !== 10 || !isBinaryString(data.key)) {
            alert("输入的密钥格式错误")
            key1.value = ""
            return;
        }
        encrypt(data);
    }

    // 点击解密
    function handleClickDecryptInputBlock(){
        const data = {
            cipherBlock: inputBlock.value.toString(),
            key: key1.value.toString()
        }
        // 判断格式
        if(data.cipherBlock.length !== 8 || !isBinaryString(data.cipherBlock)) {
            alert("输入的明文格式错误")
            inputBlock.value = ""
            return;
        }
        if(data.key.length !== 10 || !isBinaryString(data.key)) {
            alert("输入的密钥格式错误")
            key1.value = ""
            return;
        }
        decrypt(data);
    }


    function encrypt(data) {
        $.ajax({
            url: 'http://127.0.0.1:8080/api/encrypt',
            type: 'POST',
            data: data,
            ontentType: 'application/json', // 设置内容类型为 JSON
            success: function(response) {
                floatingTextarea1.innerHTML = "加密结果: " +  response.data        
            },
            error: function(xhr, status, error) {
                alert("加密失败")
            }
        });
    }

    function decrypt(data) {
        $.ajax({
            url: 'http://127.0.0.1:8080/api/decrypt',
            type: 'POST',
            data: data,
            ontentType: 'application/json', // 设置内容类型为 JSON
            success: function(response) {
                floatingTextarea1.innerHTML = "解密结果: " +  response.data
            },
            error: function(xhr, status, error) {
                alert("解密失败")
            }
        });
    }
// 功能 2 区域
    const inputString = document.querySelector("#inputString")
    const Key2 = document.querySelector("#Key2")
    const floatingTextarea2 = document.querySelector("#floatingTextarea2")

    // 点击扩展加密
    function handleClickEncryptInputString(){
        // 获取输入
        const data = {
            plainText: inputString.value.toString(),
            key: Key2.value.toString()   
        }
        // 判断密钥格式
        if(data.key.length !== 10 || !isBinaryString(data.key)) {
            alert("输入的密钥格式错误")
            Key2.value = ""
            return;
        }
        exEncrypt(data)
    } 
    // 点击扩展解密
    function handleClickDecryptInputString(){
        // 获取输入
        const data = {
            cipherText: inputString.value.toString(),
            key: Key2.value.toString()   
        }
        // 判断密钥格式
        if(data.key.length !== 10 || !isBinaryString(data.key)) {
            alert("输入的密钥格式错误")
            Key2.value = ""
            return;
        }
        exDecrypt(data)
    }

    // 扩展加密
    function exEncrypt(data) {
            $.ajax({
                    url: 'http://127.0.0.1:8080/api/exencrypt',
                    type: 'POST',
                    data: data,
                    ontentType: 'application/json', // 设置内容类型为 JSON
                    success: function(response) {
                        floatingTextarea2.innerHTML = "加密结果: " + response.data 
                    },
                    error: function(xhr, status, error) {
                        alert("加密失败")
                    }
                });
    }
    // 扩展解密
    function exDecrypt(data){
        $.ajax({
            url: 'http://127.0.0.1:8080/api/exdecrypt',
            type: 'POST',
            data: data,
            ontentType: 'application/json', // 设置内容类型为 JSON
            success: function(response) {
                floatingTextarea2.innerHTML = "解密结果: " + response.data 
            },
            error: function(xhr, status, error) {
                alert("解密失败")
            }
        });
    }
// 功能 3 区域
    const pairsContainer = document.querySelector("#pairsContainer")
    const floatingTextarea3 = document.querySelector("#floatingTextarea3")
    // 添加
    function handleClickAddPair(){
        const pairDiv = document.createElement('div');
        pairDiv.classList.add('pair'); // 添加样式class pair

        pairDiv.innerHTML = `
            <div class="form-floating mb-3" style="display: inline-block; width: 300px; margin-right: 80px;">
                <input class="form-control plainText" id="input111" placeholder="明文">
                <label for="input111">明文</label>
            </div>
            <div class="form-floating mb-3" style="display: inline-block; width: 300px;">
                <input class="form-control cipherText" id="input222" placeholder="密文">
                <label for="input222">密文</label>
            </div>
        `
        pairsContainer.appendChild(pairDiv);
    }

    // 暴力破解
    function handleClickCracking(){
        const plains = document.querySelectorAll(".plainText")
        const ciphers = document.querySelectorAll(".cipherText")
        let PlainAndCipherPair = []
        let len = 0
        for(let index = 0; index < plains.length; index ++){
            if(plains[index].value !== "" && ciphers[index].value !== ""){
                PlainAndCipherPair[len] = {
                    plain: plains[index].value.toString(),
                    cipher: ciphers[index].value.toString()
                }
                len ++
            }
            else if(plains[index].value.length !== ciphers[index].value.length){
                alert("明文密文长度不一致")
                return
            }
            else {
                alert("格式错误")
                return;
            }
        }
        $.ajax({
            url: 'http://127.0.0.1:8080/api/cracking',
            type: 'POST',
            data: {
                PlainAndCipherPair: PlainAndCipherPair
            },
            ontentType: 'application/json', // 设置内容类型为 JSON
            success: function(response) {
                if(response.res === false) {
                    floatingTextarea3.innerHTML = `未破解到密钥
耗费时间: ${response.time} ms`
                }
                else {
                    let keys = ""
                    for(let str of response.res){
                        keys += str.toString().replace(/,/g, '')
                        keys += '    '
                    }
                    floatingTextarea3.innerHTML = `密钥: ${keys}
破解时间: ${response.time} ms
                    `
                }
            },
            error: function(xhr, status, error) {
                alert("破解失败")
            }
        });
    }

