const padding = 20;
const coords = [];
const dates = [];
const times = [];

let g = false;
let zero = 'black';
let sq = 10;
let max = -1;

// calculate color as percentage of max
scaleColor = (c) => {
  let p = 255.0 * (Math.log(c) / Math.log(max));
  return (p == 0.0 || !isFinite(p)) ? zero : 'rgb(' + p + ',' + p + ',' + p + ')';
}

grid = (x) => {
  // if grid already exists
  if (g) {
    d3.select('#grid').remove();
    $('body').append('<div id="grid"></div>');
    g = false;
  }

  // default size = 10
  if (x !== undefined) { sq = parseInt(x.split(' ')[0]); }

  const data = [];
  let xPos = 1;
  let yPos = 1;

  // construct empty matrix
  for (let row = 0; row < h / sq; row++) {
    data.push([]);
    for (let column = 0; column < w / sq; column++) {
      data[row].push({ x: xPos, y: yPos, c: 0 })
      xPos += sq;
    }
    xPos = 1;
    yPos += sq;
  }

  // map coords to grid, calculate maximum
  for (c of coords) {
    let bucket = data[Math.floor(c[1] / sq)][Math.floor(c[0] / sq)];
    bucket.c += 1;
    max = (bucket.c > max) ? bucket.c : max;
  }

  // switch btw filled and unfilled 0 value squares
  zero = ($('#hide')[0].checked) ? 'none' : 'black';

  const gg = d3.select('#grid')
    .append('svg').attr('width', w + padding).attr('height', h + padding);

  const row = gg.selectAll('.row')
    .data(data).enter().append('g');

  row.selectAll('.square')
    .data((d) => d)
    .enter()
    .append('rect')
    .attr('x', (d) => d.x)
    .attr('y', (d) => d.y)
    .attr('width', sq)
    .attr('height', sq)
    .style('fill', (d) => scaleColor(d.c))
    .style('stroke', '#262626')
    // on hover, fill green and display seconds
    .on('mouseover', function(d) {
      let val = Object.values($(this)[0])[0].c;
      // only show values on non-zero / visible squares
      if (zero == 'black' || val != 0) {
        $('#sec').text(val + ' seconds')
        $(this)[0].style.fill = '#3CB371';
      }
    })
    .on('mouseout', function(d) {
      let val = Object.values($(this)[0])[0].c;
      if (zero == 'black' || val != 0) {
        $('#sec').text('');
        $(this)[0].style.fill = scaleColor(Object.values($(this)[0])[0].c);
      }
    });
    // enjoy your map
    g = true;
    // event listener
    $(() => { $('option').on('click', function() { grid($(this)[0].innerText); }); });
}
