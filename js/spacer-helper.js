const uniqueApps = [];
const apps = [];
const colors = {};

let y = 0;
let c = 0;
let curr, last;
let height = 15;

const attrs = {x: 0, height: 15, width: 200, stroke: '#262626', 'stroke-width': 0.125};

let all = false;

resize = (h) => {
  let rects = $('#path')[0].children;
  let change = height - h;
  y = 0;

  for (r of rects) {
    r.setAttribute('height', h);
    r.setAttribute('y', y);
    y += h;
    $('#path').attr('height', y);
  }
  height = h;
}

show = (x) => {
  if (x) {
    // remove svg, append fresh onoe
    $('#path').remove();
    $('#box').append('<svg id="path"></svg>');
    all = !all;
  }

  // reset y coord
  y = 0;
  // update height
  attrs['height'] = height;
  // reset last
  last = '';

  for (app of apps) {
    curr = app;
      if (curr != last) {
        // create new SVG rect
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        // set attributes from dict
        for (const attr in attrs) { rect.setAttribute(attr, attrs[attr]) }
        // manually set Y, Fill, class
        rect.setAttribute('y', y);
        rect.setAttribute('fill', colors[curr.replace(/\W/g, '')]);
        rect.setAttribute('class', curr);
        // append to SVG
        $('#path').append(rect);
        y += height;
        // extend SVG height
        $('#path').attr('height', y);
        // to show some, set last to curr
        last = (all) ? '' : curr;
      }
    }

  $('rect').mouseenter(function() {
    $(this).css({'stroke': 'white', 'stroke-width': 2.5});
    $('#app').text($(this)[0].attributes['class'].value);
  }).mouseout(function(){
    $(this).css({'stroke': '#262626', 'stroke-width': 0.125});
    $('#app').text('');
  })

}
