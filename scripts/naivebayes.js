function naivebayes() {let data = [];

data = [
{earnings:1,gdp:1,prices:1},
{earnings:1,gdp:1,prices:1},
{earnings:1,gdp:1,prices:1},
{earnings:1,gdp:1,prices:1},
{earnings:1,gdp:1,prices:1},

{earnings:0,gdp:0,prices:0},
{earnings:0,gdp:0,prices:0},
{earnings:0,gdp:1,prices:0},
{earnings:1,gdp:0,prices:0},
{earnings:0,gdp:0,prices:0},
];

console.log(data);



const width = 400, height = 400, margin = 25;

const svg = d3.select('#naivebayes')
                .append('svg')
                .attr('width',width)
                .attr('height',height);

let scaleX = d3.scaleLinear().range([2*margin,width-2*margin]).domain(d3.extent(data,d=>d.earnings));
let scaleY = d3.scaleLinear().range([height-2*margin,2*margin]).domain(d3.extent(data,d=>d.gdp));

let xAxis = d3.axisBottom();
let yAxis = d3.axisLeft();

xAxis.scale(scaleX).ticks(2);
yAxis.scale(scaleY).ticks(2);

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
            .text('Naive Bayes');


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
                .attr('cx',d=>scaleX(d.earnings)+Math.random()*10)
                .attr('cy',d=>scaleY(d.gdp)+Math.random()*10)
                .attr('r', d=>{
                    if(d.prices==0){return 4}
                    else if(d.prices==1){return 3}
                })
                .style('fill', d=>{
                    if(d.prices==0){return 'yellow'}
                    else if(d.prices==1){return '#DE4E45'}
                })
                .style('fill-opacity', 0.4);

    dots.exit().remove();


// xAxisGroup.transition().duration(100).call(xAxis);
// yAxisGroup.transition().duration(100).call(yAxis);

let count1=0, count2=0;

data.forEach(d=>{
    if(d.prices==1){count1++;}
    else if (d.prices==0){count2++;}
});

totalcount = count1+count2;
p1 = count1/totalcount;
p2 = count2/totalcount;

console.log(p1,p2);

let p_earnings_up_1 = 0,
    p_earnings_down_1 = 0,
    p_earnings_up_0 = 0,
    p_earnings_down_0 = 0;

data.forEach(d=>{
    if(d.earnings==1 & d.prices==1){p_earnings_up_1++}
    else if(d.earnings==0 & d.prices==1){p_earnings_down_1++}
    else if(d.earnings==1 & d.prices==0){p_earnings_up_0++}
    else if(d.earnings==0 & d.prices==0){p_earnings_down_0++}    
});

p_earnings_up_1 = p_earnings_up_1/count1;
p_earnings_down_1 = p_earnings_down_1/count1;
p_earnings_up_0 = p_earnings_up_0/count2;
p_earnings_down_0 = p_earnings_down_0/count2;


console.log(p_earnings_up_1,p_earnings_down_1,p_earnings_up_0,p_earnings_down_0);

let p_gdp_up_1 = 0,
    p_gdp_down_1 = 0,
    p_gdp_up_0 = 0,
    p_gdp_down_0 = 0;

data.forEach(d=>{
    if(d.gdp==1 & d.prices==1){p_gdp_up_1++}
    else if(d.gdp==0 & d.prices==1){p_gdp_down_1++}
    else if(d.gdp==1 & d.prices==0){p_gdp_up_0++}
    else if(d.gdp==0 & d.prices==0){p_gdp_down_0++}    
});

p_gdp_up_1 = p_gdp_up_1/count1;
p_gdp_down_1 = p_gdp_down_1/count1;
p_gdp_up_0 = p_gdp_up_0/count2;
p_gdp_down_0 = p_gdp_down_0/count2;


console.log(p_gdp_up_1,p_gdp_down_1,p_gdp_up_0,p_gdp_down_0);

console.log(p_earnings_up_1*p_gdp_up_1*p1);
console.log(p_earnings_up_0*p_gdp_up_0*p2);

data.forEach(d=>{
    if(d.earnings==1 & d.gdp==1){
        d.priceup = p_earnings_up_1*p_gdp_up_1*p1;
        d.pricedown = p_earnings_up_0*p_gdp_up_0*p2;
    }
    else if(d.earnings==0 & d.gdp==1){
        d.priceup = p_earnings_down_1*p_gdp_up_1*p1;
        d.pricedown = p_earnings_down_0*p_gdp_up_0*p2;
    }
    else if(d.earnings==1 & d.gdp==0){
        d.priceup = p_earnings_up_1*p_gdp_down_1*p1;
        d.pricedown = p_earnings_up_0*p_gdp_down_0*p2;
    }
    else if(d.earnings==0 & d.gdp==0){
        d.priceup = p_earnings_down_1*p_gdp_down_1*p1;
        d.pricedown = p_earnings_down_0*p_gdp_down_0*p2;
    }    
});

data.forEach(d=>{
    if (d.priceup>d.pricedown){
        d.pred = 1;
    } else if (d.priceup<d.pricedown){
        d.pred = 0;
    }
});

console.log(data);


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
                .attr('cx',d=>scaleX(d.earnings)+Math.random()*10)
                .attr('cy',d=>scaleY(d.gdp)+Math.random()*10)
                .attr('fill-opacity', 0)
                .attr('r', 3)
                .style('stroke', d=>{
                    if(d.pred==0){return 'yellow'}
                    else if(d.pred==1){return '#DE4E45'}
                });

    preddots.exit().remove();

}

naivebayes();