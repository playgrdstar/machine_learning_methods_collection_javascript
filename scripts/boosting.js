
function boosting() {
let data = generateCategoricalData(20,10,1,5);

console.log(data);

const width = 500, height = 500, margin = 50;

const svg = d3.select('#boosting')
                .append('svg')
                .attr('width',width)
                .attr('height',height);

let scaleX = d3.scaleLinear().range([2*margin,width-2*margin]).domain(d3.extent(data,d=>d.x1));
let scaleY = d3.scaleLinear().range([height-2*margin,2*margin]).domain(d3.extent(data,d=>d.x2));

let xAxis = d3.axisBottom();
let yAxis = d3.axisLeft();

xAxis.scale(scaleX).ticks(5);
yAxis.scale(scaleY).ticks(5);

var xAxisGroup = svg.append('g')
                          .attr('class', 'x1 axis')
                          .attr('transform', 'translate(0' + ',' + (height-2*margin) + ')');

var yAxisGroup = svg.append('g')
                          .attr('class', 'x2 axis')
                          .attr('transform', 'translate('+ 2*margin + ',0)');

let title = svg.append('text')
            .attr('x', width/2)
            .attr('y', 0+margin/2)
            .style('text-anchor', 'middle')
            .style('fill', '#DE4E45')
            .style('font-size', '14px')
            .text('Boosting');

let dots = svg.selectAll('dots')
                .data(data);

    dots.enter()
                .append('circle')
                .style('fill', 'none')
                .attr('cx',width/2)
                .attr('cy',height/2)                
                .merge(dots)
                .transition()
                .duration(500)
                .attr('class', 'circle')
                .attr('cx',d=>scaleX(d.x1))
                .attr('cy',d=>scaleY(d.x2))
                .attr('r', 3)
                .style('fill', d=>{
                    if(d.y==0){return 'pink'}
                    else if(d.y==1){return '#DE4E45'}
                });

    dots.exit().remove();


xAxisGroup.transition().duration(100).call(xAxis);
yAxisGroup.transition().duration(100).call(yAxis);


data.forEach(d=>{
    if (d.x1<2.9){
        d.group1 = 0;
    } else if (d.x1>2.9){
        d.group1 = 1;
    }
});

console.log(data);

let weight = 1/data.length;

data.forEach(d=>{
    if (d.group1==d.y){
        d.wterror11 = 0*weight;
    } else if (d.group1!=d.y){
        d.wterror11 = 1*weight;
    }
});


let misclass = d3.sum(data, d=>d.wterror11)/(weight*data.length);

console.log(misclass);

let stage1 = Math.log((1-misclass)/misclass);

console.log(stage1);

data.forEach(d=>{
    d.wterror12 = d.wterror11*Math.exp(stage1*d.wterror11);
});


data.forEach(d=>{
    if (d.x2<2.9){
        d.group2 = 0;
    } else if (d.x2>2.9){
        d.group2 = 1;
    }
});

data.forEach(d=>{
    if (d.group2==d.y){
        d.wterror21 = 0*weight;
    } else if (d.group2!=d.y){
        d.wterror21 = 1*weight;
    }
});

let misclass2 = d3.sum(data, d=>d.wterror21)/(weight*data.length);

console.log(misclass2);

let stage2 = Math.log((1-misclass2)/misclass2);

console.log(stage2);

data.forEach(d=>{
    d.wterror22 = d.wterror21*Math.exp(stage2*d.wterror21);
});

console.log(data);

data.forEach(d=>{
    if (d.x2<3.5){
        d.group3 = 0;
    } else if (d.x2>3.5){
        d.group3 = 1;
    }
});

data.forEach(d=>{
    if (d.group3==d.y){
        d.wterror31 = 0*weight;
    } else if (d.group3!=d.y){
        d.wterror31 = 1*weight;
    }
});

let misclass3 = d3.sum(data, d=>d.wterror31)/(weight*data.length);

console.log(misclass3);

let stage3 = Math.log((1-misclass3)/misclass3);

console.log(stage3);

data.forEach(d=>{
    d.wterror32 = d.wterror31*Math.exp(stage3*d.wterror31);
});


data.forEach(d=>{
    if (d.group1==0){
        d.model1=stage1*-1;
    } else {
        d.model1=stage1*1;
    }
    
    if (d.group2==0){
        d.model2=stage2*-1;
    } else {
        d.model2=stage2*1;
    }

    if (d.group3==0){
        d.model3=stage3*-1;
    } else {
        d.model3=stage3*1;
    }
});


console.log(data);

data.forEach(d=>{
    if (d.model1+d.model2+d.model3<0){
        d.prediction=0;
    } else if (d.model1+d.model2+d.model3>0){
        d.prediction=1;
    }
});

let error = 0;
let correct = 0;

data.forEach(d=>{
    if (d.prediction==d.y){
        correct++;
    } else if (d.prediction!=d.y){
        error++;
    }
});
console.table(data);
console.log('Prediction accuracy', 100*correct/data.length);

let preddots = svg.selectAll('dots')
                .data(data);

    preddots.enter()
                .append('circle')
                .style('fill', 'none')
                .attr('cx',width/2)
                .attr('cy',height/2)                
                .merge(dots)
                .transition()
                .duration(500)
                .attr('class', 'circle')
                .attr('cx',d=>scaleX(d.x1))
                .attr('cy',d=>scaleY(d.x2))
                .attr('fill-opacity', 0)
                .attr('r', 5)
                .style('stroke', d=>{
                    if(d.prediction==0){return 'pink'}
                    else if(d.prediction==1){return '#DE4E45'}
                });

    preddots.exit().remove();


}

boosting();

