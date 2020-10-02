var filename = 'jackadam-1440-900-.csv';
var fs = filename.split('-');

$('#title').text(fs[0]);

var w = parseInt(fs[1]);
var h = parseInt(fs[2]);

var padding = 30;
var apps = [];
var uniqueApps = [];
var coords = [];
var dates = [];
var times = [];
var color = {};

function getR(min, max) { return Math.floor(Math.random() * max + min); }
function colorize() { return 'rgb(' + getR(25, 230) + ',' + getR(25, 230) + ',' + getR(25, 230) + ')'; }

d3.select("input")
  .on("input", function() {
      var radius = +d3.select(this).node().value;
      d3.selectAll("circle")
        .attr("r", radius);
      $('#rad').text('r = ' + radius);
});

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

var timeFlag = false;

function time() {
  var i = 'timesort';
  swap(i, i, document.getElementById(i), false);
  timeFlag = (timeFlag == false) ? true : false;
}

function swap(id, cId, e, flag) {
  var c = (flag) ? color[cId] : 'black';

  if (e.style.color == 'white') {
    if (id == 'all' || id == 'timesort') { c = 'white'; }
    e.style.backgroundColor = c;
    e.style.color = 'black';
  }
  else {
    if (id == 'all' || id == 'timesort') { c = 'black'; }
    e.style.backgroundColor = c;
    e.style.color = 'white';
  }
}

async function query(id) {
  if (id != 'timesort') {
    var cId = id.replace(/\W/g, '');
    var e = document.getElementById(id);

    if (id == 'all') {
      for (var i = 1; i < e.parentElement.length; i++) {
        query(e.parentElement[i].id);
      }
      swap(id, cId, e, false);
    }

    else if (e.style.color == 'white') {
      swap(id, cId, e, true);

      if (timeFlag) {
        var circles = $('circle.' + cId);
        var num = circles.length;

        for (var i = 0; i < num; i++) {
          circles[i].style.fill = color[cId];
          await sleep(num / 1000);
        }
      }
      else {
        d3.selectAll('circle.' + cId)
          .attr('fill', function(d, i) { return color[cId]; })
          .attr('stroke', 'gray');
      }
    }
    else {
      swap(id, cId, e, false);
      d3.selectAll('circle.' + cId)
        .attr('fill', 'none')
        .attr('stroke', 'none');
    }
  }
}

var c = 0;

var scheme = ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)',
'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)', 'rgb(179,222,105)',
'rgb(252,205,229)', 'rgb(217,217,217)', 'rgb(188,128,189)', 'rgb(204,235,197)',
'rgb(255,237,111)', 'rgb(115, 125, 225)', 'rgb(105, 150, 140)', 'rgb(70, 180, 70)',
'rgb(50,204,165)', 'rgb(215,85,85)'];

Papa.parse(filename, {
    download: true,
    header: true,
    skipEmptyLines: true,
  	step: function(row) {
      var app = row['data']['app'];
      if (!apps.includes(app.replace(/\W/g, ''))) {
        uniqueApps.push(app);
        if (c < 17) {
          color[app.replace(/\W/g, '')] = scheme[c];
          c++;
        }
        else { color[app.replace(/\W/g, '')] = colorize(); }
      }
      apps.push(app.replace(/\W/g, ''));
      coords.push([parseFloat(row['data']['x']), parseFloat(row['data']['y'])]);
      dates.push(row['data']['date']);
      times.push(row['data']['time']);
  	},
  	complete: function() {

      for (var i = 0; i < uniqueApps.length; i++) {
        $('#form').append('<button type="button" style="color: black; background-color: ' + color[uniqueApps[i].replace(/\W/g, '')] + ';" onclick="query($(this)[0].id)" id="' + uniqueApps[i] + '">' + uniqueApps[i] + '</button>');
      }

      $('#title').append(' ' + dates[0] + ' ' + times[0] + ' – ' + dates[dates.length - 1] + ' ' + times[times.length - 1]);

      var svg = d3.select('body')
                  .append('svg')
                  .attr('width', w)
                  .attr('height', h);

      var xScale = d3.scaleLinear()
                     .domain([0, w])
                     .range([padding, w - 5])

      var yScale = d3.scaleLinear()
                     .domain([0, h])
                     .range([h - padding, padding]);

      var xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(25);

      var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(20);

      svg.append('g')
         .attr('class', 'x axis')
         .attr('transform', 'translate(0,' + (h - padding) + ')')
         .call(xAxis);

      svg.append('g')
         .attr('class', 'y axis')
         .attr('transform', 'translate(' + padding + ',0)')
         .call(yAxis);

      // window coords? possible?
      // animate appending of circles

      d3.select('body')
        .append('div')
        .attr('id', 'tooltip');

      svg.selectAll('circle')
          .data(coords)
          .enter()
          .append('circle')
          .attr('cx', function(d) { return xScale(d[0]); })
          .attr('cy', function(d) { return yScale(h - d[1]); })
          .attr('class', function(d, i) { return apps[i].replace(/\W/g, ''); })
          .attr('stroke', 'gray')
          .attr('stroke-width', '1')
          .attr('fill', function(d, i) { return color[apps[i]]; })
          .attr('r', 5)
          .on('mouseover', function(d, i) {
            var att = (this).attributes;
            var c = att.class.value;
            var x = parseFloat(att.cx.value);
            var y = parseFloat(att.cy.value);
              d3.select('#tooltip')
                // .transition()
                // .duration(100)
                .style('opacity', 1)
                .style('left', x + 'px')
                .style('bottom', (h - y) + 'px')
                .text(function() { return c; })
          })
          .on('mouseout', function() {
              d3.select('#tooltip')
                // .transition()
                // .duration(100)
                .style('opacity', 0)
          });
  	}
});
