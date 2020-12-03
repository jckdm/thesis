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
        if (!color[cleanApp]) {
          // get next color in scheme
          if (c < 17) {
            color[cleanApp] = scheme[c];
            c++;
          }
          // or generate a new one
          else { color[cleanApp] = colorize(); }
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
      showText(false);
      showColor(false);

      $('#showtext').on('click', () => showText(true));
      $('#showcolor').on('click', () => showColor(true));
      $('#analyze').on('click', () => analyze());
    }
});
