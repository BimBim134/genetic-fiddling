class plot {
    constructor(name_, x_, y_, vmin_, vmax_, tvmin_, tvmax_, plot_target_) {
        this.data = [];
        this.target = [];
        this.name = name_;
        this.x = x_; // position of the plot on the screen
        this.y = y_;
        this.vmin = vmin_; // range
        this.vmax = vmax_;
        this.tvmin = tvmin_; // range
        this.tvmax = tvmax_;

        this.plt_target = plot_target_;

        this.clipping = false; // is the data to plot is beyond range

        for (let i = 0; i < 100; i++) { // initialize both plot at 0
            this.data[i] = 0;
            this.target[i] = 0;
        }

        this.crop = function (n_) {
            return floor(n_ * 100) / 100;
        }

        this.update = function (d_, t_) {
            let d = d_;
            let t = t_;

            for (let i = 99; i > 0; i--) {
                this.data[i] = this.data[i - 1];
                this.target[i] = this.target[i - 1];
            }

            if (d_ < this.vmin | d_ > this.vmax) { // is the data to plot off range ?
                this.clipping = true;
                d = constrain(d_, this.vmin, this.vmax); // clipping the data
            } else if (t_ < this.tvmin | t_ > this.tvmax) {
                this.clipping = true;
                t = constrain(t_, this.tvmin, this.tvmax); // clipping the data
            } else {
                this.clipping = false;
            }

            this.data[0] = d;
            this.target[0] = t;
        }

        this.draw = function () {


            push();
            if (this.clipping == true) { // make the plot vibrate if clipping occur
                translate(this.x + random(- 1, 1), this.y + random(- 1, 1));
                textAlign(LEFT, BOTTOM);
                fill(255, 128, 128);
                text("clipping!", -50, -40);
            } else {
                translate(this.x, this.y);
            }

            strokeWeight(1);

            if (this.plt_target == true) {
                // target plot
                stroke(200,220,255);
                for (let i = 0; i < 99; i++) {
                    line(100 - i - 50, map(this.target[i], this.tvmin, this.tvmax, 50, -50), 100 - i - 51, map(this.target[i + 1], this.tvmin, this.tvmax, 50, -50));
                }
                fill(200,220,255);
                noStroke();
                textAlign(LEFT, CENTER);
                text(this.crop(this.target[0]), 55, map(this.target[0], this.tvmin, this.tvmax, 50, -50));
            }
            
            // data plot
            stroke(255);
            for (let i = 0; i < 99; i++) {
                line(100 - i - 50, map(this.data[i], this.vmin, this.vmax, 50, -50), 100 - i - 51, map(this.data[i + 1], this.vmin, this.vmax, 50, -50));
            }
            fill(255);
            textAlign(RIGHT, CENTER);
            noStroke();
            text(this.crop(this.data[0]), -55, map(this.data[0], this.vmin, this.vmax, 50, -50));

            noFill();
            stroke(255);
            rect(- 51, -51, 102, 102);

            fill(255);
            noStroke();
            textAlign(LEFT, BOTTOM);
            text(this.name, -50, -55);

            pop();
        }
    }
}
