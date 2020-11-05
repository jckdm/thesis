const apps = [];
const times = [];
const colors = {};

let y = 0;
let c = 0;
let curr, last;
let height = 15;

const attrs = {x: 20, height: 15, width: 200, stroke: '#262626', 'stroke-width': 0.125};

let allcolor = false;
let alltext = false;

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

showtext = (x) => {
  if (x) {
    $('#reader').html('');
    alltext = !alltext;
  }

  last = '';

  for (let i = 0; i < apps.length; i++) {
    curr = apps[i];
    // if app switched
    if (curr != last) {
      $('#reader').append('<text style="color:' + colors[curr.replace(/\W/g, '')] + ';">' + curr + ' <span>' + times[i] + '</span></text><br>');
      last = (alltext) ? '' : curr;
    }
  }
}

showcolor = (x) => {
  if (x) {
    // remove svg, append fresh onoe
    $('#path').remove();
    $('#box').append('<svg id="path"></svg>');
    allcolor = !allcolor;
  }

  // reset y coord
  y = 0;
  // update height
  attrs['height'] = height;
  attrs['width'] = $(window).width() / 3.5;
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
        last = (allcolor) ? '' : curr;
      }
    }

  $('rect').mouseenter(function() {
    $(this).css({'stroke': 'white', 'stroke-width': 2.5});
    $('#app').text($(this)[0].attributes['class'].value);
  }).mouseout(function(){
    $(this).css({'stroke': '#262626', 'stroke-width': 0.125});
    $('#app').html('&nbsp;');
  })
}
