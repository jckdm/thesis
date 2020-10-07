const padding = 30;
let apps = [];
let uniqueApps = [];
let coords = [];
let dates = [];
let times = [];
let color = {};
let timeFlag = false;
let lineFlag = false;

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
// d3.select('input')
//   .on('input', () => {
//     let radius = +d3.select(this).node().value;
//     d3.selectAll('circle').attr('r', radius);
//     $('#rad').text('r = ' + radius);
//   }
// });

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
}

// switches buttons on/off
swap = (id, cId, b, flag) => {
  let c = (flag) ? color[cId] : 'black';

  // off -> on
  if (b.style.color == 'white') {
    if (b.className == 'filter') { c = 'white'; }
    b.style.backgroundColor = c;
    b.style.color = 'black';
  }
  // on -> off
  else {
    if (b.className == 'filter') { c = 'black'; }
    b.style.backgroundColor = c;
    b.style.color = 'white';
  }
}

// switches circles on/off
circleSwap = async (cId, on) => {
  // remove lines
  if (lineFlag) { d3.selectAll('g.' + 'L' + cId).remove(); }

  let circles = $('circle.' + cId);

  // animate appending
  if (timeFlag && on) {
    // reset counter
    $('#counter').text('');
    let num = circles.length;
    
    for (let i = 0; i < num; i++) {
      circles[i].style.visibility = 'visible';
      await sleep(Math.pow(0.75, Math.log(num) - 0.5));
    }
  }
  // turn off/on all at once
  else {
    let v = (on) ? 'visible' : 'hidden';
    d3.selectAll(circles).style('visibility', v);
  }
}

// background threads? webworker. returns promise immediately w callback
// during sleep, other calls can happen
// if never change, use let instead of let -- es lint style checker

query = async (id) => {
  let e = document.getElementById(id);

  if (e.className != 'filter' || id == 'invert') {
    let cId = id.replace(/\W/g, '');

    if (id == 'invert') {
      for (let i = 1; i < e.parentElement.length; i++) { query(e.parentElement[i].id); }
      swap(id, cId, e, false);
    }

    // off -> on
    else if (e.style.color == 'white') {
      swap(id, cId, e, true);

      if (timeFlag) {
        let circles = $('circle.' + cId);
        let num = circles.length;
        let counter = $('#counter');

        for (let i = 0; i < num - 1; i++) {
          circles[i].style.visibility = 'visible';
          counter.text(i + '/' + (num - 1));

          if (lineFlag) {
            let gL = d3.select('svg').append('g').attr('class','L' + cId);

            let curr = circles[i].attributes;
            let next = circles[i+1].attributes;

            // being consisetnt with style or attributes

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
      // turn on w/o time
      else { circleSwap(cId, true); }
    }
    // on -> off
    else {
      swap(id, cId, e, false);
      circleSwap(cId, false);
    }
  }
}
