// get random int within range
getR = (min, max) => Math.floor(Math.random() * max + min)
// create RGB string

function colorize() { return 'rgb(' + getR(25, 230) + ',' + getR(25, 230) + ',' + getR(25, 230) + ')'; }
