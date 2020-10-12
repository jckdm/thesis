choice = (s) => { let f = s[0].parentNode.firstChild.data.trim().split(' ').join('') + '-' + s[0].innerText + '.jpg' }

map = (s) => { window.location.href = "mapper.html?file=" + s[0].parentNode.firstChild.data.trim() + '.csv' }

read = (s) => { window.location.href = "reader.html?file=" + s[0].parentNode.firstChild.data.trim() + s[0].innerText.toLowerCase() + '-.csv' }
