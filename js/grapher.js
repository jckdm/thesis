// color counter
let c = 0;
let startDate, startTime, endDate, endTime;

Papa.parse(filename, {
    download: true,
    header: true,
    skipEmptyLines: true,
  	step(row) {
      const r = row.data;
      if (r.app) {
        // log start and end times
        if (c == 0) { startDate = r.date; startTime = r.time; }
        const app = r.app;
        const cleanApp = app.replace(/\W/g, '');
        // if app not yet seen
        if (!cleanedApps[app]) {
          cleanedApps[app] = cleanApp;
          // get next color in scheme
          if (c < 17) {
            color[cleanApp] = scheme[c];
            c++;
          }
          // or generate a new one
          else { color[cleanApp] = colorize(); }
        }
        // push data to respective arrays
        apps.push([parseFloat(r.x), parseFloat(r.y), app]);
        endDate = r.date;
        endTime = r.time;
      }
  	},
  	complete: () => {
      document.title = 'DD: Grapher';
      // append buttons for each app
      for (u in cleanedApps) {
        const cleaned = u.replace(/\W/g, '');
        $('#options').append('<button type="button" style="color: black; background-color: ' + color[cleaned] + ';" onclick="query($(this)[0].id)" class="app" id="' + cleaned + '">' + u + '</button>');
      }

      // append options for radii
      let s = '';
      for (let i = 2.0; i < 6.5; i += 0.5) {
        if (i == 4.5) { s = 'selected'; }
        $('#radii').append('<option ' + s + '>' + i.toFixed(1) + '</option>');
        s = '';
      }

      // if same start and end date, only show once, otherwise show start and end dates
      const titText = (startDate == endDate) ? user + ' ' + startDate + ' ' + startTime + ' – ' + endTime : user + ' ' + startDate + ' ' + startTime + ' – ' + endDate + ' ' + endTime;

      // append user tracked and span of time
      $('#tit').text(titText);

      const svg = d3.select('body').append('svg').attr('width', w).attr('height', h);

      // define scales and axes
      const xScale = d3.scaleLinear().domain([0, w]).range([padding, w - 5])
      const yScale = d3.scaleLinear().domain([0, h]).range([h - padding, padding]);
      const xAxis = d3.axisBottom().scale(xScale).ticks(25);
      const yAxis = d3.axisLeft().scale(yScale).ticks(20);

      svg.append('g')
         .attr('class', 'xaxis')
         .attr('transform', 'translate(0,' + (h - padding) + ')')
         .call(xAxis);

      svg.append('g')
         .attr('class', 'yaxis')
         .attr('transform', 'translate(' + padding + ',0)')
         .call(yAxis);

      // append tooltip
      d3.select('body').append('div').attr('id', 'tooltip');

      // append data!
      svg.selectAll('circle')
          .data(apps)
          .enter()
          .append('circle')
          .attr('cx', (d) => xScale(d[0]))
          .attr('cy', (d) => yScale(h - d[1]))
          .attr('class', (d) => cleanedApps[d[2]])
          .attr('stroke', 'gray')
          .attr('stroke-width', '1')
          .attr('fill', (d) => color[cleanedApps[d[2]]])
          .attr('r', 4.5)
          // highlight button of selected app on hover
          .on('mouseover', function () {
            d3.selectAll('.app').style('visibility', 'hidden');
            d3.selectAll('#' + (this).attributes.class.value).style('visibility', 'visible');
          })
          .on('mouseout', () => d3.selectAll('.app').style('visibility', 'visible') );
  	}
});
