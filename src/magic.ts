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