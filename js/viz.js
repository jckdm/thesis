viz = (s) => window.open(s[0].innerText.toLowerCase() + '.html?file=' + s[0].parentElement.cells[0].innerText + '.csv', '_blank');
choice = (s) => window.open('data/tracer/' + s[0].parentElement.cells[0].innerText.split(' ').join('') + '-' + s[0].innerText + '.svg', '_blank');

$(() => {
  // prepend ? headings
  $('#tracktab').prepend('<tr> <th></th> <th class="howto" id="grapher">?</th> <th class="howto" id="mapper">?</th> <th class="howto" id="reader">?</th> </tr>');
  $('#tracetab').prepend('<tr> <th></th> <th class="howto" id="unsorted">?</th> <th class="howto" id="sorted">?</th> <th class="howto" id="overlaid">?</th> </tr>');

  // get all tracker viz rows
  const trt = $('#tracktab').children()[0].children;

  for (let i = 1; i < trt.length; i++) {
    $(trt[i]).append('<td class="vizType">Grapher</td> <td class="vizType">Mapper</td> <td class="vizType">Reader</td>');
  }

  // get all tracer viz rows
  const tat = $('#tracetab').children()[0].children;

  for (let i = 1; i < tat.length; i++) {
    $(tat[i]).append('<td class="img">Unsorted</td> <td class="img">Sorted</td> <td class="img">Overlaid</td>');
  }

  // add onclick functions to each
  $('.vizType').on('click', function() { viz($(this)); });
  $('.img').on('click', function() { choice($(this)); });

  const button = '<button type="button" style="background-color: black; color: white;">';

  // reader: hover over rect
  // mapper: hover over quad
  // grapher: hover over point

  const tools = {
    grapher: 'Grapher allows segmentation and animation of a user\'s movement in and between applications.<br><br>Click each application ' + button + 'Microsoft Word</button> &nbsp; to toggle its visibility.<br><br>Click &nbsp; ' + button + 'Time</button> &nbsp; to toggle animation.<br><br>Click &nbsp; ' + button + 'Lines</button> &nbsp; to toggle connectedness of animated points.',
    mapper: 'Mapper generalizes a user\'s screen into quadrants in order to produce a textured map.<br><br>Click &nbsp; ' + button + 'Hide 0</button> &nbsp; to toggle visibility of quadrants with no recorded value.<br><br>Click &nbsp; ' + button + 'Color by most used app</button> &nbsp; to toggle between a logarithmic gray-scale and a winner-takes-all colored scale.',
    reader: 'Reader highlights inflection points when a user changes between applications.<br><br>Click &nbsp; ' + button + 'Show all text</button> &nbsp; or &nbsp; ' + button + 'Show all color</button> &nbsp; to toggle visibility of intermediate datapoints.<br><br>Click &nbsp; ' + button + 'Analyze data</button> &nbsp; to toggle visibility of an analysis report and to reveal a vertical bar alongside the user\'s longest period of continuous switching between two applications.',
    unsorted: 'Unsorted paths are drawn in the order which the rendering program read the image files—these paths are unpredictable in shape and difficult to trace.',
    sorted: 'Sorted paths are rendered in the order which the images were taken, resulting in traceable, logical paths.',
    overlaid: 'Overlaid paths combine both unsorted and sorted paths of the same image sets.'
  };

  $('.howto').on('mouseover', function() {
    // add text for given viz
    $('#info').append(tools[this.id]);
    // show tooltip
    const tool = d3.select('#tooltip')
      .transition()
      .duration(100)
      .style('visibility', 'visible')
  })

  $('.howto').on('mouseout', () => {
    // remove text
    $('#info').html('');
    // hide tooltip
    d3.select('#tooltip')
      .transition()
      .duration(100)
      .style('visibility', 'hidden')
  })

  $('.howto').on('mousemove', () => {
    // if near bottom/right edge, move tooltip up/left
    d3.select('#tooltip')
      .style('left', () => ($(document).width() - event.pageX < 200) ? event.pageX - 150 + 'px' : event.pageX + 25 + 'px')
      .style('top', () => ($(document).height() - event.pageY < 200) ? event.pageY - 150 + 'px' : event.pageY + 'px' )
  })

});
