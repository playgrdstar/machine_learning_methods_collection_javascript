// This script is used to fetch and process iris data direct from a gist

const datasource = 'https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/d546eaee765268bf2f487608c537c05e22e4b221/iris.csv'


let x = []
let y =[];

async function fetchData(){
    let response = await fetch(datasource);
    let text = await response.text();

    // Parse the text data into json with d3's function
    let data = await d3.csvParse(text);

    // let dataArray =[];

    let categoricalTargets = ['setosa', 'versicolor', 'virginica'];

    // console.log(data);

    await data.forEach(d=>{

        // Either we convert the labelling one by one
        // if (d.species=='setosa'){
        //     d.speciesNum = 0;
        // } else if (d.species=='versicolor'){
        //     d.speciesNum = 1;
        // } else if (d.species=='virginica'){
        //     d.speciesNum = 2;
        // };

        // Or do it with a separate categoricalTargets lookup
        categoricalTargets.forEach((c,i)=>{
            if (d.species==c){d.speciesNum=i};
        })

        // dataArray.push([+d.sepal_length, d.species, d.speciesNum]); 
        // x.push([+d.sepal_length, +d.sepal_width, +d.petal_length, +d.petal_width]);
        x.push([+d.sepal_length]);
        y.push(+d.speciesNum/1.0);

    });

    // return dataArray;
    // console.log(x,y);

    return {data:data, x:x, y:y};
}

// Adapted from https://github.com/tensorflow/tfjs-examples/blob/master/iris/data.js
// If we want to separate into a train and test set
function convertData(data, targets, split, num_classes){

    const numSamples = data.length;
    
    const indices = [];
    for (let i=0; i<numSamples; i++){
        indices.push(i);
    }

    tf.util.shuffle(indices);

    const shuffledData = [];
    const shuffledTargets = [];

    for (let i=0; i<data.length; i++){
        shuffledData.push(data[indices[i]]);
        shuffledTargets.push(targets[indices[i]]);
    }

    const testNum = Math.round(data.length*split);
    const trainNum = data.length - testNum;

    // Number of features
    const xDims = shuffledData[0].length;

    const xs = tf.tensor2d(shuffledData, [data.length, xDims]);

    const ys = tf.oneHot(tf.tensor1d(shuffledTargets).toInt(), num_classes);

    const xTrain = xs.slice([0,0],[trainNum,xDims]);
    const xTest = xs.slice([trainNum,0],[testNum,xDims]);

    const yTrain = ys.slice([0,0],[trainNum,num_classes]);
    const yTest = ys.slice([trainNum,0],[testNum,num_classes]);   

    return [xTrain, yTrain, xTest, yTest];

    // return {xTrain:xTrain, yTrain:yTrain, xTest:xTest, yTest:yTest};

}

// Get data in the batch size indicated for batch gradient descent

function batchData(data, targets, batch_size){

    const numSamples = data.length;
    
    const indices = [];
    for (let i=0; i<numSamples; i++){
        indices.push(i);
    }

    // Shuffle the indices
    tf.util.shuffle(indices);

    const batchData = [];
    const batchTargets = [];

    for (let i=0; i<batch_size; i++){
        batchData.push(data[indices[i]]);
        batchTargets.push(targets[indices[i]]);
    }

    // Number of features
    const xDims = batchData[0].length;

    const xs = tf.tensor2d(batchData, [batch_size, xDims]);

    const ys = tf.tensor2d(batchTargets, [batch_size, 1]);

    return [xs, ys];

    // Use this if more than one feature/independent variable used
    // return {xTrain:xTrain, yTrain:yTrain, xTest:xTest, yTest:yTest};

}

