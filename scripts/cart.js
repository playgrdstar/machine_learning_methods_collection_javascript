function cart() {
let data = generateCategoricalData(10,5,1,5);

console.log(data);


const width = 400, height = 400, margin = 25;

const svg = d3.select('#cart')
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
            .text('Classification and Regression Trees');


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
                .attr('r', 2)
                .style('fill', d=>{
                    if(d.y==0){return 'pink'}
                    else if(d.y==1){return '#DE4E45'}
                });

    dots.exit().remove();


xAxisGroup.transition().duration(100).call(xAxis);
yAxisGroup.transition().duration(100).call(yAxis);

let best_gini = Infinity;
let best_x = 0;

for (let i=1.1; i<4.9; i+=0.5){

    data.forEach(d=>{
        if (d.x1<i){
            d.group = 0;
        } else if (d.x1>i){
            d.group = 1;
        }
    });

    let g11=0, g12=0, ng1=0, g21=0, g22=0, ng2=0, n=0;

    n = data.length;

    data.forEach(d=>{
        if (d.group==0 & d.y==0){g11++}
        else if (d.group==0 & d.y==1){g12++}
        else if (d.group==1 & d.y==0){g21++}    
        else if (d.group==1 & d.y==1){g22++}
    });

    ng1 = g11+g12;
    ng2 = g21+g22;

    g11 = g11/ng1;
    g12 = g12/ng1;

    g21 = g21/ng2;
    g22 = g22/ng2;

    let gini;

    console.log(g11, g12, ng1, g21, g22, ng2, n);

    gini = ((1-(g11*g11+g12*g12))*ng1/n)+((1-(g21*g21+g22*g22))*ng2/n);
    console.log('Split at:', i, ' ', gini);   

    if (gini<best_gini){
        best_gini = gini;
        best_x = i;
    }


}
    console.log('Best', best_x, best_gini);

svg.append('line')
    .attr('x1', scaleX(best_x))
    .attr('y1', 0+margin*1.5)
    .attr('x2', scaleX(best_x))
    .attr('y2', height-margin*1.5)
    .style("stroke-width", 1)
    .style("stroke", "red")
    .attr("stroke-dasharray", "2 5")
    .style("fill", "none");
}

cart();