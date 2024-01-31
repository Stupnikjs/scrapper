import {scrapperFunction} from "../scrappFunc.js"
import puppeteer from "puppeteer";

// let immoUrl = "https://www.bienici.com/recherche/achat/france"

async function getUrls(){
   let urls = []
   let maxlink = 100
   for (let i = 1 ; i < maxlink; i++){
    urls.push(`https://www.bienici.com/recherche/achat/france?page=${i}`)
   }

    return urls
}

   async function extractCard(element){
    
    try{
        let pharmaObj = {}
        
        let titleEl =  await element.waitForSelector('h3 > span.ad-overview-details__ad-title')
        pharmaObj['title'] = await titleEl.evaluate(el => el.textContent)

        let addressEl =  await element.waitForSelector('h3 > span.ad-overview-details__address-title')
        pharmaObj['adress'] = await addressEl.evaluate(el => el.textContent)


        let priceEl = await element.waitForSelector('div.ad-price__price > span.ad-price__the-price')
        pharmaObj['price'] = await priceEl.evaluate(el => el.textContent)

        let pricePerMEl = await element.waitForSelector('div.ad-price__price > span:nth-child(2)', {timout: 10000})
        pharmaObj['price_per_m'] = await pricePerMEl.evaluate(el => el.textContent)

       
       

        return pharmaObj
        
    } catch (error){
        console.error(error)
    }
    



}



let fileName = new Date().getDay() + new Date().getHours() + 'immo.json'


let params = {
    container : "",
    card: '.ad-overview-details.ad-overview-details--small', //   
    urls: await getUrls(),
    extractCard: extractCard,
    fileName: fileName
}



await scrapperFunction(params)
