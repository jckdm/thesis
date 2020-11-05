viz = (s) => window.open(s[0].innerText.toLowerCase() + '.html?file=' + s[0].parentNode.firstChild.data.trim() + '.csv', '_blank');
choice = (s) => window.open('data/tracer/' + s[0].parentNode.firstChild.data.trim().split(' ').join('') + '-' + s[0].innerText + '.svg', '_blank');

$(() => {
  // get all content elements
  const c = $('#content')[0].children;
  let vizFlag = false;

  // loop over viz and images
  for (let i = 1; i < c.length - 1; i++) {
    const name = c[i].nodeName;

    // if at TRACER, switch to images
    if (name == 'TEXT') { vizFlag = true; }

    // if TRACKER
    else if (name == 'P' && !vizFlag) {
      c[i].innerHTML += ' &nbsp; &nbsp; <span class="viz">Grapher</span> &nbsp; &nbsp;<span class="viz">Mapper</span> &nbsp; &nbsp;<span class="viz">Reader</span>';
    }
    // if TRACER
    else if (name == 'P') {
      c[i].innerHTML += ' &nbsp; &nbsp; <span class="img">Unsorted</span> &nbsp; &nbsp;<span class="img">Sorted</span> &nbsp; &nbsp;<span class="img">Overlaid</span>';
    }
  }
  // add onclick functions to each
  $('.viz').on('click', function() { viz($(this)); });
  $('.img').on('click', function() { choice($(this)); });
});
