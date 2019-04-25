function Validation(){}

Validation.prototype.isContained = function(string, key) {
    return string.includes(key)
}

Validation.prototype.isExisted = function(arr, id) {
    if (!Number.isFinite(id)) return false;
    return arr.findIndex((el) => el.id === id)
}

Validation.prototype.isSameStatus = function(obj, status) {
    console.log(arguments)
    return obj["status"] === status
}

Validation.prototype.isCorrectStatus = function(status) {
    const reg = /^done$|^doing$|^todo$/
    return reg.test(status)
}

Validation.prototype.isCorrectCommand = function(inst) {
    const reg = /^add$|^delete$|^show$|^update$/
    return reg.test(inst)
}

// 인자의 수가 부족 

// 명령어가 잘못된 경우

// 태그 ["ㅇㄴㅇ", "ㄴㅇㄴㅇㄴ"]

module.exports = Validation

