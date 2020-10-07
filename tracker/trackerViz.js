// style the hell ouot of this, es lint for airbnb in atom
// radius cleanly
// tooltip
// figure out how to run on moms laptop (What needs to be installed?)
// cOMMENT UR CODe

// local env vs global env, package for python (local is better, for self-contained distributable)
let c = 0;
const filename = 'jackadam-1440-900-.csv';
const fs = filename.split('-');

const w = parseInt(fs[1]);
const h = parseInt(fs[2]);

Papa.parse(filename, {
    download: true,
    header: true,
    skipEmptyLines: true,
  	step(row) {
      const r = row.data;
      const app = r.app;
      const cleanApp = app.replace(/\W/g, '');
      if (!apps.includes(cleanApp)) {
        uniqueApps.push(app);
        if (c < 17) {
          color[cleanApp] = scheme[c];
          c++;
        }
        else { color[cleanApp] = colorize(); }
      }
      apps.push(cleanApp);
      coords.push([parseFloat(r.x), parseFloat(r.y)]);
      dates.push(r.date);
      times.push(r.time);
  	},
  	complete: () => {

      for (let i = 0; i < uniqueApps.length; i++) {
        $('form').append('<button type="button" style="color: black; background-color: ' + color[uniqueApps[i].replace(/\W/g, '')] + ';" onclick="query($(this)[0].id)" id="' + uniqueApps[i] + '">' + uniqueApps[i] + '</button>');
      }

      $('#title').text(fs[0] + ' ' + dates[0] + ' ' + times[0] + ' – ' + dates[dates.length - 1] + ' ' + times[times.length - 1]);

      const svg = d3.select('body').append('svg').attr('width', w).attr('height', h);

      const xScale = d3.scaleLinear().domain([0, w]).range([padding, w - 5])
      const yScale = d3.scaleLinear().domain([0, h]).range([h - padding, padding]);

      const xAxis = d3.axisBottom().scale(xScale).ticks(25);
      const yAxis = d3.axisLeft().scale(yScale).ticks(20);

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
          .attr('cx', (d) => xScale(d[0]))
          .attr('cy', (d) => yScale(h - d[1]))
          .attr('class', (d, i) => apps[i].replace(/\W/g, ''))
          .attr('stroke', 'gray')
          .attr('stroke-width', '1')
          .attr('fill', (d, i) => color[apps[i]])
          .attr('r', 4.5)
          .on('mouseover', function (d, i) {
            // relative to SVG
            // query SVG to get its top, left coords etc, to know how to scale
            // check out murray TB and get sample code for tooltip
            const att = (this).attributes;
            const c = att.class.value;
            const x = parseFloat(att.cx.value);
            const y = parseFloat(att.cy.value);
              d3.select('#tooltip')
                .transition()
                .duration(100)
                .style('opacity', 1)
                .style('left', x + 'px')
                .style('top', y + 'px')
                .text(() => c)
          })
          .on('mouseout', () => {
              d3.select('#tooltip')
                .transition()
                .duration(100)
                .style('opacity', 0)
          });
  	}
});
