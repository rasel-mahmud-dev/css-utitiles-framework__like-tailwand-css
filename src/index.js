const postCss = require("postcss")
const { writeFile, readFile } = require("fs/promises")
const {myPlugin} = require("./lib/index");
const path = require("path");
const chalk = require("chalk");
const postcss = require("postcss");
const fs = require("fs");
const ruleSort = require("./util/ruleSort");


let css = postcss.parse(fs.readFileSync(`${__dirname}/preflight.css`, 'utf8'))
function run(css) {
  let output = postCss([
    myPlugin(),
    ruleSort,
    require('postcss-prettify')
  ]) .process(css)

  writeFile(path.join(__dirname, "..", "./dist/index.css"), output.toString()).then( (_) => {
    console.info(chalk.bold.blue("utilities css file rebuild..."))
  }).catch(err => {
    console.error( chalk.bold.red(err.message))
  })
  
}

run(css)