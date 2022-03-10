let boid = [];
let best_command = [];
let nb_boid = 250;
let lifeSpan, best_time;
let original_lifespan = 500;

let matting_pool = [];

let frame;

let spawn, target;
let c;

let convergence, conv, fmax, pfmax;
let mutation_gain = 1;
let selection_thr_min = 0.2;

let trails;

let boulder;

let converged = false;

function setup() {
  createCanvas(800, 800);
  trails = createGraphics(800, 800);

  spawn = createVector(50, 50);
  target = createVector(width - 50, height - 50);

  for (let i = 0; i < nb_boid; i++) {
    boid[i] = new spaceship(spawn.x, spawn.y, original_lifespan);
  }

  c = color(0, 127, 255, 50);
  frame = 0;

  convergence = new plot('convergence (%)', width - 100, 100, 0, 100, 0, 100, true);
  Pmean_conv = 0;

  boulder = new obstacle(25, 200);
  fmax = 0;

  lifeSpan = original_lifespan;
  best_time = original_lifespan;
}

function draw() {
  background(220);

  image(trails, 0, 0);
  trails.stroke(255);

  boulder.show();

  lifeSpan = best_time;

  if (converged == false){
    if (frame > lifeSpan - 1) {
      for (let i = 0; i < nb_boid; i++) {
        if (boid[i].finished == false) {
          boid[i].finish(frame);
        }
      }
  
      trails.background(220, 50);
  
      hero();
      conv = mean_conv();
      max_fitness();
      convergence.update(conv * 100, fmax * 100); // plot
  
      generate_matting_pool();
      big_sex_moment();
  
      if (fmax - pfmax == 0) {
        mutation_gain *= 0.9;
      }
      mutation(mutation_gain * (fmax - conv) + mutation_gain * conv / 10);
  
      boid[0].command = best_command;
      boid[0].paint = color(255, 64, 16);
  
      frame = 0;
    } else {
      frame++;
    }
  } else {
    if (frame > lifeSpan - 1) {
      trails.background(220, 50);
      frame = 0;
      boid[0].reset();
    } else {
      frame++;
    }
  }


  //boids
  if (converged == false) {
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
  } else {
    boid[0].show(frame);
    trails.point(boid[0].pos.x, boid[0].pos.y);
    boid[0].simulate(frame);
  }

  checkConvergence();

  if (converged == false){
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
    text(frame + ' / ' + lifeSpan, width - 5, 20);
    text('mutation gain : ' + floor(mutation_gain * 10000) / 10000, width - 5, 180);
    pop();
  }
}