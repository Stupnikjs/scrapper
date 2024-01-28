import {scrapperFunction} from "./scrappFunc.js"
import puppeteer from "puppeteer";

let pharmaUrl = "https://mapharma.fr/12-medicaments"

async function getUrls(){
    let urls = []
    const browser = await puppeteer.launch({
        //executablePath: '/usr/bin/chromium-browser', 
        headless: true,
      })
  
   let page = await browser.newPage(); 
   page.goto(pharmaUrl)
   let pagination = await page.waitForSelector('.pagination')
   let links = await pagination.$$('li > a ')
   let maxlink = 2
   for ( let link of links){
    let vallink = parseInt(await link.evaluate(e => e.textContent))
    if ( vallink && vallink > maxlink) maxlink = vallink
   }

   for (let i = 0 ; i < maxlink; i++){
    urls.push(`https://mapharma.fr/12-medicaments?page=${i}`)
   }

    return [pharmaUrl].concat(urls) 
}

   async function extractCard(element){
    
    try{
        let pharmaObj = {}


        let link = await element.waitForSelector('h3 > a')
        let linkText = await link.evaluate(el => el.href)
        let linkHtml = await link.evaluate(el => el.textContent ) 
        pharmaObj['cip13'] = linkText.substring(linkText.length - 18, linkText.length - 5)
        pharmaObj['name'] = linkHtml
        
        
        return pharmaObj
     
    } catch (error){
        console.error(error)
    }
    



}



let fileName = new Date().getTime() + 'pharma.json'


let params = {
    container : "",
    card: '.col-md-6.col-lg-4.productlistos.medos',
    urls: await getUrls(),
    extractCard: extractCard,
    fileName: fileName
}



await scrapperFunction(params)
