Papa.parse(filename, {
    download: true,
    header: true,
    skipEmptyLines: true,
  	step(row) {
      const r = row.data;
      if (r.app) {
        // push data to respective arrays
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
