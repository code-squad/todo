const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const Model = function () {
    this.todoList = []
}
Model.prototype = {
    getId(key, value) {
        const targetData = this.todoList.filter(todoData => todoData[key] === value).shift();
        return targetData.id;
    },
    addData(name, tags) {
        tags = tags.replace(/\[|\]|\"|\'/g, '').split(',')
        const id = this.makeId()
        const todoData = {
            name,
            tags,
            status: 'todo',
            id
        }
        this.todoList.push(todoData)
    },
    deleteData(id) {
        const targetIndex = this.getIndex(id)
        this.todoList.splice(targetIndex, 1)
    },
    updateData(id, status) {
        const targetIndex = this.getIndex(id);
        let targetData = this.todoList[targetIndex];
        if (targetData.status === status) throw Error(id)
        targetData.status = status
    },
    makeId() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)
    },
    countData(status) {
        return this.getMatchedData(status).length
    },
    getMatchedData(status) {
        return this.todoList.filter(todoData => todoData.status === status)
    },
    getIndex(id) {
        const idx = this.todoList.findIndex(el => el.id === id)
        if (idx === -1) throw Error('MatchedDataError')
        return idx
    }
}

const View = function () { }
View.prototype = {
    showAll(countResult) {
        console.log('현재상태 : ' + Object.entries(countResult).map(([key, value]) => `${key}: ${value}개`).join(', '))
    },
    showEachData(status, countNumber, targetData) {
        const str = targetData.map(el => `'${el.name}, ${el.id}번'`).join(', ')
        console.log(`${status}리스트 : 총 ${countNumber}건 : ${str}`)
    },
    showAddResult(name, id) {
        console.log(`${name} 1개가 추가되었습니다. (id : ${id})`)
    },
    showDeleteResult(name, status) {
        console.log(`${name} ${status}가 목록에서 삭제되었습니다.`)
    },
    showUpdateResult(name, status) {
        console.log(`${name}이(가) ${status}으로 상태가 변경되었습니다.`)
    },
}

const Controller = function () {
    this.model = model
    this.view = view
}
Controller.prototype = {
    showAll() {
        const countResult = {
            todo: this.model.countData('todo'),
            doing: this.model.countData('doing'),
            done: this.model.countData('done')
        }
        this.view.showAll(countResult)
        rl.prompt()
    },
    showEachData(status) {
        const countNumber = this.model.countData(status)
        const targetData = this.model.getMatchedData(status)
        this.view.showEachData(status, countNumber, targetData)
        rl.prompt()
    },
    showData(type) {
        if (type === 'all') {
            this.showAll()
            return
        }
        this.showEachData(type)
    },
    addData(name, tags) {
        this.model.addData(name, tags);
        const id = this.model.getId('name', name)
        this.view.showAddResult(name, id);
        this.showFinalResult()
    },
    deleteData(id) {
        const idx = this.model.getIndex(id);
        const {
            name,
            status
        } = this.model.todoList[idx]
        this.model.deleteData(id)
        this.view.showDeleteResult(name, status)
        this.showFinalResult()
    },
    updateData(id, status) {
        this.model.updateData(id, status);
        const idx = this.model.getIndex(id)
        const name = this.model.todoList[idx].name
        setTimeout(() => {
            this.view.showUpdateResult(name, status)
            this.showFinalResult()
        }, 3000);
    },
    showFinalResult() {
        setTimeout(() => { this.showAll() }, 1000);
    }
}

const Util = function () { }
Util.prototype = {
    parseCommand(command) {
        if (!/\$/.test(command)) throw Error('DollarCharError')
        return command.split('$');
    },
    getKeyCommand(command) {
        const KeyMap = {
            'show': 'showData',
            'add': 'addData',
            'delete': 'deleteData',
            'update': 'updateData'
        }
        const keyCommand = command.shift();
        return KeyMap[keyCommand]
    },
}

const ErrorHandler = function () {
    this.controller = controller;
}
ErrorHandler.prototype = {
    getErrorType(errorMsg) {
        if (errorMsg.length === 4) errorMsg = 'SameStatusError'

        const ErrorType = {
            DollarCharError: 'printDollarCharError',
            MatchedDataError: 'printMatchedDataError',
            SameStatusError: 'printSameStatusError'
        }
        return ErrorType[errorMsg]
    },

    printDollarCharError() {
        console.log('올바른 명령기호($)를 사용해 주세요.')
    },
    printMatchedDataError() {
        console.log('일치하는 id가 없습니다.')
    },
    printSameStatusError(id) {
        const idx = this.controller.model.getIndex(id);
        const {
            name,
            status
        } = this.controller.model.todoList[idx];
        console.log(`${name}의 status는 이미 ${status}입니다.`)
    },
    printOtherErrors() {
        console.log('올바른 명령어를 사용해주세요.')
    }
}

const util = new Util();
const model = new Model();
const view = new View();
const controller = new Controller();
const errorHandler = new ErrorHandler();

const app = {
    util: util,
    controller: controller,
    errorHandler: errorHandler,
    start() {
        rl.setPrompt('명령하세요(종료하려면 "q"를 입력하세요) : ')
        rl.prompt()
        rl.on('line', (command) => {
            if (command === 'q') rl.close()
            try {
                command = this.util.parseCommand(command)
                const keyCommand = this.util.getKeyCommand(command);
                const restCommand = command;
                this.controller[keyCommand](...restCommand)
            }
            catch (e) {
                console.log(e, e.message)
                const errorType = this.errorHandler.getErrorType(e.message)
                if (errorType) {
                    this.errorHandler[errorType](e.message)
                    rl.prompt()

                } else {
                    this.errorHandler.printOtherErrors();
                    rl.prompt()
                }
            }
        })
        rl.on('close', () => {
            process.exit()
        })
    }
}

app.start()