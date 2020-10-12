// get random int within range
getR = (min, max) => Math.floor(Math.random() * max + min)
// create RGB string

colorize => 'rgb(' + getR(25, 230) + ',' + getR(25, 230) + ',' + getR(25, 230) + ')'
