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

    let pmean = lerp(fmin, fmax, selection_thr);

    // save only the ones above average
    for (let i = 0; i < nb_boid; i++) {
        if (boid[i].fitness > pmean) {
            append(matting_pool, boid[i]);
        }
    }



    let l = matting_pool.length;
    // avantage to the best
    for (let i = 0; i < l; i++) {
        for (let f = 0; f < pow(map(matting_pool[i].fitness, fmin, fmax, 0, 10), 3); f++) {
            append(matting_pool, matting_pool[f]);
        }
    }

    //console.log(matting_pool.length);
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
    let fmax = 0;
    for (let i = 0; i < nb_boid; i++) {
        if (boid[i].fitness > fmax) {
            fmax = boid[i].fitness;
        }
    }
    return fmax;
}