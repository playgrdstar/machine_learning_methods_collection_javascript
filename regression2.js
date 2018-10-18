// fetchData().then(dataArray=>console.log(dataArray));

 // Setting up the variables for machine learning
const learning_rate = 0.05;
const batch_size = 25;

const A = tf.variable(tf.randomNormal(shape=[1,1]));
const b = tf.variable(tf.randomNormal(shape=[1,1]));

// Alternative way of initialising the two variables
// const A = tf.variable(tf.scalar(0.1));
// const b = tf.variable(tf.scalar(0.1));

const optimizer = tf.train.adam(learning_rate);

let lossArray = [];

function predict(xs){
    return tf.tidy(()=>{
        const ys = xs.mul(A).add(b);
        return ys;
        // return tf.add(tf.matMul(x,A),b);
    });
}

function loss(predict, actual){
    return tf.tidy(()=>{
        return predict.sub(tf.cast(actual, 'float32')).square().mean();
    });
}

async function train(numIterations, done){
    
    const d = await fetchData();

    for (let i=0; i<numIterations; i++){
        let cost;
        const [xs,ys] = await batchData(d.x,d.y,50);
        cost = tf.tidy(()=>{
            cost = optimizer.minimize(()=>{
                const pred = predict(xs);
                const predLoss = loss(pred, ys);

                return predLoss;
                
            }, true);
            return cost;
        })

        cost.data().then((data)=>lossArray.push({i:i, error:data[0]}));
        
        if (i%100==0){
            // await cost.data().then((data)=>console.log('Iteration:${i} Loss:${data}'));
            ploterrors(lossArray.slice(i-100,i));
            await cost.data().then((data)=>console.log(i,data));
        }

        await tf.nextFrame();
    }
    done();
    // If we want to check the values of A and b
    // await A.data().then((data)=>console.log(data[0]));
    // await b.data().then((data)=>console.log(data[0]));
}

// Values and variables for plotting

const width = 500, height = 500, margin = 50;

let svg, svg2;
let scaleX, scaleY, scaleX2, scaleY2;
let xAxis, yAxis, xAxis2, yAxis2;

let xAxisGroup, yAxisGroup, xAxisGroup2, yAxisGroup2;

// Setup the chart for plotting errors

function setup_ploterrors(){
    svg2 = d3.select('#d3canvas2')
                .append('svg')
                .attr('width',width)
                .attr('height',height);

    // let scaleX2 = d3.scaleLinear().range([2*margin,width-2*margin]).domain(d3.extent(errors,(d,i)=>i));
    // let scaleY2 = d3.scaleLinear().range([height-2*margin,2*margin]).domain(d3.extent(errors,(d,i)=>+d));

    scaleX2 = d3.scaleLinear().range([2*margin,width-2*margin]).domain([0,1000]);
    scaleY2 = d3.scaleLinear().range([height-2*margin,2*margin]).domain([0,3.0]);

    xAxis2 = d3.axisBottom();
    yAxis2 = d3.axisLeft();

    xAxis2.scale(scaleX2).ticks(10);
    yAxis2.scale(scaleY2).ticks(20);

    xAxisGroup2 = svg2.append('g')
                          .attr('class', 'x axis')
                          .attr('transform', 'translate(0' + ',' + (height-2*margin) + ')');

    yAxisGroup2 = svg2.append('g')
                          .attr('class', 'y axis')
                          .attr('transform', 'translate('+ 2*margin + ',0)');

    xAxisGroup2.call(xAxis2);
    yAxisGroup2.call(yAxis2); 

    // Plot title
    svg2.append('text')
        .attr('x', width/2)
        .attr('y', 40)
        .style('text-anchor', 'middle')
        .style('fill', '#FFFFFF')
        .style('font-size', '10px')
        .text('Training Progress');
    
    // X and Y axis labels
    svg2.append('text')
        .attr('x', width/2)
        .attr('y', height-65)
        .style('text-anchor', 'middle')
        .style('fill', '#FFFFFF')
        .style('font-size', '10px')
        .text('Epochs');

    svg2.append('text')
        .attr('x', 45)
        .attr('y', height/2)
        .style('text-anchor', 'middle')
        .style('fill', '#FFFFFF')
        .style('font-size', '10px')
        .text('Loss');      
}

// Function to plot errors 

