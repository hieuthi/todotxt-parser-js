/**
 * class Todo
 * 
 * A single todo item extracted from a line, Only knows 
 * its own content:
 * 
 * - Line is parsed into a sequences of tokens
 * - Token of optional parameters will always available whether
 * or not they exist in the text to create a uniform front
 * - Leading and Trailing Spaces are stored so the text can 
 * be recreated exactly as it should be
 * 
 * You will need to use this class to manipulate (update) the
 * content of a single todo task.
 **/
'use strict';


function isSpace(code) {
  switch (code) {
    case 0x09:
    case 0x20:
      return true;
  }
  return false;
}

function isDate(datestring) {
  if (datestring.length != 10 ) { return false; }
  if (isNaN(Date.parse(datestring))) { return false; }

  return true;
}

function Todo(line) {
  this.tokens_  = [];

  var start = 0, 
      end = line.length -1;
  for (; start < line.length; start++){ if (!isSpace(line.charCodeAt(start))){break;} }
  for (; end >= 0; end--){ if (!isSpace(line.charCodeAt(end))){ break; } }
  const core  = line.substr(start, end - start + 1);

  this.tokens_.push({type: "leadingSpace", content: line.substr(0, start)});

  const items = core.split(' ');

  // Status
  if ( items.length > 0 && items[0] == 'x' ) {
    this.tokens_.push({type: "status", content: items.shift()});
  } else {
    this.tokens_.push({type: "status", content: null});
  }

  // Priority
  if ( items.length > 0 && items[0].length == 3 && 
        items[0].charCodeAt(0) == 0x28 /* ( */ && items[0].charCodeAt(2) == 0x29 /* ) */ &&
        items[0].charCodeAt(1) >= 0x41 /* A */ && items[0].charCodeAt(1) <= 0x5A /* Z */ ) {
    this.tokens_.push({type: "priority", content: items.shift()});
  } else {
    this.tokens_.push({type: "priority", content: null});
  }

  // Start Date and End Date
  if ( items.length > 0 && isDate(items[0]) ){
    if ( items.length > 1 && isDate(items[1]) ){
      this.tokens_.push({type: "completionDate", content: items.shift()});
    } else {
      this.tokens_.push({type: "completionDate", content: null});
    }
    this.tokens_.push({type: "creationDate", content: items.shift()});
  } else {
    this.tokens_.push({type: "completionDate", content: null});
    this.tokens_.push({type: "creationDate", content: null});
  }

  for (let i=0; i<items.length; i++) {
    const item = items[i];
    // Project
    if (item.length > 1 && 
        item.charCodeAt(0) == 0x2B /* + */ && item.charCodeAt(1) != 0x2B) {
      this.tokens_.push({type: "project", content: item});
      continue;
    }

    // Context
    if (item.length > 1 && 
        item.charCodeAt(0) == 0x40 /* @ */ && item.charCodeAt(1) != 0x40) {
      this.tokens_.push({type: "context", content: item});
      continue;
    }

    // Metadata
    if (item.length > 2 && 
        item.charCodeAt(0) >= 0x41 /* A */ && item.charCodeAt(0) <= 0x7A /* z */ &&
        item.indexOf(':') >= 0 && item.indexOf(':') == item.lastIndexOf(':')) {
      this.tokens_.push({type: "meta", content: item});
      continue;
    }

    this.tokens_.push({type: "text", content: item})
  }
  this.tokens_.push({type: "trailingSpace", content: line.substr(end+1, line.length)});

}

Todo.prototype.toString = function () {
  return this.tokens_[0]["content"] + 
            this.tokens_.slice(1,-1).filter(e => e.content).map(e => e.content).join(' ') + 
            this.tokens_[this.tokens_.length-1]["content"] ;
}

Todo.prototype.isCompleted = function () {
  return this.tokens_[1]["content"] ? true : false;
}

Todo.prototype.getPriority = function (nullValue=null) { /* nullValue = '~' */
  return this.tokens_[2]["content"] ? this.tokens_[2]["content"].charAt(1) : nullValue;
}

Todo.prototype.getCompletionDate = function (nullValue=null) {
  return this.tokens_[3]["content"] ? Date.parse(this.tokens_[3]["content"]) : nullValue;
}

Todo.prototype.getCreationDate = function (nullValue=null) {
  return this.tokens_[4]["content"] ? Date.parse(this.tokens_[4]["content"]) : nullValue;
}

Todo.prototype.getProjects = function () {
  const projects = [ ];
  for (let i=5; i<this.tokens_.length-1;i++){
    const token = this.tokens_[i];
    if ( token["type"] == "project" ) { projects.push(token["content"]); }
  }
  return projects;
}

Todo.prototype.getContexts = function () {
  const contexts = [ ];
  for (let i=5; i<this.tokens_.length-1;i++){
    const token = this.tokens_[i];
    if ( token["type"] == "context" ) { contexts.push(token["content"]); }
  }
  return contexts;
}

Todo.prototype.getMetadata = function () {
  var data = { };
  for (let i=5; i<this.tokens_.length-1;i++){
    const token = this.tokens_[i];
    if ( token["type"] == "meta" ) { 
      const args = token["content"].split(':');
      if ( args[0] in data ) {
        data[args[0]].push(args[1]);
      } else {
        data[args[0]] = [ args[1] ];
      }
    }
  }
  return data;
}

Todo.prototype.getTokens = function () {
  return this.tokens_;
}

Todo.prototype.getHeadTokens = function () {
  return this.tokens_.slice(1,5);
}

Todo.prototype.getBodyTokens = function () {
  return this.tokens_.slice(5, this.tokens_.length-1);
}


module.exports = Todo;

