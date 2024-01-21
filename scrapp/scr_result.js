import puppeteer from "puppeteer"
import fs from 'fs'

// https://github.com/puppeteer/puppeteer/issues/7917

let protimingUrl = "https://www.protiming.fr/Results/liste"

async function protiming(url){
   const browser = await puppeteer.launch({headless:"true"})
   let page = await browser.newPage(); 

   await page.goto(url)
   let paginator = await page.$$('ul.paginator > li > a')

   await oneScrappingProcess(page)
   browser.close() 
}



async function oneScrappingProcess(page){
    let result  = []
    let urlResults = []
    let html = await page.waitForSelector('html')
    let panelElements = await html.$$('.col-md-12 > a')
     
    // get all url for race results 
    for ( let element of panelElements){
        try{
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
        result = result.concat(result, await extractData(url, page))
    }
    
   let resultJson = JSON.stringify(result)
   let jsonFileName = new Date().getTime() + 'results.json'
   fs.writeFileSync(jsonFileName, resultJson)
   
    
}



async function extractData(url, page){
    let resultList = []
    await page.goto(url)
    let html = await page.waitForSelector('html')
    try {
        let table = await html.waitForSelector('table#results')
        let cards = await table.$$('tr')
        for (let card of cards){
            let res = await extractCard(card)
            console.log(res)
            resultList.push(res)
        }
        return resultList
    } catch(err){
        console.error(err)
    } 
}



async function extractCard(card){
   
    
    let columns = await card.$$('td')
    let rObj = {}
    for (let i = 0; i < columns.length; i++){
        
       if (i == 0){
        rObj['rank'] = await columns[i].evaluate(el => el.textContent.trim())
       }
       if (i == 1){
        rObj['r_time'] = await columns[i].evaluate(el => el.textContent.trim())
       }
       if (i == 2){
        
        rObj['name'] = await columns[i].evaluate(el => el.textContent.trim())}
     
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




