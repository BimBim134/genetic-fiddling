class obstacle {
    constructor(nb_, size_) {

        this.nb = nb_;
        this.obstacles = [];
        this.sizes = [];
        for (let i = 0; i < nb_; i++) {
            this.obstacles[i] = createVector(random(0, width), random(0, height));
            while (this.obstacles[i].dist(spawn) < 200 | this.obstacles[i].dist(target) < 200) {
                this.obstacles[i] = createVector(random(0, width), random(0, height));
            }
            this.sizes[i] = random(0.3*size_, size_);
        }

        this.show = function () {
            push();
            noStroke();
            fill(180);
            for (let i = 0; i < this.nb; i++) {
                circle(this.obstacles[i].x, this.obstacles[i].y, this.sizes[i]);
            }
            pop();
        }
    }
}