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

const scheme = ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)',
'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)', 'rgb(179,222,105)',
'rgb(252,205,229)', 'rgb(217,217,217)', 'rgb(188,128,189)', 'rgb(204,235,197)',
'rgb(255,237,111)', 'rgb(115, 125, 225)', 'rgb(105, 150, 140)', 'rgb(70, 180, 70)',
'rgb(50,204,165)', 'rgb(215,85,85)'];

// get random int within range
getR = (min, max) => Math.floor(Math.random() * max + min)
// create RGB string
colorize => 'rgb(' + getR(25, 230) + ',' + getR(25, 230) + ',' + getR(25, 230) + ')'
// pause for ms millseconds
sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
// change radius of all circles
rad = (r) => { d3.selectAll('circle').attr('r', +r); }

// manage Time and Lines buttons
filters = (id) => {
  swap(id, id, document.getElementById(id), false);
  // always flip value of Time
  if (id == 'timesort') { timeFlag = !timeFlag; }
  // Lines turns on Time, if both off
  else if (id == 'linesort') {
    if (!lineFlag && !timeFlag) { filters('timesort'); }
    lineFlag = !lineFlag;
  }
  else {
    const color = (axisFlag) ? '#1a1a1a' : 'white';
    $('.xaxis').css('color', color);
    $('.yaxis').css('color', color);
    axisFlag = !axisFlag;
  }
}

// switches buttons on/off
swap = (id, cId, b, flag) => {
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

    for (let i = 0; i < num; i++) {
      circles[i].style.visibility = 'visible';
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
  const e = document.getElementById(id);

  // invert or an app
  if (e.className != 'filter' || id == 'invert') {
    const cId = id.replace(/\W/g, '');

    // recurse on all apps
    if (id == 'invert') {
      const children = e.parentElement.parentElement.children;
      const len = children.length;
      for (let i = 1; i < len; i++) { query(children[i].id); }
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
