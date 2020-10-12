// color counter
let c = 0;
const filename = '../data/' + window.location.href.split('=')[1];

const data = [];
const color = {};

const scheme = ['rgb(141,200,199)', 'rgb(255,255,179)', 'rgb(190,186,218)',
'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)', 'rgb(179,222,105)',
'rgb(252,205,229)', 'rgb(217,217,217)', 'rgb(188,128,189)', 'rgb(204,235,197)',
'rgb(255,237,111)', 'rgb(115, 125, 225)', 'rgb(105, 150, 140)', 'rgb(70, 180, 70)',
'rgb(50,225,165)', 'rgb(215,85,85)'];

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
        $('body').append('<p style="font-size: calc(18px + 1.25vw + 0.75vh); color:' + color[app.replace(/\W/g, '')] + ';">' + app + ' <span style="color: white;">' + curr[1] + '</span></p>');
      }
    }
});
