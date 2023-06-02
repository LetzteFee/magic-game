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