function ploterrors(errors){

    let errordots = svg2.selectAll('errordots')
                    .data(errors);

        errordots
                    .enter()
                    .append('circle')
                    .style('fill', 'none')
                    .attr('cx',0)
                    .attr('cy',height/2)
                    .merge(errordots)                
                    .transition()
                    .duration(200)
                    .attr('class', 'circle')
                    .attr('cx',d=>scaleX2(d.i))
                    .attr('cy',d=>scaleY2(d.error))
                    .attr('r', 1)
                    .style('fill', '#F92A82')
                    .style('fill-opacity', 0.5);
                    

        errordots.exit().remove();
}


// Setup the chart for plotting the data
// Async is used here as we need to await the data to load from the fetchData function

async function setup_mainplot() {
    const data = await fetchData();

    // I inserted a separate set of data as json to facilitate plotting in D3
    // data.x and data.y used for training above
    // data.data here is a separate json used just for plotting the dots
    const plotdata = data.data;
    svg = d3.select('#d3canvas1')
                    .append('svg')
                    .attr('width',width)
                    .attr('height',height);

    scaleX = d3.scaleLinear().range([2*margin,width-2*margin]).domain(d3.extent(plotdata,d=>+d.sepal_length));
    scaleY = d3.scaleLinear().range([height-2*margin,2*margin]).domain(d3.extent(plotdata,d=>+d.speciesNum));

    xAxis = d3.axisBottom();
    yAxis = d3.axisLeft();

    xAxis.scale(scaleX).ticks(5);
    yAxis.scale(scaleY).ticks(5);

    xAxisGroup = svg.append('g')
                              .attr('class', 'x axis')
                              .attr('transform', 'translate(0' + ',' + (height-2*margin) + ')');

    yAxisGroup = svg.append('g')
                              .attr('class', 'y axis')
                              .attr('transform', 'translate('+ 2*margin + ',0)');

    let dots = svg.selectAll('dots')
                    .data(plotdata);

        dots.enter()
                    .append('circle')
                    .style('fill', 'none')
                    .attr('cx',width/2)
                    .attr('cy',height/2)                
                    .merge(dots)
                    .transition()
                    .duration(500)
                    .attr('class', 'circle')
                    .attr('cx',d=>scaleX(+d.sepal_length))
                    .attr('cy',d=>scaleY(+d.speciesNum))
                    .attr('r', 5)
                    .style('fill', '#F92A82')
                    .style('fill-opacity', 0.4);

        dots.exit().remove();


    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // Scatter plot title
    svg.append('text')
        .attr('x', width/2)
        .attr('y', 40)
        .style('text-anchor', 'middle')
        .style('fill', '#FFFFFF')
        .style('font-size', '10px')
        .text('Scatter plot of data-points');
    
    // X and Y axis labels
    svg.append('text')
        .attr('x', width/2)
        .attr('y', height-65)
        .style('text-anchor', 'middle')
        .style('fill', '#FFFFFF')
        .style('font-size', '10px')
        .text('X');

    svg.append('text')
        .attr('x', 45)
        .attr('y', height/2)
        .style('text-anchor', 'middle')
        .style('fill', '#FFFFFF')
        .style('font-size', '10px')
        .text('Y');

}

// Plotting the regression line
// Note that you need to call either data() or dataSync() to resolve the data stored in the tensors

async function plot_line(){
    const data = await fetchData();
    const plotdata = data.data;

    const A_=A.dataSync()[0], b_=b.dataSync()[0];

    console.log('A:',A_, 'b:', b_);

    plotdata.forEach(d=>{
        let x = +d.sepal_length;
        let predY = A_*x+b_;
        d.predY = predY;
    })

    let line = d3.line()
                    .x(d=>scaleX(+d.sepal_length))
                    .y(d=>scaleY(d.predY));

    svg.append('path')
        .data([plotdata])
        .attr('class', 'rline')
        .attr('d',line)
        .style('fill', 'none')
        .style('stroke', '#F92A82')
        .style('stroke-width', '1px')
        .style('stroke-dasharray', '1,3');

    // console.log(plotdata);
    // console.log(lossArray);
}


setup_mainplot();
setup_ploterrors();

// The main training loop
train(1001, ()=>{
    plot_line();
    console.log('Training Completed')
})

