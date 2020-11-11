const padding = 20;
const coords = [];
const apps = [];
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

  // switch btw filled and unfilled 0 value squares
  else if (x == 'z') {
    const b = $('#hide')[0].style;
    // change sq color
    zero = (b.color == 'black') ? 'black' : 'none';
    // style button
    b.color = (zeroflag) ? 'white' : 'black';
    b.backgroundColor = (zeroflag) ? 'black' : 'white';
    zeroflag = !zeroflag;
  }
  else if (x == 'c') {
    const b = $('#col')[0].style;
    // style button
    b.color = (colflag) ? 'white' : 'black';
    b.backgroundColor = (colflag) ? 'black' : 'white';
    colflag = !colflag;
  }

  const data = [];
  let xPos = 1;
  let yPos = 1;

  // construct empty matrix
  for (let row = 0; row < h / sq; row++) {
    data.push([]);
    for (let column = 0; column < w / sq; column++) {
      data[row].push({ x: xPos, y: yPos, c: 0, apps: {} })
      xPos += sq;
    }
    xPos = 1;
    yPos += sq;
  }

  // map coords to grid, calculate maximum
  for (let i = 0; i < coords.length; i++) {
    // calculate grid location
    const bucket = data[Math.floor(coords[i][1] / sq)][Math.floor(coords[i][0] / sq)];
    bucket.c += 1;
    max = (bucket.c > max) ? bucket.c : max;
    // add to apps dict
    const curr = apps[i];
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
        if (ad) {
          return color[(Object.keys(ad).reduce((a, b) => ad[a] > ad[b] ? a : b)).replace(/\W/g, '')];
        }
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
        let content = '';

        // tooltip text
        for (app in aa) { content += '<span style="color:' + color[app.replace(/\W/g, '')] + ';">' + app + ' : ' + aa[app] + ' sec </span><br>'; }

        // add app counts
        $('#tt').html(content);

        // show tooltip
        const tool = d3.select('#tooltip')
          .transition()
          .duration(100)
          .style('visibility', 'visible')

        // pie the values, save the keys
        const pie = d3.pie();
        const vals = pie(Object.values(aa));
        const keys = Object.keys(aa);

        // add key to each dict, for coloring
        for (i in vals) { vals[i]['key'] = keys[i].replace(/\W/g, ''); }

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
          .attr('d', d3.arc().innerRadius(0).outerRadius(45) )
          .attr('stroke', '#1a1a1a')
          .style('stroke-width', 1.5)
          .style('fill', (d) => color[d.key] )
      }
    })
    .on('mouseout', function() {
      // if tooltip visible, hide it
      if ($('#tooltip').css('visibility') == 'visible') {
        $(this)[0].style.stroke = '#262626';
        // remove pie chart and clear text
        d3.select('#piechart').remove();
        $('#tt').html('');

        // hide tooltip
        d3.select('#tooltip')
          .transition()
          .duration(100)
          .style('visibility', 'hidden')
      }
    })
    .on('mousemove', () => {
      // if near bottom/right edge, move tooltip up/left
      d3.select('#tooltip')
        .style('left', () => ($(document).width() - event.pageX < 200) ? event.pageX - 150 + 'px' : event.pageX + 25 + 'px')
        .style('top', () => ($(document).height() - event.pageY < 200) ? event.pageY - 150 + 'px' : event.pageY + 'px' )
    });
}
