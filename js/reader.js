Papa.parse(filename, {
    download: true,
    header: true,
    skipEmptyLines: true,
  	step(row) {
      const r = row.data;
      if (r.app) {
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
      }
  	},
    complete: () => {
      showtext(false);
      showcolor(false);
      $('#showtext').on('click', () => showtext(true));
      $('#showcolor').on('click', () => showcolor(true));
      $('#analyze').on('click', () => analyze());
    }
});
