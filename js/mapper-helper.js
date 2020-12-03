const padding = 20;
const apps = [];
const cleanedApps = {};
const color = {};

let zero = 'black';
let zeroflag = false
let colflag = false;
let sq = 10;
let max = -1;

// calculate color as percentage of max
scaleColor = (c) => {
  let p = 255.0 * (Math.log(c) / Math.log(max));
  return (p == 0.0 || !isFinite(p)) ? zero : 'rgb(' + p + ',' + p + ',' + p + ')';
}

grid = (x) => {
  // if grid, remove it
  if (d3.select('#grid')['_groups'][0][0]) {
    d3.select('#grid').remove();
  }
  // and append a new one
  $('body').append('<div id="grid"></div>');

  // default size = 10, otherwise use selected
  if (x != 'z' && x != 'c' && x !== undefined) { sq = parseInt(x.split(' ')[0]); }

  // Hide 0
  else if (x == 'z') {
    // change sq color
    zero = ($('#hide')[0].style.color == 'black') ? 'black' : 'none';
    // style button
    $('#hide').css({'color': (zeroflag) ? 'white' : 'black', 'background-color': (zeroflag) ? 'black' : 'white'})

    zeroflag = !zeroflag;
  }
  // color by most used app
  else if (x == 'c') {
    // style button
    $('#col').css({'color': (colflag) ? 'white' : 'black', 'background-color': (colflag) ? 'black' : 'white'})
    colflag = !colflag;
  }

  const data = [];
  let xPos = 1;
  let yPos = 1;

  // construct empty matrix
  for (let row = 0; row < h / sq; row++) {
    // array per row
    data.push([]);
    // dictionary per element
    for (let column = 0; column < w / sq; column++) {
      // x, y, count, dict of apps and total num seconds in that quadrant
      data[row].push({ x: xPos, y: yPos, c: 0, apps: {} })
      xPos += sq;
    }
    xPos = 1;
    yPos += sq;
  }

  // map coords to grid, calculate maximum
  for (app of apps) {
    // calculate grid location
    const bucket = data[Math.floor(app[1] / sq)][Math.floor(app[0] / sq)];
    bucket.c += 1;
    max = (bucket.c > max) ? bucket.c : max;
    // add to apps dict
    const curr = app[2];
    bucket.apps[curr] = (curr in bucket.apps) ? bucket.apps[curr] += 1 : 1;
  }

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
    .style('stroke', '#262626')
    .style('fill', function(d) {
      // if no apps, delete dict
      if (jQuery.isEmptyObject(Object.values($(this)[0])[0].apps)) { delete Object.values($(this)[0])[0].apps; }
      // if defined earlier, doesn't fully delete
      let ad = Object.values($(this)[0])[0].apps;

      // if coloring by most used app
      if (colflag) {
        // if not empty, return color of max app
        if (ad) { return color[cleanedApps[Object.keys(ad).reduce((a, b) => ad[a] > ad[b] ? a : b)]]; }
        // or return none/black
        else { return zero; }
      }
      // just grayscale
      return scaleColor(d.c);
    })
    .on('mouseover', function() {
      const a = Object.values($(this)[0])[0];

      // if non zero at that sq
      if (a.apps) {
        // highlight
        $(this)[0].style.stroke = '#FFFFFF';
        const aa = a.apps;

        // tooltip text in two columns
        for (app in aa) {
          $('#apps').append('<span style="color:' + color[cleanedApps[app]] + ';">' + app + '</span><br>');
          $('#times').append('<span>' + aa[app] + ' sec</span><br>');
        }

        const ow = $('#tooltip')[0].offsetWidth;
        const asq = a.x + sq - 1;

        // show tooltip
        const tool = d3.select('#tooltip')
          .style('visibility', 'visible')
          .style('left', () => (asq + ow < $(window).width() - 40) ? asq + 25 + 'px' : asq - ow - 100 + 'px')
          .style('top', () => ($(document).height() - event.pageY < 200) ? event.pageY - 150 + 'px' : event.pageY + 'px');

        // pie the values, save the keys
        const pie = d3.pie();
        const vals = pie(Object.values(aa));
        const keys = Object.keys(aa);

        // add key to each dict, for coloring
        for (i in vals) { vals[i]['key'] = cleanedApps[keys[i]]; }

        // append piechart to pie div
        const svg = d3.select('#pie')
                      .append('svg')
                      .attr('id', 'piechart')
                      .attr('width', 100)
                      .attr('height', 100)
                      .append('g')
                      .attr('transform', 'translate(' + 50 + ',' + 50 + ')');

        // draw paths
        svg.selectAll('x')
           .data(vals)
           .enter()
           .append('path')
           .attr('d', d3.arc().innerRadius(0).outerRadius(45))
           .attr('stroke', '#1a1a1a')
           .style('stroke-width', 1.5)
           .style('fill', (d) => color[d.key])
      }
    })
    .on('mouseout', function() {
      $(this)[0].style.stroke = '#262626';

      // hide tooltip
      d3.select('#tooltip')
        .style('visibility', 'hidden')

      // remove pie chart and clear text
      $('#apps').html('');
      $('#times').html('');
      d3.select('#piechart').remove();
    });
}
