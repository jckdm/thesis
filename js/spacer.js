Papa.parse(filename, {
    download: true,
    header: true,
    skipEmptyLines: true,
  	step(row) {
      const r = row.data;
      if (r.app) {
        const app = r.app;
        const cleanApp = app.replace(/\W/g, '');

        if (!uniqueApps.includes(cleanApp)) {
          uniqueApps.push(cleanApp);
          // get next color in scheme
          if (c < 17) {
            colors[cleanApp] = scheme[c];
            c++;
          }
          // or generate a new one
          else { colors[cleanApp] = colorize(); }
        }
        apps.push(app);
      }
  	},
    complete: () => {
      show(false);
      $('#show').on('click', () => show(true));
    }
});
