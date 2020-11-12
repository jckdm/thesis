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

let linelock = false;

// on resize, redraw rectangles but don't flip flag
$(window).resize(() => showcolor(0) );

resize = (h) => {
  // get all rectangles
  const rects = $('#path')[0].children;
  // calc change in height
  const change = height - h;
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
  $('#reader').html('');
  if (x) {
    // clear text
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
      const clean = curr.replace(/\W/g, '');
      // append next app
      $('#reader').append('<text class="' + clean + '" style="color:' + colors[clean] + ';">' + curr + ' <span>' + times[i] + '</span></text><br>');
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
  // attrs['width'] = newW;
  $('#path').attr('width', newW);
  // reset last
  last = '';

  for (app of apps) {
    curr = app;
      if (curr != last) {
        // create new SVG rect
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        // set attributes from dict
        for (const attr in attrs) { rect.setAttribute(attr, attrs[attr]) }
        const cleaned = curr.replace(/\W/g, '');
        // manually set Y, Fill, class
        rect.setAttribute('y', y);
        rect.setAttribute('fill', colors[cleaned]);
        rect.setAttribute('class', cleaned);
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
      .on('click', () => {
        linelock = !linelock;
      })
      .on('mouseover', function() {
        if (!linelock) {
          // border on hover
          $(this).css({'stroke': 'white', 'stroke-width': 2.5});

          // show text for that app
          const cl = $(this)[0].attributes['class'].value;

          // get positions
          const att = $(this)[0].attributes;
          const xPos = +att.x.value + +att.width.value + 2.5;
          const yPos = +att.y.value + (+att.height.value / 2.0);
          const eles = $('text.' + cl);
          const rOff = $('#reader').offset().top;
          // make svg for lines
          const gL = d3.select('body')
                       .append('svg')
                       .attr('id', 'lines')
                       .attr('width', '100%')
                       .attr('height', $(document).height())

          $('#reader').text('');

          // for each text element
          for (ele of eles) {

            $('#reader').append(ele);
            $('#reader').append('<br>');

            // get position
            const top = $(ele).offset().top + (window.screenY / 2.0) - rOff;
            const left = $(ele).offset().left - 7.5;

            // draw line
            gL.append('line')
              .style('stroke', 'gray')
              .style('stroke-width', 1)
              .attr('x1', xPos)
              .attr('y1', yPos)
              .attr('x2', left)
              .attr('y2', top);
          }
        }
      })
      .on('mouseout', function() {
        if (!linelock) {
          showtext(false);
          // reset styles
          $(this).css({'stroke': '#262626', 'stroke-width': 0.125});
          $('#lines').remove();
        }
      })
}
