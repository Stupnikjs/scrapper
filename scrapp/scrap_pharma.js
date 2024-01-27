import {scrapperFunction} from "./scrappFunc.js"
import puppeteer from "puppeteer";

let pharmaUrl = "https://mapharma.fr/12-medicaments"
/*
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
   return totalPages
    }

let urls = [] 

let totalPages = await pharma3000(pharmaUrl)
for (let i = 40; i < totalPages - 1; i++){
        let url_to = `https://www.pharmacie-cap3000.com/11-medicaments#/page-${i}`
        urls.push(url_to)

   }
*/
   async function extractCard(element){
    
    try{
        let pharmaObj = {}
        console.log(await element.evaluate(el => el.textContent))
        return pharmaObj
     
    } catch (error){
        console.error(error)
    }
    



}

let fileName = new Date().getTime() + 'pharma.json'


let params = {
    container : "",
    card: '.col-md-6.col-lg-4.productlistos.medos',
    urls: [pharmaUrl],
    extractCard: extractCard,
    fileName: fileName
}



await scrapperFunction(params)
