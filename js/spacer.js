const apps = [];
const colors = {};

let y = 0;
let c = 0;

const attrs = {x: 0, height: 20, width: 200, stroke: '#262626', 'stroke-width': 0.125};

Papa.parse(filename, {
    download: true,
    header: true,
    skipEmptyLines: true,
  	step(row) {
      const r = row.data;
      if (r.app) {
        const app = r.app;
        const cleanApp = app.replace(/\W/g, '');

        if (!apps.includes(cleanApp)) {
          apps.push(cleanApp);
          // get next color in scheme
          if (c < 17) {
            colors[cleanApp] = scheme[c];
            c++;
          }
          // or generate a new one
          else { colors[cleanApp] = colorize(); }
        }
        // create new SVG rect
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        // set attributes from dict
        for (const a in attrs) { rect.setAttribute(a, attrs[a]) }
        // manually set Y and Fill
        rect.setAttribute('y', y)
        rect.setAttribute('fill', colors[cleanApp])
        // append to SVG
        $('#path').append(rect);
        y += 20;
        // extend SVG height
        $('#path').attr('height', y);
      }
  	}
});
