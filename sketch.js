class Vektor {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  betrag() {
    return Math.sqrt((this.x ** 2) + (this.y ** 2));
  }
  normieren() {
    this.div(this.betrag())
  }
  div(d) {
    this.x /= d;
    this.y /= d;
  }
  mult(m) {
    this.x *= m;
    this.y *= m;
  }
}
class Value {
  constructor(start, max_value) {
    this.current_value = start;
    this.max_value = max_value;
  }
  increase(s = 1) {
    this.current_value += s;
    if (this.current_value > this.max_value) {
      this.current_value = this.max_value;
    }
  }
}
class MagicSystem {
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
  add(m) {
    this.objects.push(m);
  }
}
class MagicObject {
  constructor(cx, cy, tx, ty) {
    this.current_x = cx;
    this.current_y = cy;
    this.target_x = tx;
    this.target_y = ty;

    this.shouldDelete = false;
  }
  run() {}
}
class BloodMagic extends MagicObject {
  constructor(cx, cy, tx, ty, v) {
    super(cx, cy, tx, ty);
    
    this.v = new Vektor(tx - cx, ty - cy);
    this.v.normieren();
    this.v.mult(v);
    
    this.timer = 200;
  }
  run() {
    this.move();
    this.render();
    this.checkCollision();
    
    this.timer--;
    if(this.timer < 0) this.shouldDelete = true;
  }
  render() {
    noStroke();
    fill("red");
    ellipse(this.current_x, this.current_y, 20);
  }
  move() {
    this.current_x += this.v.x;
    this.current_y += this.v.y;
  }
  checkCollision() {
    
  }
}
class BlitzMagic extends MagicObject {
  constructor(cx, cy, tx, ty) {
    super(cx, cy, tx, ty);
    this.timer = 20;
  }
  run() {
    this.render();
    this.timer--;
    if (this.timer < 0) {
      this.shouldDelete = true;
    }
  }
  render() {
    strokeWeight(5);
    stroke("blue");
    line(this.current_x, this.current_y, this.target_x, this.target_y);
  }
}
class Player {
  constructor(x, y) {
    this.ticks = 0;
    this.health = new Value(100, 100);
    this.mana = new Value(100, 100);
    this.x = x;
    this.y = y;
  }
  run() {
    this.move();
    this.health.increase();
    if (this.ticks % 10 == 0) this.mana.increase();

    this.render();
    this.gui();

    this.ticks++;
  }
  render() {
    noStroke();
    fill("white");
    ellipse(this.x, this.y, 10);
  }
  gui() {
    noStroke();
    fill("red");
    text(`Health: ${this.health.current_value}`, 10, 10);
    fill("blue");
    text(`Mana: ${this.mana.current_value}`, 10, 20);
  }
  move() {
    const speed = 5;
    if (keyIsDown(87)) {
      // w
      this.y -= speed;
    }
    if (keyIsDown(65)) {
      // a
      this.x -= speed;
    }
    if (keyIsDown(83)) {
      // s
      this.y += speed;
    }
    if (keyIsDown(68)) {
      // d
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
  action() {
    if (mouseButton === LEFT) {
      if (this.mana.current_value - 20 >= 0) {
        magic_system.add(new BlitzMagic(this.x, this.y, mouseX, mouseY));
        this.mana.current_value -= 20;
      }
    }
  }
}
class MonsterSystem {
  constructor() {
    this.ticks = 0;
    this.monsters = [];
  }
  run() {
    for(let i = 0; i < this.monsters.length;i++) {
      this.monsters[i].run();
    }
    
    if(this.ticks % 30 == 0) {
      this.spawn();
    }
    
    this.ticks++;
  }
  spawn() {
    this.monsters.push(new Monster(random(width), random(height)));
  }
}
class Monster {
  constructor(x, y) {
    this.ticks = 0;
    this.x = x;
    this.y = y;
  }
  run() {
    this.render();
    
    if(this.ticks % 40 == 0) {
      this.attack();
    }
    
    this.ticks++;
  }
  render() {
    noStroke();
    fill('green');
    ellipse(this.x, this.y, 10);
  }
  attack() {
    magic_system.add(new BloodMagic(this.x, this.y, player.x, player.y, 1));
  }
}
let magic_system = new MagicSystem();
let monster_system = new MonsterSystem();
let player;
function setup() {
  createCanvas(800, 600);
  player = new Player(width / 2, height / 2);
}

function draw() {
  background(220);
  player.run();
  magic_system.run();
  monster_system.run();
}
function mousePressed() {
  player.action();
}
