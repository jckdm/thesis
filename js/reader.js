let c = 0;
let startDate, startTime, endDate, endTime;

Papa.parse(filename, {
    download: true,
    header: true,
    skipEmptyLines: true,
  	step(row) {
      const r = row.data;
      if (r.app) {
        if (c == 0) { $('#tit').text(user + ' ' + r.date + ' ' + r.time + ' – '); }
        const app = r.app;
        if (app.length > longestApp.length) { longestApp = app; }
        const cleanApp = app.replace(/\W/g, '');
        // if not in dictionary
        if (!colors[cleanApp]) {
          // get next color in scheme
          if (c < 17) {
            colors[cleanApp] = scheme[c];
            c++;
          }
          // or generate a new one
          else { colors[cleanApp] = colorize(); }
        }
        apps.push(app);
        times.push(r.time);
        endDate = r.date;
        endTime = r.time;
      }
  	},
    complete: () => {
      document.title = 'DD: Reader';
      $('#tit').append(endDate + ' ' + endTime);
      showtext(false);
      showcolor(false);
      $('#showtext').on('click', () => showtext(true));
      $('#showcolor').on('click', () => showcolor(true));
      $('#analyze').on('click', () => analyze());
    }
});
