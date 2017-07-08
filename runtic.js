'use strict';

const
  uglifyJS = require('uglify-js'),
  stripJsonComments = require('strip-json-comments'),
  fs = require('fs'),
  child_process = require('child_process');
const
  config = JSON.parse(stripJsonComments(fs.readFileSync('config.json', 'utf8'))),
  tsconfig = JSON.parse(stripJsonComments(fs.readFileSync('tsconfig.json', 'utf8'))),
  cGame = config['game'],
  cTic = config['tic'],
  cCompress = config['compression'];

const
  buildStr = fs.readFileSync(tsconfig['compilerOptions']['outFile'], 'utf8'),
  result = uglifyJS.minify(buildStr, {
    compress: false,
    mangle: false,
    output: {
      beautify: true,
      indent_level: cCompress['indentLevel'],
      comments: cCompress['keepComments'],
      preamble: cCompress['keepComments'] ? '' :`// author: ${cGame['author']}\n// desc: ${cGame['desc']}\n// script: js\n`
    }
  });


fs.writeFileSync(cCompress['compressedFile'], result.code);

const cmd = `"${cTic['ticPath']}" "${cTic['cartsPath']}/${cGame['cart']}" -code ${cCompress['compressedFile']}`;
console.log(`Launch TIC: ${cmd}`);

child_process.exec(cmd, function (error, stdout, stderr) {
  console.log(stdout);
  console.log(stderr);
})


