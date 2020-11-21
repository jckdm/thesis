const apps = [];
const times = [];
const colors = {};
const patterns = {};

let y = 0;
let c = 0;
let curr, last;
let height = 15;
let selected;
let longestApp = '';

const attrs = {x: 20, height: 15, stroke: '#262626', 'stroke-width': 0.125};

let allcolor = false;
let alltext = false;
let linelock = false;

clean = (t) => {
  // reset styles for selected / this rect
  $(t).css({'stroke': '#262626', 'stroke-width': 0.125});
  $('#lines').remove();
  linelock = false;
  showtext(false);
}

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
  $('#apps').html('');
  $('#times').html('');
  // clear text
  if (x) { alltext = !alltext; }

  if (d3.selectAll('line')['_groups'][0].length > 1) { clean(selected); }

  // style button
  $('#showtext').css({'color': (alltext) ? 'black' : 'white', 'background-color': (alltext) ? 'white' : 'black'});

  last = '';

  for (let i = 0; i < apps.length; i++) {
    curr = apps[i];
    // if app switched
    if (curr != last) {
      // if not first app (last is null)
      if (i != 0) {
        const p = [last, curr].join('-');
        patterns[p] = (patterns[p]) ? patterns[p] + 1 : 1;
      }
      const clean = curr.replace(/\W/g, '');
      // append next app
      $('#apps').append('<text class="' + clean + '" style="color:' + colors[clean] + ';">' + curr + ' </text><br>');
      $('#times').append('<text class="' + clean + '"> ' + times[i] + '</text><br>')
      last = (alltext) ? '' : curr;
    }
  }
}

analyze = () => {
  // style button
  $('#analyze').css({'color': 'black', 'background-color': 'white'});

  // get all apps and times in respective divs
  const aps = $('#apps')[0].childNodes;
  const tms = $('#times')[0].childNodes;

  const pCounts = {};
  const pTimes = {};
  let one = false;
  let two = false;
  let first = false;
  let longest = 0;
  let longest_yet = 0;
  let i = 0;
  // account for <br>s
  const len = (aps.length / 2) - 1;
  let end, start;
  let selStart, selEnd;

  // sort DESC patterns by total occurrences of each app.
  const items = (Object.keys(patterns).map((key) => [key, patterns[key]])).sort((f, s) => s[1] - f[1]);

  // for each pattern
  for (item of items) {
    const ele = item[0];
    // only check pattern if has more occurrences than longest seen pattern
    if (patterns[ele] > longest_yet) {
      // pattern is [A,B]
      const pattern = ele.split('-');
      pCounts[ele] = 0;
      longest = 0;
      i = 0;
      one = false;
      two = false;
      // for each text element on the page, skip over <br>
      for (let j = 0; j < aps.length; j+=2) {
        const time = tms[j];
        const ap = aps[j].innerText;
        // if app not in pattern (pattern has ended?)
        if (ap != pattern[0] && ap != pattern[1]) {
          // if this pattern is longer than prev
          if (longest > pCounts[ele]) {
            // record length, start and end times
            pCounts[ele] = longest;
            longest_yet = Math.max(longest, longest_yet);
            pTimes[ele + '-start'] = [start.innerText, selStart];
            pTimes[ele + '-end'] = [end.innerText, $(time)];
            first = true;
          }
          // otherwise, start over on the next iteration
          longest = 0;
          first = false;
          one = false;
          two = false;
          i++;
          continue;
        }
        // if curr & prev match pattern
        if (one && two) {
          longest += 1;
          one = false;
          two = false;
          end = time;
          // gia's case: longest path goes up until end of dataset. i love you gia and i hate your data.
          if (i == len) {
            pCounts[ele] = longest;
            longest_yet = Math.max(longest, longest_yet);
            pTimes[ele + '-start'] = [start.innerText, selStart];
            pTimes[ele + '-end'] = [end.innerText, $(time)];
            first = true;
          }
        }
        // if first already matched
        if (one) {
          // check the second
          if (ap == pattern[1]) { two = true; }
          else { one = false; two = false; first = false; }
        }
        // check if curr matches pattern
        if (ap == pattern[0]) {

          one = true;
          // if first app of pattern, record time
          if (!first) {
            // start time
            start = time;
            // starting element on page
            selStart = $(time);
            first = true;
          }
        }
        i++;
      }
    }
  }
  // get largest value from path dict, and start & end times
  const key = Object.keys(pCounts).reduce((a, b) => (pCounts[a] > pCounts[b]) ? a : b);

  selStart = $(pTimes[key + '-start'][1][0]);
  selEnd = $(pTimes[key + '-end'][1][0]);

  $('#longline').css({'height': $(document).height(), 'width': '50%'});

  const x = $('#reader')[0].clientWidth + $('#reader')[0].offsetLeft + 7.5;

  // draw line
  d3.select('#longline')
    .append('line')
    .style('stroke', '#FFFFFF')
    .style('stroke-width', 15)
    .attr('x1', x)
    .attr('y1', selStart.position().top - 5)
    .attr('x2', x)
    .attr('y2', selEnd.position().top);

  // split pattern & times, calculate span
  const ss = pTimes[key + '-start'][0];
  const ee = pTimes[key + '-end'][0];
  pattern = key.split('-');
  start = ss.split(':');
  end = ee.split(':');
  const patSpan = (end[0] * 60 - start[0] * 60) + (end[1] - start[1]) + ((end[2] - start[2]) / 60);

  // calculate overall span times
  const startTime = times[0].split(':');
  const endTime = times[times.length - 1].split(':');
  const span = (endTime[0] * 60 - startTime[0] * 60) + (endTime[1] - startTime[1]) + ((endTime[2] - startTime[2]) / 60);

  // get user from filename
  const user = filename.split('-')[0].split('/')[1];

  // show modal
  $('.data-overlay').css('visibility', 'visible');

  // add content
  $('.data-overlay-content').html('<span id="close">&times;</span><br><p>'
  + user + ' used <span class="data">' + c + '</span> apps over <span class="data">'
  + span.toFixed(2) + '</span> minutes from <span class="data">' + times[0]
  + '</span> – <span class="data">' + times[times.length - 1]
  + '</span>.</p> <br> <br> <p>During that interval, ' + user
  + ' switched between apps <span class="data">' + (len + 1)
  + '</span> times, spending an average of <span class="data">' + (span / (len + 1)).toFixed(2)
  + '</span> minutes in each app.</p> <br> <br> <p>'
  + user + '\'s longest period of continuous switching was between <span class="data">' + pattern[0]
  + '</span> and <span class="data">' + pattern[1] + '</span>, comprising <span class="data">'
  + pCounts[key] + '</span> switches over <span class="data">'
  + patSpan.toFixed(2) + '</span> minutes from <span class="data">' + ss
  + '</span> – <span class="data">' + ee + '</span>.</p>');

  // close on click
  $('#close').on('click', () => {
    $('.data-overlay').css('visibility', 'hidden');
    $('#analyze').css({'color': 'white', 'background-color': 'black'});
  })
}

