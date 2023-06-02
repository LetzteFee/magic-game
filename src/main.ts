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

let magic_system: MagicSystem;
let monster_system: MonsterSystem;
let player: Player;

function setup(): void {
  createCanvas(800, 600);

  magic_system = new MagicSystem();
  monster_system = new MonsterSystem();
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
