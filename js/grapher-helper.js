const padding = 30;
const apps = [];
const uniqueApps = [];
const coords = [];
const dates = [];
const times = [];
const color = {};
let timeFlag = false;
let lineFlag = false;
let axisFlag = true;

// change radius of all circles
rad = (r) => { d3.selectAll('circle').attr('r', +r); }

// manage Time and Lines buttons
filters = (id) => {
  swap(id, id, $('#' + id)[0], false);
  // always flip value of Time
  if (id == 'timesort') { timeFlag = !timeFlag; }
  // Lines turns on Time, if both off
  else if (id == 'linesort') {
    if (!lineFlag && !timeFlag) { filters('timesort'); }
    lineFlag = !lineFlag;
  }
  else {
    $('.xaxis').css('color', (axisFlag) ? '#262626' : 'white');
    $('.yaxis').css('color', (axisFlag) ? '#262626' : 'white');
    axisFlag = !axisFlag;
  }
}

// switches buttons on/off
swap = (id, cId, b, flag) => {
  if (id != 'invert') {
    let c = (flag) ? color[cId] : 'black';

    // turn on
    if (b.style.color == 'white') {
      if (b.className == 'filter') { c = 'white'; }
      b.style.backgroundColor = c;
      b.style.color = 'black';
    }
    // turn off
    else {
      if (b.className == 'filter') { c = 'black'; }
      b.style.backgroundColor = c;
      b.style.color = 'white';
    }  
  }
}

// switches circles on/off
circleSwap = async (cId, on) => {
  // remove lines
  if (lineFlag || (Object.values(d3.selectAll('g.L' + cId))[0])[0].length == 1) {
    d3.selectAll('g.' + 'L' + cId).remove();
    $('#counter').text('');
  }

  const circles = $('circle.' + cId);

  // animate appending
  if (timeFlag && on) {
    // reset counter
    $('#counter').text('');
    const num = circles.length;

    for (c of circles) {
      c.style.visibility = 'visible';
      await sleep(Math.pow(0.75, Math.log(num) - 0.5));
    }
  }
  // turn off/on all at once
  else {
    if (!on) { $('#counter').text(''); }
    const v = (on) ? 'visible' : 'hidden';
    d3.selectAll(circles).style('visibility', v);
  }
}

query = async (id) => {
  const e = $('#' + id)[0];

  // invert or an app
  if (e.className != 'filter' || id == 'invert') {
    const cId = id.replace(/\W/g, '');

    // recurse on all apps
    if (id == 'invert') {
      const children = e.parentElement.parentElement.children;
      for (c of children) { query(c.id); }
      swap(id, cId, e, false);
    }

    // turn on
    else if (e.style.color == 'white') {
      swap(id, cId, e, true);

      if (timeFlag) {
        const circles = $('circle.' + cId);
        const num = circles.length;
        const counter = $('#counter');
        let gL;

        // append class for lines
        if (lineFlag) { gL = d3.select('svg').append('g').attr('class','L' + cId); }

        // reveal each circle
        for (let i = 0; i < num - 1; i++) {
          circles[i].style.visibility = 'visible';
          // update counter
          counter.text(i + '/' + (num - 1));

          if (lineFlag) {
            const curr = circles[i].attributes;
            const next = circles[i+1].attributes;

            gL.append('line')
              .style('stroke', color[cId])
              .style('stroke-width', 1)
              .attr('class', cId)
              .attr('x1', parseFloat(curr.cx.value))
              .attr('y1', parseFloat(curr.cy.value))
              .attr('x2', parseFloat(next.cx.value))
              .attr('y2', parseFloat(next.cy.value));
          }
          // special thanks to Harry Jain for designing this log function
          await sleep(Math.pow(0.75, Math.log(num) - 0.5));
        }
        // append last circle
        circles[num - 1].style.visibility = 'visible';
        counter.text((num - 1) + '/' + (num - 1));
      }
      // turn on w/o Time
      else { circleSwap(cId, true); }
    }
    // turn off
    else {
      swap(id, cId, e, false);
      circleSwap(cId, false);
    }
  }
}
