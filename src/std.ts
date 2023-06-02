class Geometry2DClass {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  }
  class Vektor extends Geometry2DClass {
    public betrag() {
      return Math.sqrt((this.x ** 2) + (this.y ** 2));
    }
    public normieren() {
      this.div(this.betrag())
    }
    public div(d: number) {
      this.x /= d;
      this.y /= d;
    }
    public mult(m: number) {
      this.x *= m;
      this.y *= m;
    }
  }
  class Vertex extends Geometry2DClass {
  }
  class Value {
    private current_value: number;
    private max_value: number;
    constructor(start: number, max_value: number) {
      this.current_value = start;
      this.max_value = max_value;
    }
    public increase(s = 1): void {
      this.current_value += s;
      if (this.current_value > this.max_value) {
        this.current_value = this.max_value;
      }
    }
    public decrease(d = 1): void {
      this.current_value -= d;
      if (this.current_value < 0) {
        throw "Fatal Error: Illegal Value Drain";
      }
    }
    public getValue(): number {
      return this.current_value;
    }
    public setValue(v: number): void {
      this.current_value = v;
    }
    public getMax(): number {
      return this.max_value;
    }
    public setMax(m: number): void {
      this.max_value = m;
    }
  }