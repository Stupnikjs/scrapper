import {scrapperFunction} from "./scrappFunc.js"
import puppeteer from "puppeteer";


async function extractUrls(){
    const browser = await puppeteer.launch({
        //executablePath: '/usr/bin/chromium-browser', 
        headless: true,
      })
    
    let page = await browser.newPage(); 
    let url = "https://www.protiming.fr/runnings/liste?Event_filter="
    
    await page.goto(url)
    let paginator = await page.$$('ul.paginator > li > a')
    
    let urls = [] 
    
    for (let i = 1; i < paginator.length; i++){
            
         urls.push(await paginator[i]?.evaluate(el => el.href))
            
        }
    return urls
}


async function extractCard(element){

    try{
        let raceObj = {}
        let nameRace = await element?.waitForSelector('.Cuprum')
        
        let name = await nameRace.evaluate(el => el.textContent)
        raceObj['name'] = name


        let dateRace = await element.waitForSelector('time')
        let date = await dateRace.evaluate(el => el.textContent)
        let dateNoSpace = date.replace(/\s/g, '').trim()
        let year = dateNoSpace.substring(0,4)
        let withOutYear = dateNoSpace.substring(4, dateNoSpace.length)
        let dateFinal = year + - + withOutYear.substring(withOutYear.length - 2, withOutYear.length).substring()+ - + dateNoSpace.substring(dateNoSpace.length - 2, dateNoSpace.length)
        raceObj['date'] = dateFinal

        
        let placeRace = await element?.waitForSelector('.Cuprum ~ p')
        let place = await placeRace.evaluate(el => el.textContent)
        raceObj['place'] = place.replace(/\s/g, '').trim()
        return raceObj
        
    } catch (error){
        console.error(error)
    }

}

let fileName = new Date().getTime() + 'race.json'


let params = {
    container : "",
    card: '.col-md-6.clickable.visible-lg.visible-md',
    urls: await extractUrls(),
    extractCard: extractCard,
    fileName: fileName
}



await scrapperFunction(params)
