const padding = 30;
const apps = [];
const coords = [];
const dates = [];
const times = [];

let g = false;

let sq = 10;

// pause for ms millseconds
sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

grid = (x) => {

  if (g) {
    d3.select('#grid').remove();
    $('body').append('<div id="grid"></div>');
    g = false;
  }

  if (x !== undefined) { sq = parseInt(x.split(' ')[0]); }

  const data = [];
  let xpos = 1;
  let ypos = 1;

  for (let row = 0; row < h / sq; row++) {
    data.push([]);

    for (let column = 0; column < w / sq; column++) {
      data[row].push({
        x: xpos,
        y: ypos
      })
      xpos += sq;
    }
    xpos = 1;
    ypos += sq;
  }

  const gg = d3.select('#grid')
    .append('svg')
    .attr('width', w + padding)
    .attr('height', h + padding);

  const row = gg.selectAll('.row')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'row');

  row.selectAll('.square')
    .data(function(d) { return d; })
    .enter()
    .append('rect')
    .attr('class', 'square')
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('width', sq)
    .attr('height', sq)
    .style('fill', 'gray')
    .style('stroke', '#262626');

    g = true;
}
