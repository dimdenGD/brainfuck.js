class Brainfuck {
  constructor(program, input = "", size = 30000) {
    this.program = program;
    this.input = input;
    this.size = size;
    this.array = new Array(size).fill(0);
    this.waiting = false;
    this.p = 0;
    this.debug = false;
    this.loops = {};
    this.done = false;
    this.depth = 0;
    this.stop = false;
    this.events = {};
    this.char = 0;
    this.i = 0;
    this.tick = () => {};
    this.mod = (a, b) => {
      b += 1;
      return ((a % b) + b) % b;
    }

    if(!program) throw new Error("No program to interpret.")
  };
  on(name, fn) {
    this.events[name] = fn;
  }
  emit(name, ...args) {
    for(let i in this.events) this.events[i](...args);
  }
  destroy() {
    this.stop = true;
  };
  init() {
    let program = this.program;
    this.on("done", () => this.done === true); 
    let fn = () => {
      for(let i = 0; i < 1000; i++) this.step();
      if(!this.done) requestAnimationFrame(fn);
    };
    if(!this.debug) fn();
  }
  step() {
    let program = this.program;
    let invalid = false;
    if(program[this.i] === undefined) return this.emit("done");
    if(this.stop) return this.emit("done");
    if(this.waiting) return;
    switch(program[this.i]) { 
      case ">": this.p++; this.p = this.mod(this.p, this.size); break;
      case "<": this.p--; this.p = this.mod(this.p, this.size); break;
      case "+": this.array[this.p] = (this.array[this.p]+1) & 255; break;
      case "-": this.array[this.p] = (this.array[this.p]-1) & 255; break;
      case ".": this.emit("out", String.fromCharCode(this.array[this.p])); break;
      case ",":
        if(this.input[this.char] === undefined) {
          this.array[this.p] = 0;
          this.char++;
          break;
        }
        this.array[this.p] = this.input[this.char++].charCodeAt(0);
        this.emit("in");
        break;
      case "[":
          let temp_i = this.i;
          let addr = this.i;
          let ignore = 0;

          while(1) {
            temp_i++;
            if(!program[temp_i]) throw new Error("Out of bounds.");
            if(program[temp_i] === "[") ignore++;
            if(this.program[temp_i] === "]") {
              if(ignore === 0) {
                  if(this.array[this.p] === 0) this.i = temp_i;
                  else {
                    this.loops[temp_i] = addr;
                    this.depth++;
                  };
                  break;
              } else ignore--;
            }
          }
        break;
      case "]":
        if(this.array[this.p] !== 0) this.i = this.loops[this.i];
        else {
            delete this.loops[this.i];
            this.depth--; // Loop finished
        }; 
      break;
      default: invalid = true;
    }
    if(!invalid) this.tick();
    this.i++;
  }
}
