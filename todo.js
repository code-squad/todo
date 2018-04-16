// Todo App
// 나의 할 일을 관리하는 어플리케이션
//
// # 사용방법
// command(인자1$인자2)의 형식으로 입력한다 (update는 command(인자1$인자2$인자3)이다)
// 인자1에는 명령을 입력한다, add, show, update가 있다 
// 
// # 명령별 동작
// 1. add : 인자2에 할 일을 입력하면 todo상태에 등록된다
// 예를 들어 command(add$자바스크립트 공부)를 입력하면 id값이 할당되고 todo에 추가된다
// 2. show : 인자2에 내가 보고 싶은 상태를 입력하면 입력된 상태에 있는 목록이 출력된다
// 예를 들어 command(show$doing)을 입력하면 doing상태의 목록이 [1] 자바공부 [2] 산책하기 와 같이 출력된다
// 3. update : 내가 추가한 할 일의 상태를 변경시킨다
// 예를 들어 command(update$2$done)을 입력하면 id값이 2인 할 일을 done상태로 만들어준다
const errorMsg = {
  notCommand: cmd => `${cmd}는 입력 커맨드가 아닙니다.`,
  doNotFindId: id => `${id}은 존재하지 않는 id입니다.`,
  emptyStatus: status => `${status}는 비어있습니다.`,
  alreadyHaveItem: (status) => `해당 Id는 이미 ${status}상태입니다.`
};
class Todo {
  constructor(errorMsg) {
    this.errorMsg = errorMsg;
    this.id = 1;
    this.todoList = {
      todo: [],
      doing: [],
      done: []
    };
  }

  getId() {
    return this.id++;
  }

  command(input) {
    const cmd = {
      add: this.addTodo,
      show: this.getSelectedStatus,
      update: this.updateTodo
    }
    const [type, ...item] = input.split(/\$/);
    const lastId = cmd[type].call(this, ...item);
    this.printMessage(type, item, lastId);
  }

  printMessage(type, item, lastId) {
    if (type === 'add') {
      console.log(this.getAddedTodo(lastId, item));
      console.log(this.getCurrentStatus());
    }
    if (type === 'update') console.log(this.getCurrentStatus());
    if (type === 'show') console.log(lastId);
  }

  addTodo(todoName) {
    const lastId = this.getId();
    const addedTime = new Date();
    this.todoList.todo.push({
      id: lastId,
      name: todoName,
      addedTime: addedTime.getHours()
    });
    return lastId;
  };

  getAddedTodo(id, todoName) {
    return `id : ${id} '${todoName}' 과목이 새로 추가됐습니다.`;
  };

  getCurrentStatus() {
    const status = Object.keys(this.todoList).map(v => `${v} : ${Object.keys(this.todoList[v]).length}개`);
    return `현재상태 : ${status.join(', ')}`;
  };

  getSelectedStatus(status) {
    const list = this.todoList[status].reduce((ac, cv) => {
      if (status === 'done') return ac.concat(this.measureTime(cv));
      else return ac.concat(`[${cv.id}] ${cv.name}`);
    }, [])
    return list.length !== 0 ? list.join(', ') : this.errorMsg.emptyStatus(status);
  };

  measureTime(item) {
    return `[${item.id}] ${item.name}, ${item.theTime}시간`
  };

  updateTodo(id, status) {
    let found = this.findItemById(id, this.todoList);
    if (!found.item) return;
    let item = found.item;
    if (status === 'done') {
      this.addTheTime(item);
    }
    this.moveItem(found, id, status)
    return id;
  };

  addTheTime(item) {
    const updatedTime = new Date();
    item.theTime = (updatedTime.getHours() + this.doing(item.name)) - item.addedTime;
  };

  moveItem(item, id, status) {
    let spliced = this.todoList[item.status].splice(item.index, 1);
    this.todoList[status].push(spliced[0]);
  };

  doing(todo) {
    if (todo.match(/공부/)) return 3;
    return Math.floor(Math.random() * 2 + 1);
  };

  findItemById(id, list) {
    const statusKey = {
      0: 'todo',
      1: 'doing',
      2: 'done',
    }
    const found = Object.values(list).reduce((ac, cv, ci) => {
      const target = {};
      cv.forEach((v, i) => {
        if (v.id == id) {
          target.index = i;
          target.item = v;
          target.status = statusKey[ci]
          ac = target
        }
      });
      return ac;
    }, {})
    if (found) return found;
    console.log(this.errorMsg.doNotFindId(id));
    return undefined;
  }

}
const todo = new Todo(errorMsg);

todo.command('add$자바스크립크 공부하기');
todo.command('add$산책하기');
todo.command('show$todo');
todo.command('update$2$doing');
todo.command('update$2$done');
todo.command('add$코딩하기');
todo.command('update$7$doing');
todo.command('show$todo');
todo.command('show$doing');
todo.command('show$done');