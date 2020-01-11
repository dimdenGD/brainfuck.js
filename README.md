# brainfuck.js
Another Brainfuck interpreter in JS

*Constructor: new Brainfuck(program, input, size)*.

## Example

```js
const program = "--[>--->->->++>-<<<<<-------]>--.>---------.>--..+++.>----.>+++++++++.<<.+++.------.<-.>>+.";
const bf = new Brainfuck(program);

bf.on("out", o => console.log(o));
bf.init();
```