showcolor = (x) => {
  if (x || x == 0) {
    // remove svg, append fresh onoe
    $('#path').remove();
    $('#box').append('<svg id="path"></svg>');
    $('#longline').html('');
  }
  // only switch on click, not on resize
  if (x) { allcolor = !allcolor; }

  if (d3.selectAll('line')['_groups'][0].length != 0) { clean(selected); }

  // style button
  $('#showcolor').css({'color': (allcolor) ? 'black' : 'white', 'background-color': (allcolor) ? 'white' : 'black'});

  // reset y coord
  y = 0;
  // update height
  attrs['height'] = height;
  // scalable width
  const newW = $(window).width() / 4;
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
        // manually set Y, width, fill, class
        rect.setAttribute('y', y);
        rect.setAttribute('width', newW);
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

    const readerWidth = $('#reader')[0].clientWidth;

    // select all rects
    d3.selectAll('rect')
      .on('click', function() {
        linelock = !linelock;
        if (linelock) { selected = this; }
        else { clean(selected); }
      })
      .on('mouseover', function() {
        if (!linelock) {
          // border on hover
          $(this).css({'stroke': 'white', 'stroke-width': 2.5});

          $('#longline').css('visibility', 'hidden');

          // show text for that app
          const cl = $(this)[0].attributes['class'].value;

          const yPos = +$(this)[0].attributes.y.value + (height / 2.0);

          const rOff = $('#reader').offset().top;
          // make svg for lines
          const gL = d3.select('body')
                       .append('svg')
                       .attr('id', 'lines')
                       .attr('width', '100%')
                       .attr('height', $(document).height())

          const cl_app = $('#apps > .' + cl);
          const cl_time = $('#times > .' + cl);

          $('#apps').text('');
          $('#times').text('');

          // for each text element
          for (let i = 0; i < cl_app.length; i++) {
            $('#apps').append(cl_app[i]);
            $('#apps').append('<br>');
            $('#times').append(cl_time[i]);
            $('#times').append('<br>');

            const ele = cl_time[i];

            // get position
            const top = $(ele).offset().top + (window.screenY / 2.0) - rOff;

            // draw line
            gL.append('line')
              .style('stroke', 'gray')
              .style('stroke-width', 1)
              .attr('x1', $('#path').offset().left + 5)
              .attr('y1', yPos)
              .attr('x2', readerWidth + 5)
              .attr('y2', top);
          }
          $('#apps').append('<text style="visibility: hidden">' + longestApp + '</text>');
        }
      })
      .on('mouseout', function() {
        if (!linelock) {
          $('#longline').css('visibility', 'visible');
          clean(this);
        }
      })
}
