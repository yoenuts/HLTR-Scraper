//console.log("Hello Erlein!");

const request = require('request-promise');
const cheerio = require('cheerio');

const URL =  'https://www.amazon.com/dp/B01HNJIK70?tag=hltr-20';

//async functiopn executes automatically

//you're using to make an HTTP request to the URL returns a Promise
//await keyword is used within an async function to pause the execution of the function until 
//the Promise it's waiting for is resolved.

//A Promise is a core concept in JavaScript for handling asynchronous operations. 
//It represents a value that may be available now, or in the future, or never. 
//use of promisese: coordinating multiple asynchronous operations and ensuring that you can proceed with 
//your code once all necessary values are available.


(async () => {
    try{
        const response = await request(URL, {
            headers : {
                Accept: '*/*',
                Host: 'www.amazon.com',
                Origin: 'https://www.amazon.com',
                Referer: 'https://www.amazon.com/dp/B01HNJIK70?tag=hltr-20',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        //console.log(response);
    
        let $ = cheerio.load(response);
    
        let title = $('div[class="a-section a-spacing-none"] > h1').text();
        /*
            let text = $('body').text();
            console.log(text);
        */
        //let title = $('div.a-section a-spacing-none h1.a-spacing-none a-text-normal span.a-size-extra-large celwidget').text().trim();
        console.log(response);
    } catch (error){
        console.log("error: ", error);
    }

})()

