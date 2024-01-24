import puppeteer from "puppeteer"
import fs from 'fs'


let pharmaUrl = "https://www.pharmacie-cap3000.com/11-medicaments"

async function pharma3000(url){

    const browser = await puppeteer.launch({
        //executablePath: '/usr/bin/chromium-browser', 
        headless: "new",
      })
  
   let page = await browser.newPage(); 

   await page.goto(url)
   let paginator = await page.$$('.pagination > li ')
   paginator.pop()
   let anteLast = paginator.pop()

   let totalPages = await anteLast.evaluate(el => el.textContent)

   await oneScrappingProcess(page)

   let urls = [] 
   let finalResult = []
   for (let i = 2; i < totalPages - 1; i++){
        let url_to = `https://www.pharmacie-cap3000.com/11-medicaments#/page-${i}`
        await page.goto(url_to)   
        let result = await oneScrappingProcess(page);
        finalResult = finalResult.concat(result, finalResult)    
        }

   let resultJson = JSON.stringify(finalResult)
   let jsonFileName = new Date().getTime() + 'races.json'
   fs.writeFileSync(jsonFileName, resultJson)
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
        let index_cip13 = bstext.indexOf('string(13)')
        let cip13 = bstext.substring(index_cip13 + 12 , index_cip13 + 25)
        pharmaObj['cip13'] = cip13

        let index_cip7 = bstext.indexOf('string(7)')
        let cip7 = bstext.substring(index_cip7 + 11 , index_cip7 + 18)
        pharmaObj['cip7'] = cip7

        let index_update = bstext.indexOf('string(19)')
        let update = bstext.substring(index_update + 12 , index_update + 25)
        pharmaObj['update'] = update

        let title = await element.waitForSelector(' .prod-info > .prod-title')

        pharmaObj['name'] = await title.evaluate(el => el.textContent)


        console.log(pharmaObj)
        

        
        
        
    } catch (error){
        console.error(error)
    }
    



}


await pharma3000(pharmaUrl)
process.exit()



