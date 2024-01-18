import puppeteer from "puppeteer"
import fs from 'fs'




let protimingUrl = "https://www.protiming.fr/runnings/liste?Event_filter="

async function protiming(url){
    const browser = await puppeteer.launch({headless:"new"})
    let page = await browser.newPage(); 

    await page.goto(url)
    let html = await page.waitForSelector('html')

    let paginator = await html.$$('ul.paginator > li > a')

    let textCnt = await html.evaluate(el => el.textContent)
    // console.log(textCnt)
    console.log(paginator.length)
    for ( let i = 1; i < paginator.length + 1; i++){
        
        console.log(await paginator[i].evaluate(el => el.href))
            
        let html = await page.waitForSelector('html')
            // console.log(await html.evaluate(el => el.textContent))
     
       
    }

}

await protiming(protimingUrl)