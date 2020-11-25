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
        // append user tracked and span START time
        if (c == 0) { $('#tit').text(user + ' ' + r.date + ' ' + r.time + ' – '); }
        const app = r.app;
        const cleanApp = app.replace(/\W/g, '');
        // if app not yet seen
        if (!apps.includes(app)) {
          // get next color in scheme
          if (c < 17) {
            color[cleanApp] = scheme[c];
            c++;
          }
          // or generate a new one
          else { color[cleanApp] = colorize(); }
        }
        // push data to respective arrays
        coords.push([parseFloat(r.x), parseFloat(r.y)]);
        apps.push(app);
        endDate = r.date;
        endTime = r.time;
      }
  	},
  	complete: () => {
      document.title = 'DD: Mapper';
      // append end time
      $('#tit').append(endDate + ' ' + endTime);
      grid();
  	}
});
