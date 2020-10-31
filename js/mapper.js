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
        if (c == 0) { $('#title').text(fs[0].slice(5) + ' ' + r.date + ' ' + r.time + ' – '); }
        const app = r.app;
        const cleanApp = app.replace(/\W/g, '');
        // if app not yet seen
        if (!apps.includes(cleanApp)) {
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
        apps.push(cleanApp);
        endDate = r.date;
        endTime = r.time;
      }
  	},
  	complete: () => {
      // append end time
      $('#title').append(endDate + ' ' + endTime);
      grid();
  	}
});
