// get filename from URL
const filename = 'data/' + window.location.href.split('=')[1];

const fs = filename.split('-');

const w = parseInt(fs[1]);
const h = parseInt(fs[2]);

const scheme = ['rgb(141,200,199)', 'rgb(255,255,179)', 'rgb(190,186,218)',
'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)', 'rgb(179,222,105)',
'rgb(252,205,229)', 'rgb(217,217,217)', 'rgb(188,128,189)', 'rgb(204,235,197)',
'rgb(255,237,111)', 'rgb(115, 125, 225)', 'rgb(105, 150, 140)', 'rgb(70, 180, 70)',
'rgb(50,225,165)', 'rgb(215,85,85)'];

// get random int within range
getR = (min, max) => Math.floor(Math.random() * max + min)
// create RGB string
colorize = () => 'rgb(' + getR(25, 230) + ',' + getR(25, 230) + ',' + getR(25, 230) + ')'
// pause for ms millseconds
sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
