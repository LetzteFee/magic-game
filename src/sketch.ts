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
class MagicSystem {
  objects: MagicObject[];
  constructor() {
    this.objects = [];
  }
  run() {
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].run();
      if (this.objects[i].shouldDelete) {
        this.objects.splice(i, 1);
        i--;
      }
    }
  }
  add(m: MagicObject) {
    this.objects.push(m);
  }
}

// MagicObject muss die run() Methode und das shouldDelete Attribut besitzen
type MagicObject = BloodMagic | BlitzMagic;

class BloodMagic {
  public shouldDelete: boolean;

  private current_x: number;
  private current_y: number;

  private v: Vektor;
  private timer: number;
  private readonly radius: number;

  constructor(cx: number, cy: number, tx: number, ty: number, v: number) {
    this.current_x = cx;
    this.current_y = cy;

    this.v = new Vektor(tx - cx, ty - cy);
    this.v.normieren();
    this.v.mult(v);

    this.radius = 10;
    this.shouldDelete = false;
    this.timer = 200;
  }
  public run(): void {
    this.move();
    this.render();
    this.checkCollision();

    this.timer--;
    if (this.timer < 0) this.shouldDelete = true;
  }
  private render(): void {
    noStroke();
    fill("red");
    ellipse(this.current_x, this.current_y, this.radius * 2);
  }
  private move(): void {
    this.current_x += this.v.x;
    this.current_y += this.v.y;
  }
  checkCollision(): void {
    let v: Vektor = new Vektor(player.x - this.current_x, player.y - this.current_y);
    let b: number = v.betrag();
    if (b < this.radius + player.getRadius()) {
      player.damage(20);
      this.shouldDelete = true;
    }
  }
}
class BlitzMagic {
  private static readonly chaos: number = 10;

  public shouldDelete: boolean;
  private timer: number;

  private vertices: Vertex[];

  constructor(cx: number, cy: number, tx: number, ty: number) {
    let v = new Vektor(tx - cx, ty - cy);
    v.normieren();
    v.mult(15);

    this.vertices = [new Vertex(cx, cy)];
    for (let i: number = 1; i < 25; i++) {
      this.vertices.push(new Vertex(
        this.vertices[i - 1].x + v.x,
        this.vertices[i - 1].y + v.y
      ));
    }
    for (let i: number = 0; i < this.vertices.length; i++) {
      this.vertices[i].x += random(-BlitzMagic.chaos, BlitzMagic.chaos);
      this.vertices[i].y += random(-BlitzMagic.chaos, BlitzMagic.chaos);
    }

    this.timer = 20;
    this.shouldDelete = false;

    this.checkCollision();
  }
  public run(): void {
    this.render();
    this.timer--;
    if (this.timer < 0) {
      this.shouldDelete = true;
    }
  }
  private render(): void {
    strokeWeight(2);
    stroke("LightSkyBlue");
    for (let i: number = 0; i < this.vertices.length - 1; i++) {
      line(this.vertices[i].x, this.vertices[i].y, this.vertices[i + 1].x, this.vertices[i + 1].y)
    }
  }
  private checkCollision() {
    for (let i: number = 0; i < this.vertices.length; i++) {
      monster_system.checkCollision(this.vertices[i].x, this.vertices[i].y)
    }
  }
}
class Player {
  private ticks: number;
  private health: Value;
  private mana: Value;
  private score: number;

  public x: number;
  public y: number;

  private readonly radius: number;
  constructor(x: number, y: number) {
    this.ticks = 0;
    this.health = new Value(100, 100);
    this.mana = new Value(100, 100);
    this.score = 0;

    this.x = x;
    this.y = y;

    this.radius = 5;
  }
  public run() {
    this.move();
    if (this.ticks % 10 == 0) {
      this.mana.increase();
      this.health.increase();
    }

    this.render();
    this.gui();

    this.ticks++;
  }
  private render() {
    noStroke();
    fill("white");
    ellipse(this.x, this.y, this.radius * 2);
  }
  private gui() {
    noStroke();
    fill("red");
    text(`Health: ${this.health.getValue()}`, 10, 10);
    fill("blue");
    text(`Mana: ${this.mana.getValue()}`, 10, 20);
    fill("black");
    text(`Score: ${this.score}`, 10, 30);
  }
  private move() {
    const speed = 5;
    if (keyIsDown(87) || keyIsDown(38)) {
      // w und ArrowUp
      this.y -= speed;
    }
    if (keyIsDown(65) || keyIsDown(37)) {
      // a und ArrowLeft
      this.x -= speed;
    }
    if (keyIsDown(83) || keyIsDown(40)) {
      // s und ArrowDown
      this.y += speed;
    }
    if (keyIsDown(68) || keyIsDown(39)) {
      // d und ArrowRight
      this.x += speed;
    }

    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y > height) {
      this.y = height;
    }
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x > width) {
      this.x = width;
    }
  }
  public action() {
    if (mouseButton === LEFT) {
      if (this.mana.getValue() - 20 >= 0) {
        magic_system.add(new BlitzMagic(this.x, this.y, mouseX, mouseY));
        this.mana.decrease(20);
      }
    }
  }
  public damage(dam: number) {
    this.health.decrease(dam);
  }
  public increaseScore(increment: number = 1): void {
    this.score += increment;
  }
  public getRadius(): number {
    return this.radius;
  }
}
class MonsterSystem {
  private readonly max_total: number;
  private ticks: number;
  private monsters: Monster[];
  constructor(max_total = 10) {
    this.max_total = max_total;
    this.ticks = 0;
    this.monsters = [];
  }
  public run() {
    for (let i = 0; i < this.monsters.length; i++) {
      if (this.monsters[i].isRequestingDeletion()) {
        this.monsters.splice(i, 1);
        player.increaseScore();
        i--;
      } else {
        this.monsters[i].run();
      }
    }

    if (this.ticks % 30 == 0 && this.monsters.length < this.max_total) {
      this.spawn();
    }

    this.ticks++;
  }
  private spawn() {
    this.monsters.push(new Monster(random(width), random(height)));
  }
  public checkCollision(x: number, y: number): void {
    for (let i: number = 0; i < this.monsters.length; i++) {
      this.monsters[i].checkCollision(x, y);
    }
  }
}
class Monster {
  private requestDeletion: boolean;
  private ticks: number;
  private x: number;
  private y: number;
  private readonly radius: number;
  constructor(x: number, y: number) {
    this.requestDeletion = false;
    this.ticks = 0;
    this.x = x;
    this.y = y;
    this.radius = 10;
  }
  public run() {
    this.render();

    if (this.ticks % 40 == 0) {
      this.attack();
    }

    this.ticks++;
  }
  private render(): void {
    noStroke();
    fill('green');
    ellipse(this.x, this.y, this.radius * 2);
  }
  private attack(): void {
    magic_system.add(new BloodMagic(this.x, this.y, player.x, player.y, 1));
  }
  public checkCollision(x: number, y: number) {
    let delta_x = this.x - x;
    let delta_y = this.y - y;
    let delta = Math.sqrt((delta_x ** 2) + (delta_y ** 2));
    if (delta < this.radius) {
      this.requestDeletion = true;
    }
  }
  public isRequestingDeletion(): boolean {
    return this.requestDeletion;
  }
}
let magic_system = new MagicSystem();
let monster_system = new MonsterSystem();
let player: Player;
function setup(): void {
  createCanvas(800, 600);
  player = new Player(width / 2, height / 2);
}

function draw(): void {
  background(220);
  player.run();
  magic_system.run();
  monster_system.run();
}

function mousePressed(): void {
  player.action();
}

