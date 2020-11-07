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

// on resize, redraw rectangles but don't flip flag
$(window).resize(() => showcolor(0) );

resize = (h) => {
  // get all rectangles
  let rects = $('#path')[0].children;
  // calc change in height
  let change = height - h;
  // reset y to top
  y = 0;

  // change height and y for each rect
  for (r of rects) {
    r.setAttribute('height', h);
    r.setAttribute('y', y);
    y += h;
    $('#path').attr('height', y);
  }
  // update at end
  height = h;
}

showtext = (x) => {
  if (x) {
    // clear text
    $('#reader').html('');
    alltext = !alltext;
  }

  // style button
  const b = $('#showtext')[0].style;
  b.color = (alltext) ? 'black' : 'white';
  b.backgroundColor = (alltext) ? 'white' : 'black';

  last = '';

  for (let i = 0; i < apps.length; i++) {
    curr = apps[i];
    // if app switched
    if (curr != last) {
      // append next app
      $('#reader').append('<text style="color:' + colors[curr.replace(/\W/g, '')] + ';">' + curr + ' <span>' + times[i] + '</span></text><br>');
      last = (alltext) ? '' : curr;
    }
  }
}

showcolor = (x) => {
  if (x || x == 0) {
    // remove svg, append fresh onoe
    $('#path').remove();
    $('#box').append('<svg id="path"></svg>');
  }
  // only switch on click, not on resize
  if (x) { allcolor = !allcolor; }

  // style button
  const b = $('#showcolor')[0].style;
  b.color = (allcolor) ? 'black' : 'white';
  b.backgroundColor = (allcolor) ? 'white' : 'black';

  // reset y coord
  y = 0;
  // update height
  attrs['height'] = height;
  // scalable width
  const newW = $(window).width() / 2.5;
  attrs['width'] = newW;
  $('#path').attr('width', newW);
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

    // select all rects
    d3.selectAll('rect')
      .on('mouseover', function() {
        // border on hover
        $(this).css({'stroke': 'white', 'stroke-width': 2.5});
        // show and add class as text
        d3.select('#tooltip')
          .text($(this)[0].attributes['class'].value)
          .transition()
          .duration(100)
          .style('visibility', 'visible')
      })
      .on('mouseout', function() {
        $(this).css({'stroke': '#262626', 'stroke-width': 0.125});
        // hide tooltip
        d3.select('#tooltip')
          .transition()
          .duration(100)
          .style('visibility', 'hidden')
      })
      // update position on move
      .on('mousemove', () => {
        d3.select('#tooltip')
          .style('left', event.pageX + 30 + 'px')
          .style('top', event.pageY + 'px')
      })
}
