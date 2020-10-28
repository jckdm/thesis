// color counter
let c = 0;
const color = {};
let curr, last;

Papa.parse(filename, {
    download: true,
    header: true,
    skipEmptyLines: true,
  	step(row) {
      const r = row.data;
      const app = r.app;
      // if app recorded
      if (app) {
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
        curr = cleanApp;
        // if app switched
        if (curr != last) {
          $('body').append('<p style="color:' + color[cleanApp] + ';">' + app + ' <span>' + r.time + '</span></p>');
          last = curr;
        }
      }
  	}
});
