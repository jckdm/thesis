var filename = 'jackadam-1440-900-.csv';
var fs = filename.split('-');

var w = parseInt(fs[1]);
var h = parseInt(fs[2]);

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
        $('form').append('<button type="button" style="color: black; background-color: ' + color[uniqueApps[i].replace(/\W/g, '')] + ';" onclick="query($(this)[0].id)" id="' + uniqueApps[i] + '">' + uniqueApps[i] + '</button>');
      }

      $('#title').text(fs[0] + ' ' + dates[0] + ' ' + times[0] + ' – ' + dates[dates.length - 1] + ' ' + times[times.length - 1]);

      var svg = d3.select('body').append('svg').attr('width', w).attr('height', h);

      var xScale = d3.scaleLinear().domain([0, w]).range([padding, w - 5])
      var yScale = d3.scaleLinear().domain([0, h]).range([h - padding, padding]);

      var xAxis = d3.axisBottom().scale(xScale).ticks(25);
      var yAxis = d3.axisLeft().scale(yScale).ticks(20);

      svg.append('g')
         .attr('class', 'x axis')
         .attr('transform', 'translate(0,' + (h - padding) + ')')
         .call(xAxis);

      svg.append('g')
         .attr('class', 'y axis')
         .attr('transform', 'translate(' + padding + ',0)')
         .call(yAxis);

      d3.select('body').append('div').attr('id', 'tooltip');

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
          .attr('r', 4.5);
          // .on('mouseover', function(d, i) {
          //   var att = (this).attributes;
          //   var c = att.class.value;
          //   var x = parseFloat(att.cx.value);
          //   var y = parseFloat(att.cy.value);
          //     d3.select('#tooltip')
          //       // .transition()
          //       // .duration(100)
          //       .style('opacity', 1)
          //       .style('left', x + 'px')
          //       .style('bottom', (h - y - 300) + 'px')
          //       .text(function() { return c; })
          // })
          // .on('mouseout', function() {
          //     d3.select('#tooltip')
          //       // .transition()
          //       // .duration(100)
          //       .style('opacity', 0)
          // });
  	}
});
