choice = (s) => window.open('img/tracer/' + s[0].parentNode.firstChild.data.trim().split(' ').join('') + '-' + s[0].innerText + '.svg', '_blank');

map = (s) => window.open("mapper.html?file=" + s[0].parentNode.firstChild.data.trim() + '.csv', '_blank');

read = (s) => window.open("reader.html?file=" + s[0].parentNode.firstChild.data.trim() + s[0].innerText.toLowerCase() + '-.csv', '_blank');
