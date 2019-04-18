const data = require('./data');
const Todo = require('./todo');
const readline = require('readline');

const todo = new Todo(data);

const inputPrompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
inputPrompt.setPrompt('명령하세요 : ');
inputPrompt.prompt();

inputPrompt.on('line', message => {
  if (message === '0') {
    inputPrompt.close();
  }
  const arr = message.split('$');
  todo[arr[0]](arr[1], arr[2], inputPrompt);
});

inputPrompt.on('close', () => {
  process.exit();
});

// todo.show('status', 'all');
// todo.show('status', 'todo');
// todo.show('status', 'doing');
// todo.show('status', 'done');
// todo.show('tag', 'favorite');
// todo.show('tag', 'food');
// todo.show('tag', 'javascript');
