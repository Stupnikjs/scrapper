import puppeteer from "puppeteer"
import fs from 'fs'


let protimingUrl = "https://www.protiming.fr/runnings/liste?Event_filter="

async function protiming(url){
    const browser = await puppeteer.launch({headless:"true"})
    let page = await browser.newPage(); 

    await page.goto(url)
    let html = await page.waitForSelector('html')
    let paginator = await html.$$('ul.paginator > li > a')

    await oneScrappingProcess(page)

   // pagination ne marche pas 
   let urls = [] 
   for (let i = 1; i < paginator.length; i++){
            
         urls.push(await paginator[i]?.evaluate(el => el.href))
            
        }
    console.log(urls)
        for (let url of urls){

        await page.goto(url)
        await oneScrappingProcess(page);
    }  
   browser.close() 
}



async function oneScrappingProcess(page){
    let result = []
    let html = await page.waitForSelector('html')
    let panelElements = await html.$$('.col-md-6.clickable.visible-lg.visible-md')
     
    for ( let element of panelElements){
            let raceObj = {}
            try{
                
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
                result.push(raceObj)
                
            } catch (error){
                console.error(error)
            }
            
    }
    let resultJson = JSON.stringify(result)
    let jsonFileName = new Date().getTime() + 'races.json'
    fs.writeFileSync(jsonFileName, resultJson)
   
}


await protiming(protimingUrl)
process.exit()












/*
let resultToJson = await protiming(protimingUrl)
let resultJson = JSON.stringify(resultToJson)
let jsonFileName = 'races.json'
fs.writeFileSync(jsonFileName, resultJson)

process.exit()
*/


