import {scrapperFunction} from "../scrappFunc.js"
import puppeteer from "puppeteer";

let immoUrl = "https://www.bienici.com/recherche/achat/france"

async function getUrls(){
    let urls = []
    const browser = await puppeteer.launch({
        //executablePath: '/usr/bin/chromium-browser', 
        headless: true,
      })
  
   let page = await browser.newPage(); 
   page.goto(immoUrl)
   let pagination = await page.waitForSelector('.pagination')
   let links = await pagination.$$('li > a ')
   let maxlink = 2
   for ( let link of links){
    let vallink = parseInt(await link.evaluate(e => e.textContent))
    if ( vallink && vallink > maxlink) maxlink = vallink
   }

   for (let i = 0 ; i < maxlink; i++){
    urls.push(`https://www.bienici.com/recherche/achat/france`)
   }

    return [pharmaUrl].concat(urls) 
}

   async function extractCard(element){
    
    try{
        let pharmaObj = {}


        
        return pharmaObj
     
    } catch (error){
        console.error(error)
    }
    



}



let fileName = new Date().getTime() + '.json'


let params = {
    container : "",
    card: '', //   
    urls: await getUrls(),
    extractCard: extractCard,
    fileName: fileName
}



await scrapperFunction(params)
