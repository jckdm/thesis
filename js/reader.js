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
        // log start date & time
        if (c == 0) { startDate = r.date; startTime = r.time; }
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

      // if same start and end date, only show once, otherwise show start and end dates
      const titText = (startDate == endDate) ? user + ' ' + startDate + ' ' + startTime + ' – ' + endTime : user + ' ' + startDate + ' ' + startTime + ' – ' + endDate + ' ' + endTime;
      $('#tit').text(titText);

      // draw text and color
      showtext(false);
      showcolor(false);
      
      $('#showtext').on('click', () => showtext(true));
      $('#showcolor').on('click', () => showcolor(true));
      $('#analyze').on('click', () => analyze());
    }
});
