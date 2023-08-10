//console.log("Hello Erlein!");
const puppeteer = require('puppeteer');


//query amazon link, gets number of pages, title, author, audiobook duration, kindle link, audiobook link, and paperback link.

//const URL =  'https://www.amazon.com/dp/B01HNJIK70?tag=hltr-20';
const URL =  'https://www.amazon.com/dp/B0036Z9U2A?tag=hltr-20';



//async functiopn executes automatically

//you're using to make an HTTP request to the URL returns a Promise
//await keyword is used within an async function to pause the execution of the function until 
//the Promise it's waiting for is resolved.

//A Promise is a core concept in JavaScript for handling asynchronous operations. 
//It represents a value that may be available now, or in the future, or never. 
//use of promisese: coordinating multiple asynchronous operations and ensuring that you can proceed with 
//your code once all necessary values are available.


async function queryBook(url){
        //launch a non-headless (it means it shows GUI), dV just maximizes it into the screen the userData saves the
        //user's data somewhere
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            userDataDir: "./tmp"
        });
        
        //create a new page 
        const page = await browser.newPage();
        //open that
        await page.goto(URL)

        getTitle(page);
        getBookLength(page);
}

//the dollar sign simply refers to document.querySelector() function
async function getTitle(page) {
    const titleElement = await (await page.$('.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productTitle'));
    if (titleElement) {
        const title = await titleElement.evaluate(el => el.textContent);
        return console.log(title.trim());
    }
    return 'Title not found';
}

async function getBookLength(page) {
    const bookLengthElement = await(await page.$('.a-section.a-spacing-none.a-text-center.rpi-attribute-value span.a-declarative a.a-popover-trigger.a-declarative span'));
    if (bookLengthElement) {
        const bookLength = await bookLengthElement.evaluate(el => el.textContent);
        return console.log(bookLength.trim());
    }
    return 'Book length of pages not found';
}


queryBook(URL);


/*
(async () => {
    try{


        const productTitles = await page.$$('.a-spacing-none .a-text-normal');
        
        for(const pTitle of productTitles){
            //await pTitle.waitForSelector('#productTitle');
            const singleTitle = await pTitle.$eval('#productTitle', el => el.textContent);
            console.log(singleTitle);
        }

    } catch (error){
        console.log("error: ", error);
    }

})()
*/
