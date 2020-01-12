# brainfuck.js
Another Brainfuck interpreter in JS

*Constructor: new Brainfuck(program, input, size)*.

## Example

```js
const program = "--[>--->->->++>-<<<<<-------]>--.>---------.>--..+++.>----.>+++++++++.<<.+++.------.<-.>>+.";
const bf = new Brainfuck(program);
let out = "";

bf.on("out", o => out += o);
bf.on("done", () => console.log(out));
bf.init();
```
