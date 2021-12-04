# todotxt-parser-js

Another [Todo.txt](http://todotxt.org/) parser written in JavaScript. It currently offers:
- Parsing
- Export back to string
- Sorting and Filtering
- Simple update methods

Comparing with existing library, this package was written with a specific condition in mind that is "preserving original text as much as possible" which is translated into server features:
- Text (projects, contexts, ...) order is preserved
- Leading and trailing white space is preserved
- Empty lines are not parsed but still preserved for serialization

## Examples

The package includes three classes: `TodoTxt`, `Todo`, `TodoView` with `TodoTxt` is the main entry point.

```javascript
const content = 'Call Mom @Phone +Family\n'
                + '(C) Schedule annual checkup +Health\n'
                + 'x (A) Outline chapter 5 +Novel @Computer'
                + '(B) Add cover sheets @Office +TPSReports';

const todoTxt  = TodoTxt.parse(content);    // Return a TodoTxt object
const todoView = todoTxt.getTodoView();     // Using TodoView for sort and filter

const todoViewSort   = todoView.sort([['default']]);    // Sort with default Todo.txt logics
console.log(todoViewSort.toString());

const todoViewFilter = todoView.filter([["priority",["A","B","C"]]]);    // Only show A, B, and C
console.log(todoViewFilter.toString());

// Sort and Filter methods return a new TodoView so you can chain your queries
const todoViewSortFilter = todoView.filter([["priority",["A","B","C"]]]).sort([['default']]);
console.log(todoViewSortFilter.toString());

const todos = todoViewSortFilter.getTodos();    // Return an array of Todo objects
console.log(todos[0].getPriority());
todos[0].setPriority('E');
console.log(todos[0].getPriority());

```

## License

[MIT](https://raw.githubusercontent.com/hieuthi/todotxt-parser-js/main/LICENSE)
