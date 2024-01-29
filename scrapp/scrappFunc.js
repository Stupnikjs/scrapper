import puppeteer from "puppeteer"
import fs from "fs" 

/*

let params = {
    container = '', 
    card = '', 
    urls = [], 
    extractCard = function(){}
    }
    fileName = ''
*/
console.log("Start of scrapping func")
const start = new Date().getTime()
const scrapperFunction = async(params) => {
    
    async function oneScrappingProcess(page){
        let result  = []
        let html = await page.waitForSelector('html')
        let panelElements = await html.$$(params.card)
         
        for ( let element of panelElements){
              let returnObj = await params.extractCard(element, params)
              result.push(returnObj)
        }
        return result
        
    }
     
   let result = []
   const browser = await puppeteer.launch({
        //executablePath: '/usr/bin/chromium-browser', 
        headless: true,
      })
  
   let page = await browser.newPage(); 

   for ( let url of params.urls){
        
        await page.goto(url)
        let oneProcessResult = await oneScrappingProcess(page)
        console.log(oneProcessResult)
        result = result.concat(oneProcessResult)
   }
   
   

    
    let resultJson = JSON.stringify(result)
    let jsonFileName = params.fileName
    fs.writeFileSync(jsonFileName, resultJson)

    browser.close()
    const end = new Date().getTime()

    console.log((end - start) / 1000, " second to execute the program")
    process.exit()
    }



export { scrapperFunction }