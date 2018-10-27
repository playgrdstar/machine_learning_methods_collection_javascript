var P5 = new p5();

function generateCategoricalData(total,boundary,upper,lower) {

    let data = [];

    for (let i=0; i<total; i++){
        let X1, X2, Y;

        const cutoff = P5.random()*(upper-lower)+lower;

        if (i<=boundary){
            X1 = P5.random(lower,cutoff*0.9);
            X2 = P5.random(lower,cutoff*0.9);
            Y = 0;
        } else if (i>boundary){
            X1 = P5.random(cutoff*1.1,upper);
            X2 = P5.random(cutoff*1.1,upper);
            Y = 1;
        }

        data.push({x1:X1, x2:X2, y:Y});

    }

    return data;
}

function generateCategoricalData2(total,boundary,upper,lower) {

    let data = [];

    for (let i=0; i<total; i++){
        let X1, X2, Y;

        const cutoff = P5.random()*(upper-lower)+lower;

        if (i<=boundary){
            X1 = P5.random(lower,cutoff*0.9);
            X2 = P5.random(lower,cutoff*0.9);
            Y = -1;
        } else if (i>boundary){
            X1 = P5.random(cutoff*1.1,upper);
            X2 = P5.random(cutoff*1.1,upper);
            Y = 1;
        }

        data.push({x1:X1, x2:X2, y:Y});

    }

    return data;
}

// let categoryData = generateCategoricalData(10,5,5,10);

// console.log(categoryData);


function generateContinuousData(total,upper,lower, A, B) {

    let data = [];

    let step = (upper-lower)/total;

    for (let i=lower; i<upper; i+=step){
        let X, Y;
        X = P5.random();
        Y = A*X + B + P5.random(2);

        data.push({x:X, y:Y});

    }

    return data;
}

// let continuousData = generateContinuousData(10,3,1,3,2);

// console.log(continuousData);