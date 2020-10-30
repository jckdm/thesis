const uniqueApps = [];
const apps = [];
const colors = {};

let y = 0;
let c = 0;
let curr, last;

const attrs = {x: 0, height: 15, width: 200, stroke: '#262626', 'stroke-width': 0.125};

let all = false;

show = (x) => {

  if (x) {
    // remove svg, append fresh onoe
    $('#path').remove();
    $('#box').append('<svg id="path"></svg>');
    all = !all;
  }

  // reset y coord
  y = 0;

  for (app of apps) {
    curr = app;

      if (curr != last) {
        // create new SVG rect
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        // set attributes from dict
        for (const attr in attrs) { rect.setAttribute(attr, attrs[attr]) }
        // manually set Y and Fill
        rect.setAttribute('y', y)
        rect.setAttribute('fill', colors[curr])
        // append to SVG
        $('#path').append(rect);
        y += 15;
        // extend SVG height
        $('#path').attr('height', y);
        // to show some, set last to curr
        last = (all) ? '' : curr;
      }
    }
}
