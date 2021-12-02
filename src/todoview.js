/**
 * class TodoView
 * 
 * This class provide different way to view a TodoTxt object
 * through the filter and sort functions.
 * 
 * - You usually get the first TodoView object using todoTxt.getTodoView() 
 * - You can use filter and sort function to get todos of concern
 * - The sort and filter functions return a new TodoView object so you can
 * chain your queries
 * 
 * By seperating sort and filter functions from TodoTxt we can query the
 * original without changing it.
 * 
 **/
'use strict';

var sortOptions_ = { /* [defaultDirection, defaultNullValue] */
  'default': {},
  'status'        : {'nullValue': 'o', 'order': 'asc'},
  'priority'      : {'nullValue': '~', 'order': 'desc'},
  'creationDate'  : {'nullValue': '1970-01-01', 'order': 'desc'},
  'completionDate': {'nullValue': '1970-01-01', 'order': 'desc'},
}

var filterOptions_ = {
  'status'  : {'nullValue': 'o'},
  'priority': {'nullValue': '~'},
  'project' : {'nullValue': '+null'},
  'context' : {'nullValue': '@null'},
}

function compareFactory(option){
  const field = option[0];
  const order = option[1] == 'asc' ? 1 : -1;
  const nullValue = option[2];
  switch (field){
    case 'status':
        return function(a, b) {return order*(a.todo.getStatus(nullValue).charCodeAt(0)-b.todo.getStatus(nullValue).charCodeAt(0))}
    case 'priority':
        return function(a, b) {return order*(b.todo.getPriority(nullValue).charCodeAt(0)-a.todo.getPriority(nullValue).charCodeAt(0))}
    case 'creationDate':
        return function(a, b) {return order*(Date.parse(a.todo.getCreationDate(nullValue))-Date.parse(b.todo.getCreationDate(nullValue)))}
    case 'completionDate':
        return function(a, b) {return order*(Date.parse(a.todo.getCompletionDate(nullValue))-Date.parse(b.todo.getCompletionDate(nullValue)))}
  }
}

function filterFactory(option, caseInsensitive){
  const field     = option[0];
  var keywords    = option[1];
  const nullValue = option[2];
  switch (field){
    case 'status':
        return function(a) {
          return keywords.includes(a.todo.getStatus(nullValue));
        }
    case 'priority':
        return function(a) {
          return keywords.includes(a.todo.getPriority(nullValue));
        }
    case 'project':
        return function(a) {
          const projects = a.todo.getProjects();
          if ( projects.length < 1 ) { projects.push(nullValue); } 
          if ( caseInsensitive ) {
            keywords = keywords.map(e => e.toLowerCase())
            return projects.map(e => e.toLowerCase()).some(e => keywords.includes(e));
          } else {
            return projects.some(e => keywords.includes(e));
          }
        }
    case 'context':
        return function(a) {
          const contexts = a.todo.getContexts();
          if ( contexts.length < 1 ) { contexts.push(nullValue); }
          if ( caseInsensitive ){
            keywords = keywords.map(e => e.toLowerCase())
            return contexts.map(e => e.toLowerCase()).some(e => keywords.includes(e));
          } else {
            return contexts.some(e => keywords.includes(e));
          }
        }
   }
}

function TodoView(list, todoTxt) {
    this.list_ = list;
    this.todoTxt_ = todoTxt;
}

TodoView.prototype.toString = function () {
  return this.list_.map(e => e.todo ? e.lineIdx + ': ' + e.todo.toString() : e.lineIdx + ': ' + e.raw).join('\n');
}
TodoView.prototype.getList = function () {
  return this.list_;
}

TodoView.prototype.sort = function (queries) {
  var options = [ ];

  for (var i=0; i<queries.length; i++){
    const query = queries[i];

    if (query.length<1 || query[0] in sortOptions_ === false) {continue;}
    const field = query.shift();

    if (field=='default'){
      options = options.filter(e => e[0] !== 'priority' && e[0] !== 'status');
      options.push(['priority', sortOptions_['priority']['order'], sortOptions_['priority']['nullValue']]);
      options.push(['status', sortOptions_['status']['order'], sortOptions_['status']['nullValue']]);
      continue;
    }

    var order = sortOptions_[field]["order"];
    var nullValue = sortOptions_[field]["nullValue"];

    if (query.length>0 && ['desc','asc'].includes(query[0])) { order = query.shift(); }
    if (query.length>0) { nullValue = query.shift(); }

    options = options.filter(e => e[0] !== field);
    options.push([field,order,nullValue]);
  }

  var list = this.list_;
  for (var i=0; i<options.length; i++){
    list = list.sort(compareFactory(options[i]));
  }

  return new TodoView(list, this.todoTxt_);
}

TodoView.prototype.filter = function (queries, caseInsensitive=false) {
  var options = [ ];

  for (var i=0; i<queries.length; i++){
    const query = queries[i];
    if ( query.length < 2 ) { continue; }
    if ( query[0] in filterOptions_ === false ) { continue; }
    if ( query[1].length < 1 ) { continue; }

    const nullValue = query.length > 2 ? query[2] : filterOptions_[query[0]]['nullValue'];
    options.push([query[0],query[1],nullValue]);
  }

  var list = this.list_;
  for (var i=0; i<options.length; i++){
    list = list.filter(filterFactory(options[i], caseInsensitive));
  }

  return new TodoView(list, this.todoTxt_);
}


module.exports = TodoView;