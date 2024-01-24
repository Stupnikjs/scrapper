import puppeteer from "puppeteer"
import fs from 'fs'


let pharmaUrl = "https://www.pharmacie-cap3000.com/11-medicaments"

async function pharma3000(url){

    const browser = await puppeteer.launch({
        //executablePath: '/usr/bin/chromium-browser', 
        headless: true,
      })
  
   let page = await browser.newPage(); 

   await page.goto(url)
   // let paginator = await page.$$('li.ajax_block_product.col-xs-6.col-sm-4.col-md-4 slide-list')

   await oneScrappingProcess(page)
/*
   let urls = [] 
   let finalResult = []
   for (let i = 1; i < paginator.length; i++){
            
         urls.push(await paginator[i]?.evaluate(el => el.href))
            
        }
    
    for (let url of urls){

    await page.goto(url)
    let result = await oneScrappingProcess(page);
    finalResult = finalResult.concat(result, finalResult)
    }  

   let resultJson = JSON.stringify(finalResult)
   let jsonFileName = new Date().getTime() + 'races.json'
   fs.writeFileSync(jsonFileName, resultJson)
   */
   browser.close() 
}



async function oneScrappingProcess(page){
    let result  = []
    let html = await page.waitForSelector('html')
    let panelElements = await html.$$('li.ajax_block_product.col-xs-6.col-sm-4.col-md-4.slide-list')
    
  
    for ( let element of panelElements){
        
        await processElement(element)
        
    }
    // return result
    
}


async function processElement(element){
    
    try{
        let pharmaObj = {}
        let pre = await element.waitForSelector('pre')

        let bstext = await pre.evaluate(el => el.textContent)
        let index = bstext.indexOf('["cip13"]')
        let cip13 = bstext.substring(index - 17, index - 3)
        console.log(cip13)
        
        
        
    } catch (error){
        console.error(error)
    }
    



}


await pharma3000(pharmaUrl)
process.exit()



