
function svm() {
let data = generateCategoricalData2(20,10,1,10);

console.log(data);

const width = 500, height = 500, margin = 50;

const svg = d3.select('#svm')
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
            .text('SVM');

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
                    if(d.y==-1){return 'pink'}
                    else if(d.y==1){return '#DE4E45'}
                });

    dots.exit().remove();


xAxisGroup.transition().duration(100).call(xAxis);
yAxisGroup.transition().duration(100).call(yAxis);




let errors =[];
let epochs = 10;
let A1 = 0.0;
let A2 = 0.0;
let lambda = 0.4;


for (let i=0; i<epochs; i++){

    let error=0;
    let t=1;

    data.forEach(d=>{

        let output;
        let predY;
        output = d.y *((A1*d.x1)+(A2*d.x2));

        if (output<1.0){
            A1 = (1-1/t)*A1+(d.y*d.x1)*1/(lambda*t);
            A2 = (1-1/t)*A2+(d.y*d.x2)*1/(lambda*t);
        } else if (output>1.0){
            A1 = (1-1/t)*A1;
            A2 = (1-1/t)*A2;
        };
        t++;
        // console.log(A1, A2);
        if (((A1*d.x1)+(A2*d.x2))<0){
            d.predY = -1;
        } else if (((A1*d.x1)+(A2*d.x2))>0){
            d.predY = 1;
        };

        if (d.y!=d.predY){error++};
        // console.log(d.y, predY);

    })

    errors.push({error:100*error/data.length, epoch:i});
}


console.log(errors);
console.log(data);

console.log(A1, A2);

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
                    if(d.predY==-1){return 'pink'}
                    else if(d.predY==1){return '#DE4E45'}
                });

    preddots.exit().remove();
}

svm();

