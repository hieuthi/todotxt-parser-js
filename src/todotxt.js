/**
 * class TodoTxt
 * 
 * The main class of the library. It parse a text content
 * into Todo.txt format:
 * 
 * - It store line index and empty line so text can be recreated
 * exactly as it should be
 * 
 * You need to use this class to manipulate (insert, removw) the 
 * todo list itself.
 **/
'use strict';

var Todo = require('./todo');
var TodoView = require('./todoview');

function TodoTxt(content) {
  this.raw_ = content;
  this.list_ = [];

  const lines = content.split('\n');
  for (let i=0; i < lines.length; i++){
    const line = lines[i];
    const todo = line.trim().length > 0 ? new Todo(line) : null;

    this.list_.push({'lineIdx': i, 'raw': line, 'todo': todo});
  }
}

TodoTxt.parse = function (content) {
  return new TodoTxt(content);
}
TodoTxt.parseLine = function (line) {
  return line.trim().length > 0 ? new Todo(line) : null;
}
TodoTxt.isIsoDate = function(datestring) {
  return Todo.isIsoDate(datestring);
}

TodoTxt.prototype.toString = function () {
  return this.list_.map(e => e.todo ? e.todo.toString() : e.raw).join('\n');
}

TodoTxt.prototype.getList = function () {
  return this.list_;
}

TodoTxt.prototype.getTodos = function () {
  return this.list_.filter(e => e.todo).map(e => e.todo);
}

TodoTxt.prototype.getTodoView = function () {
  return new TodoView(this.list_.filter(e => e.todo), this);
}

module.exports = TodoTxt;
