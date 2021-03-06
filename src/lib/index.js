const utilities = require("../plugins")
const config =  require("../../variable.config");
const postcss = require("postcss");

let storeCSS = new Map()

function forMedia(rule){
  let q = config.theme["screens"]
  for (const qKey in q) {
    let f = `.${qKey}\\:${rule.slice(1)}`
    if(storeCSS.get(qKey)) {
      storeCSS.set(qKey, storeCSS.get(qKey) +  f )
    } else {
      storeCSS.set(qKey, f)
    }
  }
}

function myPlugin (){

  return (root) => {
    generateRulesAll(root, forMedia)
    // expandApplyAtRules(root)
    // parseConfigToUtilities(root)


    setTimeout(()=>{
      // console.log(storeCSS)
    }, 100)


    // push mediaQuery...
    let mediaKeys = storeCSS.keys()
    for (const mediaKey of mediaKeys) {

      let mediaValue =  config.theme["screens"][mediaKey]
      let mediaQ = `@media screen and (min-width: ${mediaValue}){
      ${storeCSS.get(mediaKey)}
    }`
      root.append(mediaQ)
    }
  }
}


function theme(prop){
  if(typeof config.theme[prop] === "function"){
    return config.theme[prop](theme)
  } else {
    return config.theme[prop]
  }
}

function generateRulesAll(root, forMedia) {
  let result = ""
  let items = []
  for (let utilityKey in utilities) {
    items.push(utilities[utilityKey])
  }

  for (const item of items) {
    let c = item(forMedia)

    if(typeof c === "function"){
      let obj = c(theme)
      if(obj){
        let r = JSON.parse(obj)
        if(r.result){
          result+=r.result
        }
        if(r.hoverResult){
          result+=r.hoverResult
        }
      }
    } else {
      if(c){
        let r = JSON.parse(c)
        if(r.result){
          result+=r.result
        }
        if(r.hoverResult){
          result+=r.hoverResult
        }
      }
    }
  }

  root.append(postcss.parse(result))
}

function makeDefaultCss(preloadCss, root){
  root.append(preloadCss)
}



module.exports = { forMedia: forMedia, myPlugin: myPlugin }
