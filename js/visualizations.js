viz = (s) => {
  // if regular link, go ahead
  if (s[0].parentElement.cells[0].attributes.id.value == 'reg') {
    window.open(s[0].innerText.toLowerCase() + '.html?file=' + s[0].parentElement.cells[0].innerText + '.csv', '_blank');
  }
  // if custom, add objectURL to end
  else { window.open(s[0].innerText.toLowerCase() + '.html?file=' + s[0].parentElement.cells[0].innerText + '.csv=' + objectURL, '_blank'); }
}
choice = (s) => window.open('data/tracer/' + s[0].parentElement.cells[0].innerText.split(' ').join('') + '-' + s[0].innerText + '.svg', '_blank');

let objectURL;

custom = () => {
  // get file from html
  const file = $('#customfile')[0];
  // get filename from that object
  const fileName = file.files[0].name;
  // if not csv, alert users
  if (fileName.slice(-4) != '.csv' && fileName.split('-').length != 4) { alert('Please upload a .csv file created by the Tracker.'); }
  // otherwise, append new row to table
  else {
    $('#tracktab').append('<tr> <td id="custom" class="vis">' + fileName.slice(0,-4) + '</td> <td class="vizType">Grapher</td> <td class="vizType">Mapper</td> <td class="vizType">Reader</td></tr>');
  }
  // either way, clear the form lazily
  $('#customform').html('<input type="file" id="customfile"><button onclick="custom()">Upload</button> &nbsp; &nbsp; &nbsp; <span class="howto" id="custom">?</span>');
  // create object from URL
  objectURL = window.URL.createObjectURL(file.files[0]);
  // re-add click fns (for new one)
  $('.vizType').on('click', function() { viz($(this)); });
}

$(() => {
  // prepend ? headings
  $('#tracktab').prepend('<tr> <th></th> <th class="howto" id="grapher">?</th> <th class="howto" id="mapper">?</th> <th class="howto" id="reader">?</th> </tr>');
  $('#tracetab').prepend('<tr> <th></th> <th class="howto" id="unsorted">?</th> <th class="howto" id="sorted">?</th> <th class="howto" id="overlaid">?</th> </tr>');

  // get all tracker viz rows
  const trt = $('#tracktab').children()[0].children;

  // append viz types for each tracker viz
  for (let i = 1; i < trt.length; i++) {
    $(trt[i]).append('<td class="vizType">Grapher</td> <td class="vizType">Mapper</td> <td class="vizType">Reader</td>');
  }

  // get all tracer viz rows
  const tat = $('#tracetab').children()[0].children;

  // append viz types for each tracer viz
  for (let i = 1; i < tat.length; i++) {
    $(tat[i]).append('<td class="img">Unsorted</td> <td class="img">Sorted</td> <td class="img">Overlaid</td>');
  }

  // add onclick functions to each button
  $('.vizType').on('click', function() { viz($(this)); });
  $('.img').on('click', function() { choice($(this)); });

  // default white on black button (on)
  const button = '<button type="button" style="background-color: black; color: white;">';

  // dict of info for tooltips
  const tools = {
    custom: '<span>Navigate to GitHub @ jckdm/tracker to download the data tracking tool and upload your .csv file here to view your visualizations.</span>',
    grapher: '<span>Grapher allows segmentation and animation of a user\'s movement in and between applications.<br><br>Click each application ' + button + 'Microsoft Word</button> &nbsp; to toggle its visibility.<br><br>Click &nbsp; ' + button + 'Time</button> &nbsp; to toggle animation.<br><br>Click &nbsp; ' + button + 'Lines</button> &nbsp; to toggle the connectedness of animated points.<br><br>Hover on a point &nbsp; <svg width="10" height="10"><circle r="5" cx="5" cy="5" stroke="gray" fill="#D3D3D3"></rect></svg> &nbsp; to reveal its corresponding application.</span>',
    mapper: '<span>Mapper generalizes a user\'s screen into quadrants in order to produce a textured map.<br><br>Click &nbsp; ' + button + 'Hide 0</button> &nbsp; to toggle visibility of quadrants with no recorded value.<br><br>Click &nbsp; ' + button + 'Color by most used app</button> &nbsp; to toggle between a logarithmic gray-scale and a winner-takes-all colored scale.<br><br>Hover on a quadrant &nbsp; <svg width="15" height="15"><rect height="15" width="15" stroke="#262626" fill="#D3D3D3"></rect></svg> &nbsp; to view its breakdown of applications and spans.</span>',
    reader: '<span>Reader highlights inflection points when a user changes between applications.<br><br>Click &nbsp; ' + button + 'Show all text</button> &nbsp; or &nbsp; ' + button + 'Show all color</button> &nbsp; to toggle visibility of intermediate datapoints.<br><br>Click &nbsp; ' + button + 'Analyze data</button> &nbsp; to toggle visibility of an analysis report and to reveal a vertical bar alongside the user\'s longest period of continuous switching between two applications.<br><br> Hover on a rectangle &nbsp; <svg width="55" height="15"><rect height="15" width="55" stroke="#262626" fill="#D3D3D3"></rect></svg> &nbsp; to view connections to corresponding instances of the application. Click to lock and unlock connections.</span>',
    unsorted: '<span>Unsorted paths &nbsp; <svg width="40" height="2.5"><rect height="2.5" width="40" fill="#3CB371"></rect></svg> &nbsp; are drawn in the order which the rendering program read the image files—these paths are unpredictable in shape and difficult to trace.</span>',
    sorted: '<span>Sorted paths &nbsp; <svg width="40" height="2.5"><rect height="2.5" width="40" fill="#6666FF"></rect></svg> &nbsp; are rendered in the order which the images were taken, resulting in traceable, logical paths.</span>',
    overlaid: '<span>Overlaid paths combine both unsorted &nbsp; <svg width="40" height="2.5"><rect height="2.5" width="40" fill="#3CB371"></rect></svg> &nbsp; and sorted &nbsp; <svg width="40" height="2.5"><rect height="2.5" width="40" fill="#6666FF"></rect></svg> &nbsp; paths of the same image sets.</span>'
  };

  // on tooltip hover
  $('.howto').on('mouseover', function() {
    // add text for given viz
    $('#info').append(tools[this.id]);
    const left = $('#' + this.id)[0].offsetLeft;
    const ow = $('#tooltip')[0].offsetWidth;

    // show tooltip
    const tool = d3.select('#tooltip')
      .style('visibility', 'visible')
      .style('left', () => (left + ow < $(document).width()) ? left + 75 + 'px' : left - ow + 'px')
      .style('top', () => ($(document).height() - event.pageY < 200) ? event.pageY - 150 + 'px' : event.pageY + 'px' )
  });

  // stupid mobile fix: tooltip appears even without hover, so on "hover" it'll close, too, without a close btn
  $('#tooltip').on('mouseover', () => {
    // remove text
    $('#info').html('');
    // hide tooltip
    d3.select('#tooltip')
      .style('visibility', 'hidden')
  });

  // hide tooltip on mouseout
  $('.howto').on('mouseout', () => {
    // remove text
    $('#info').html('');
    // hide tooltip
    d3.select('#tooltip')
      .style('visibility', 'hidden')
  });
});
