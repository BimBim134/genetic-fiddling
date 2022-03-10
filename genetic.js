function generate_matting_pool() {
    matting_pool = [];

    // get min and max of matting pool
    let fmin = 1;
    let fmax = 0;
    for (let i = 0; i < nb_boid; i++) {
        if (boid[i].fitness < fmin) {
            fmin = boid[i].fitness;
        }
        if (boid[i].fitness > fmax) {
            fmax = boid[i].fitness;
        }
    }

    let selection_thr = map(fmax,0,1,selection_thr_min,1);

    let pmean = lerp(fmin, fmax, selection_thr);

    // save only the ones above average
    for (let i = 0; i < nb_boid; i++) {
        if (boid[i].fitness > pmean) {
            append(matting_pool, boid[i]);
        }
    }



    let l = matting_pool.length;
    // avantage to the best
    let bias;
    for (let i = 0; i < l; i++) {
        bias = pow(boid[i].fitness, 2);
        for (let f = 0; f < bias * 10; f++) {
            append(matting_pool, matting_pool[f]);
        }
    }
}

function choose_btw(a, b) {
    let choice = random();
    if (choice < 0.5) {
        return a;
    } else {
        return b;
    }
}

function mix(pa, pb) {
    let child = new spaceship(spawn.x, spawn.y, lifeSpan);
    for (let i = 0; i < lifeSpan; i++) {
        child.command[i] = choose_btw(pa.command[i], pb.command[i]);
    }
    return child;
}

function choose_one(population) {
    let choice = floor(random() * population.length);
    return (population[choice]);
}

function big_sex_moment() {
    for (let i = 0; i < nb_boid; i++) {
        let parent_a = choose_one(matting_pool);
        let parent_b = choose_one(matting_pool);
        boid[i] = mix(parent_a, parent_b);
    }
}

function mean_conv() {
    let mean = 0;
    for (let i = 0; i < nb_boid; i++) {
        mean += boid[i].fitness;
    }
    return mean / nb_boid;
}

function mutation(gain) {
    for (let i = 0; i < nb_boid; i++) {
        for (let c = 0; c < lifeSpan; c++) {
            boid[i].command[c] = p5.Vector.lerp(boid[i].command[c], p5.Vector.random2D(), gain);
        }
    }
}

function max_fitness() {
    pfmax = fmax;
    for (let i = 0; i < nb_boid; i++) {
        if (boid[i].fitness > fmax) {
            fmax = boid[i].fitness;
        }
    }
}

function hero() {
    for (let i = 0; i < nb_boid; i++) {
        if (boid[i].fitness > fmax) {
            arrayCopy(boid[i].command, best_command);
        }
    }
}

function checkConvergence(){
    if(mutation_gain < 0.001 && fmax - conv < 0.05) {
        converged = true;
    }
}