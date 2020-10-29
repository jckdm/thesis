const uniqueApps = [];
const apps = [];
const colors = {};

let y = 0;
let c = 0;
let curr, last;

const attrs = {x: 0, height: 20, width: 200, stroke: '#262626', 'stroke-width': 0.125};

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

  for (let i = 0; i < apps.length; i++) {

    // to show some, set current to app
    curr = (all) ? ' ' : apps[i];

      if (curr != last) {
        // create new SVG rect
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        // set attributes from dict
        for (const a in attrs) { rect.setAttribute(a, attrs[a]) }
        // manually set Y and Fill
        rect.setAttribute('y', y)
        rect.setAttribute('fill', colors[apps[i]])
        // append to SVG
        $('#path').append(rect);
        y += 20;
        // extend SVG height
        $('#path').attr('height', y);
        // to show some, set last to curr
        last = (all) ? '' : curr;
      }
    }
}
