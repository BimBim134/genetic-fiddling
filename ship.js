class spaceship {
    constructor(x_, y_, lifeSpan_, command_ = []) {
        //position
        this.pos = createVector(x_, y_);
        this.heading = createVector(1,0).angleBetween(target);

        //speeds
        this.vel = createVector();
        this.roll = 0;

        //acceleration
        this.acc = createVector();
        this.roll_rate = 0;
        this.power = 0.75;
        this.Rpower = 0.35;

        // color
        let blue = random(100, 255);
        this.paint = color(blue / 4, blue / 2, blue);

        // fitness
        this.fitness = 0;
        this.finished = false;

        // command
        this.command = command_;

        for (let i = 0; i < lifeSpan_; i++) {
            this.command[i] = p5.Vector.random2D();
        }

        this.simulate = function (t) {
            if (t < this.command.length) {
                this.acc.set(
                    this.power * cos(this.heading) * (0.8 * this.command[t].x + 0.2),
                    this.power * sin(this.heading) * (0.8 * this.command[t].x + 0.2));
                this.roll_rate = this.Rpower * radians(this.command[t].y);
            }

            this.vel.add(this.acc);
            this.roll += this.roll_rate;

            this.pos.add(this.vel);
            this.heading += this.roll;

            //check for bouncing
            if (this.pos.x < 0) {
                this.pos.x *= -1;
                this.vel.x *= -1;
            }
            else if (this.pos.x > width) {
                this.pos.x = width - (this.pos.x - width);
                this.vel.x *= -1;
            }
            if (this.pos.y < 0) {
                this.pos.y *= -1;
                this.vel.y *= -1;
            }
            else if (this.pos.y > height) {
                this.pos.y = height - (this.pos.y - height);
                this.vel.y *= -1;
            }

            //check for obstacle
            for (let i = 0; i < boulder.nb; i++) {
                if (this.pos.dist(boulder.obstacles[i]) < boulder.sizes[i]/2) {
                    let normal = createVector(boulder.obstacles[i].x - this.pos.x, boulder.obstacles[i].y - this.pos.y);
                    this.vel.reflect(normal);
                    this.pos.sub(normal-boulder.sizes[i]/2 + 5);
                }
            }

            // friction
            this.vel.mult(0.95);
            this.roll *= 0.9;

            // reinitialization acceleration
            this.acc.set(0, 0);
            this.roll_rate = 0;

            // fitness update
            if (this.finished == false) {
                this.fitness = constrain(map(this.pos.dist(target), 0, spawn.dist(target), 1, 0), 0, 1);
            }

            if (this.pos.dist(target) < 25) {
                this.finish(t);
            }
        }

        this.finish = function (frame) {
            this.fitness *= map(frame / lifeSpan, 0, 1, 1, 0.35);
            this.finished = true;
        }

        this.show = function (t) {
            push();
            translate(this.pos.x, this.pos.y);
            rotate(this.heading);

            // hull
            fill(this.paint);
            stroke(lerpColor(this.paint, color(0), 0.35));
            triangle(-10, -10, -10, 10, 10, 0);


            // engine section
            fill(100);
            stroke(75);
            beginShape();
            vertex(-10, -7);
            vertex(-15, -5);
            vertex(-15, 5);
            vertex(-10, 7);
            endShape();

            // cockpit
            fill(50);
            stroke(0);
            ellipseMode(CENTER);
            ellipse(-5, 0, 8, 4);

            //info
            /*
            fill(this.paint);
            noStroke();
            text(floor(this.fitness),0,-3);
            */
            pop();
        }
    }
}