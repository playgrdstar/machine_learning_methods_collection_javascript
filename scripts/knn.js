
function knn() {

let data = generateCategoricalData(10,5,1,10);

console.log(data);



const width = 500, height = 500, margin = 50;

const svg = d3.select('#knn')
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
            .text('KNN');

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


// xAxisGroup.transition().duration(100).call(xAxis);
// yAxisGroup.transition().duration(100).call(yAxis);

newdata = [
{x1:8.1,x2:3.4,y:1}
];

let newdot = svg.append('circle')
                .attr('class', 'circle')
                .attr('cx',scaleX(newdata[0].x1))
                .attr('cy',scaleY(newdata[0].x2))
                .attr('r', 10)
                .style('fill', 'none')
                // .style('fill-opacity', 0.2)
                .style('stroke', 'yellow');

let x1 = newdata[0].x1;
let x2 = newdata[0].x2;

data.forEach(d=>{
    // let distance = 0;
    d.distance = Math.sqrt((d.x1-x1)*(d.x1-x1)+(d.x2-x2)*(d.x2-x2));
})

var sorted = (data.sort((x,y)=>{
    return d3.ascending(x.distance, y.distance);
}));

console.log(sorted[0]);

let preddot = svg.append('circle')
                .attr('class', 'circle')
                .attr('cx',scaleX(newdata[0].x1))
                .attr('cy',scaleY(newdata[0].x2))
                .attr('r', 5)
                .style('fill', 'none')
                .style('stroke', d=>{
                    if(sorted[0].y==0){return 'pink'}
                    else if(sorted[0].y==1){return '#DE4E45'}
                });

}


knn();