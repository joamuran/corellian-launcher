var Rsvg = require('rsvg').Rsvg;
var fs = require('fs');
//Var process=require('process')

var fileSVG=process.argv[2];
var filePNG=process.argv[3];
console.log(fileSVG);
console.log(filePNG)

// Create SVG render instance.
var svg = new Rsvg();

// When finishing reading SVG, render and save as PNG image.
svg.on('finish', function() {
  //console.log('SVG width: ' + svg.width);
  //console.log('SVG height: ' + svg.height);
  fs.writeFile(filePNG, svg.render({
    format: 'png',
    width: 128,
    height: 128
  }).data);
});

// Stream SVG file into render instance.
fs.createReadStream(fileSVG).pipe(svg);

// Source: https://github.com/walling/node-rsvg
// https://www.npmjs.com/package/librsvg
