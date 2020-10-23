// color counter
let c = 0;

const data = [];
const color = {};

Papa.parse(filename, {
    download: true,
    header: true,
    skipEmptyLines: true,
  	step(row) {
      const r = row.data;
      const app = r.app;
      const cleanApp = app.replace(/\W/g, '');

      if (!color[cleanApp]) {
        // get next color in scheme
        if (c < 17) {
          color[cleanApp] = scheme[c];
          c++;
        }
        // or generate a new one
        else { color[cleanApp] = colorize(); }
      }

      // push data to array
      data.push([app, r.time]);
  	},
  	complete: () => {
      for (let i = 0; i < data.length; i++) {
        let curr = data[i];
        let app = curr[0];
        $('body').append('<p style="color:' + color[app.replace(/\W/g, '')] + ';">' + app + ' <span>' + curr[1] + '</span></p>');
      }
    }
});
