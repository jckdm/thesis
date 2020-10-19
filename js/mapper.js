const filename = 'data/' + window.location.href.split('=')[1];

const fs = filename.split('-');

const w = parseInt(fs[1]);
const h = parseInt(fs[2]);

Papa.parse(filename, {
    download: true,
    header: true,
    skipEmptyLines: true,
  	step(row) {
      const r = row.data;
      if (r.app) {
        const app = r.app;
        const cleanApp = app.replace(/\W/g, '');
        // push data to respective arrays
        apps.push(cleanApp);
        coords.push([parseFloat(r.x), parseFloat(r.y)]);
        dates.push(r.date);
        times.push(r.time);
      }
  	},
  	complete: () => {
      // append user tracked and span of time
      $('#title').text(fs[0].slice(5) + ' ' + dates[0] + ' ' + times[0] + ' – ' + dates[dates.length - 1] + ' ' + times[times.length - 1]);

      grid();
  	}
});
