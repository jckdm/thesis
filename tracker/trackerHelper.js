var fs = filename.split('-');

$('#title').text(fs[0]);

var w = parseInt(fs[1]);
var h = parseInt(fs[2]);

var padding = 30;
var apps = [];
var uniqueApps = [];
var coords = [];
var dates = [];
var times = [];
var color = {};
var timeFlag = false;
var lineFlag = false;
var c = 0;

var scheme = ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)',
'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)', 'rgb(179,222,105)',
'rgb(252,205,229)', 'rgb(217,217,217)', 'rgb(188,128,189)', 'rgb(204,235,197)',
'rgb(255,237,111)', 'rgb(115, 125, 225)', 'rgb(105, 150, 140)', 'rgb(70, 180, 70)',
'rgb(50,204,165)', 'rgb(215,85,85)'];

function getR(min, max) { return Math.floor(Math.random() * max + min); }
function colorize() { return 'rgb(' + getR(25, 230) + ',' + getR(25, 230) + ',' + getR(25, 230) + ')'; }

d3.select('input')
  .on('input', function() {
      var radius = +d3.select(this).node().value;
      d3.selectAll('circle')
        .attr('r', radius);
      $('#rad').text('r = ' + radius);
});

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function filters(id) {
  swap(id, id, document.getElementById(id), false);
  if (id == 'timesort') { timeFlag = (timeFlag == false) ? true : false; }
  else if (id == 'linesort') { lineFlag = (lineFlag == false) ? true : false; }
}

function swap(id, cId, e, flag) {
  var c = (flag) ? color[cId] : 'black';

  if (e.style.color == 'white') {
    if (e.className == 'filter') { c = 'white'; }
    e.style.backgroundColor = c;
    e.style.color = 'black';
  }
  else {
    if (e.className == 'filter') { c = 'black'; }
    e.style.backgroundColor = c;
    e.style.color = 'white';
  }
}

async function query(id) {
  var e = document.getElementById(id);

  if (e.className != 'filter' || id == 'invert') {
    var cId = id.replace(/\W/g, '');

    if (id == 'invert') {
      for (var i = 1; i < e.parentElement.length; i++) {
        query(e.parentElement[i].id);
      }
      swap(id, cId, e, false);
    }

    else if (e.style.color == 'white') {
      swap(id, cId, e, true);

      if (timeFlag) {
        var circles = $('circle.' + cId);
        var num = circles.length;

        for (var i = 0; i < num - 1; i++) {
          circles[i].style.fill = color[cId];

          if (lineFlag) {
            var gL = d3.select('svg').append('g').attr('id','L');
            gL.append('line')
              .style('stroke', color[cId])
              .style('stroke-width', 1)
              .attr('x1', parseFloat(circles[i].attributes.cx.value))
              .attr('y1', parseFloat(circles[i].attributes.cy.value))
              .attr('x2', parseFloat(circles[i+1].attributes.cx.value))
              .attr('y2', parseFloat(circles[i+1].attributes.cy.value));
          }

          await sleep(num / 1000);
        }
      }
      else {
        d3.selectAll('circle.' + cId)
          .attr('fill', function(d, i) { return color[cId]; })
          .attr('stroke', 'gray');
      }
    }
    else {
      swap(id, cId, e, false);
      d3.selectAll('circle.' + cId)
        .attr('fill', 'none')
        .attr('stroke', 'none');
    }
  }
}
