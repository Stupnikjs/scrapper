import puppeteer from "puppeteer"
import fs from 'fs'


let protimingUrl = "https://www.protiming.fr/Results/liste"

async function protiming(url){
   const browser = await puppeteer.launch({headless:"true"})
   let page = await browser.newPage(); 

   await page.goto(url)
   let paginator = await page.$$('ul.paginator > li > a')

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
   browser.close() 
   */
}



async function oneScrappingProcess(page){
    let result  = []
    let urlResults = []
    let html = await page.waitForSelector('html')
    let panelElements = await html.$$('.col-md-12 > a')
     
    for ( let element of panelElements){
        try{
            let raceObj = {}
            let urlResult = await element.evaluate(el => el.href)
            urlResults.push(urlResult)
        } catch (error){
            console.error(error)
        }
        
    }
    // clean urls 
    urlResults = urlResults.filter(x => x.substring(33, 40) === 'running')
    console.log(urlResults)

    for ( let url of urlResults){
        console.log(url)
        result.concat(result, await extractData(url, page))
    }
    
    console.log(result)
    
}



async function extractData(url, page){
    let resultList = []
    await page.goto(url)
    let html = await page.waitForSelector('html')
    try {
        let table = await html.waitForSelector('table#results')
        let cards = await table.$$('tr')
        for (let card of cards){
            resultList.push(await extractCard(card))
        }
        return resultList
    } catch(err){
        console.error(err)
    } 
}



async function extractCard(card){
    let rObj = {}

    let columns = await card.$$('td')
    for (let i = 0; i < columns.length; i++){
       
       if (i == 0){
        rObj['rank'] = await columns[i].evaluate(el => el.textContent.trim())
       }
       if (i == 1){
        rObj['r_time'] = await columns[i].evaluate(el => el.textContent.trim())
       }
       if (i == 2){
        rObj['name'] = await columns[i].evaluate(el => el.textContent.trim())
       }
     
       if (i == 3){
        rObj['club'] = await columns[i].evaluate(el => el.textContent.trim())
       }
       if (i == 4){
        rObj['bib_num'] = await columns[i].evaluate(el => el.textContent.trim())
       }

        if (i == 5){
        rObj['age_cat'] = await columns[i].evaluate(el => el.textContent.trim())
       }
       if (i == 6){
        rObj['v_kmh'] = await columns[i].evaluate(el => el.textContent.trim())
       }
       if (i == 7){
        rObj['o_time'] = await columns[i].evaluate(el => el.textContent.trim())
       }
    }
    return rObj


}

await protiming(protimingUrl)
process.exit()




