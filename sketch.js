let boid = [];
let nb_boid = 150;
let lifeSpan = 300;

let matting_pool = [];

let frame;

let spawn, target;
let c;

let convergence, conv, fmax;
let mutation_gain = 0.2;
let selection_thr = 0.9;

let trails;

function setup() {
  createCanvas(800, 600);
  trails = createGraphics(800, 600);

  spawn = createVector(50, 50);
  target = createVector(width - 50, height - 50);

  for (let i = 0; i < nb_boid; i++) {
    boid[i] = new spaceship(spawn.x, spawn.y, lifeSpan);
    boid[i].vel = p5.Vector.random2D();
  }
  c = color(0, 127, 255, 50);
  frame = 0;

  convergence = new plot('convergence (%)', width - 100, 100, 0, 100, 0, 100, true);
  Pmean_conv = 0;
}

function draw() {
  background(220);
  image(trails, 0, 0);
  trails.stroke(255);

  if (frame > lifeSpan - 1) {
    for (let i = 0; i < nb_boid; i++) {
      if (boid[i].finished == false) {
        boid[i].finish(frame);
      }
    }

    trails.background(220, 127);
    trails.filter(BLUR, 2);

    conv = mean_conv();
    fmax = max_fitness();
    convergence.update(conv * 100, fmax * 100); // plot

    generate_matting_pool();
    big_sex_moment();
    mutation(mutation_gain * (fmax - conv) + mutation_gain * conv / 10);

    frame = 0;

  } else {
    frame++;
  }

  //boids
  for (let i = 0; i < nb_boid; i++) {
    if (boid[i].finished == false) {
      boid[i].show(frame);
      trails.point(boid[i].pos.x, boid[i].pos.y);
      boid[i].simulate(frame);
    } else {
      boid[i].show(frame);
      trails.point(boid[i].pos.x, boid[i].pos.y);
    }
  }

  noStroke();
  fill(0, 0, 25, 75);
  rect(width - 200, 0, 200, 200, 10);

  convergence.draw();

  noStroke();
  fill(c);
  circle(spawn.x, spawn.y, 50);
  circle(target.x, target.y, 50);

  fill(255);
  push()
  textAlign(RIGHT);
  text(frame, width - 5, 20);
  pop();
}

