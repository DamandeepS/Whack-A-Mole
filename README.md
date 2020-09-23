# WhackAMole
A simple Quick Reaction Game



### Uses NPM and GULP

Make sure you have NodeJS, NPM and then GULP CLI installed.


### Getting Started

 - run `npm install` to install node dependencies
 - to build, run `npm run build`, you will get your transpiled code in `dist` directory
 - to start a local server with browser sync, use `npm run develop`
 - for Production ready code, use `npm run build:prod`
    - Note: there'll be 2 variations for each JS file in `dist` when using Production Build 
       - `-debug.js` - these are uncompressed, unminified JS files.
       - `.js` - these are compressed and minified files.
 
This project uses AVA for unit testing
 - Use `npm run test`, to start testing
    - this will test all the `*.test.js` files inside `app`


Working directory `app`
Output directory `dist`


This project uses Bablify to enable ES6(without imports), transpiles into ES5 for old browsers.
