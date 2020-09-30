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

function colorize() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

d3.select("input")
    .on("input", function() {
        var radius = +d3.select(this).node().value;
        d3.selectAll("circle")
            .attr("r", radius);
        $('#rad').text('r = ' + radius);
});

var c = 0;

Papa.parse(filename, {
    download: true,
    header: true,
    skipEmptyLines: true,
  	step: function(row) {
      var app = row['data']['app'];
      if (!apps.includes(app)) {
        uniqueApps.push(app);
        if (c < 12) {
          color[app] = d3.schemeSet3[c];
          c++;
        }
        else if (c == 12) {
          color[app] = colorize();
        }
      }
      apps.push(app);
      coords.push([parseFloat(row['data']['x']), parseFloat(row['data']['y'])]);
      dates.push(row['data']['date']);
      times.push(row['data']['time']);
  	},
  	complete: function() {

      for (var i = 0; i < uniqueApps.length; i++) {
        $('#form').append('<input type="checkbox" checked="true" id="' + uniqueApps[i] + '"> <label for"' + uniqueApps[i] + '">' + uniqueApps[i] + '</label> &nbsp;');
      }

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

      svg.selectAll('circle')
          .data(coords)
          .enter()
          .append('circle')
          .attr('cx', function(d) { return xScale(d[0]); })
          .attr('cy', function(d) { return yScale(h - d[1]); })
          .attr('stroke', 'gray')
          .attr('stroke-width', '1')
          .attr('fill', function(d, i) { return color[apps[i]]; })
          .attr('r', 5)
          .append('title')
          .text(function(d, i) {
              return apps[i] + ' ' + times[i];
          });
  	}
});
