
const puppeteer = require('puppeteer');


//query amazon link, gets number of pages, title, author, audiobook duration, kindle link, and paperback link.

const URL =  'https://www.amazon.com/dp/B0036Z9U2A?tag=hltr-20';
//const URL =  'https://www.amazon.com/dp/B07HQQR6QW?tag=hltr-20';
//const URL = 'https://www.amazon.com/Irresistible-Addictive-Technology-Business-Keeping/dp/0735222843/ref=sr_1_1?crid=2I9T3JC8IMMAK&keywords=Irresistible%3A+The+Rise+of+Addictive+Technology+and+the+Business+of+Keeping+Us+Hooked&qid=1692095373&sprefix=irresistible+the+rise+of+addictive+technology+and+the+business+of+keeping+us+hooked%2Caps%2C1728&sr=8-1';


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
        //open that and take the URL as argument
        await page.goto(URL, { timeout: 0 });

        getTitle(page);
        getBookLength(page);
        getAuthor(page);

        const kLink = await getAudioBookLink(page);
        
        if(kLink){
            const audioLink = await browser.newPage();
            await audioLink.goto(kLink, { timeout: 0 });
            getAudiBookDuration(audioLink);
            getKindleLink(audioLink);
            //getPaperbackLink(audioLink);
        }

}

//the dollar sign simply refers to document.querySelector() function
async function getTitle(page) {
    const titleElement = await page.$('.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productTitle');
    if (titleElement) {
        const title = await titleElement.evaluate(el => el.textContent);
        return console.log(title.trim());
        //return title.trim();
    }
    return 'Title not found';
}

async function getBookLength(page) {
    const bookLengthElement = await page.$('.a-section.a-spacing-none.a-text-center.rpi-attribute-value span.a-declarative a.a-popover-trigger.a-declarative span');
    if (bookLengthElement) {
        const bookLength = await bookLengthElement.evaluate(el => el.textContent);
        return console.log(bookLength.trim());
    }
    return 'Book length of pages not found';
}

async function getAuthor(page) {
    const authorNameElement = await page.$('.celwidget .a-section.a-spacing-micro.bylineHidden.feature span.author.notFaded a.a-link-normal');
    if(authorNameElement){
        const authorName = await authorNameElement.evaluate(el => el.textContent);
        return console.log(authorName.trim());
    }
    return 'Author not found';
}


async function getAudioBookLink(page){
    const audiobookElement = await page.$('#a-autoid-3 span.a-button-inner #a-autoid-3-announce');
    if (audiobookElement) {
        const href = await page.evaluate(el => el.getAttribute('href'), audiobookElement);
        const aLink = "https://www.amazon.com" + href;
        console.log("Audiobook link:", aLink);
        return aLink;
    } 
    return 'Audiobook element not found';
    

}

async function getAudiBookDuration(link){
    const aBDurElement = await link.$('.a-section.a-spacing-none.a-text-center.rpi-attribute-value span');
    if(aBDurElement){
        const audiobookDurElement = await aBDurElement.evaluate(el => el.textContent);
        return console.log(audiobookDurElement.trim());
    }
    return 'audiobook duration not found';
}

async function getKindleLink(page){
    const kindleElement = await page.$('span.a-button-inner #a-autoid-4-announce');
    if(kindleElement){
        const href = await page.evaluate(el => el.getAttribute('href'), kindleElement);
        const aLink = "https://www.amazon.com" + href;
        console.log("Kindle link: ", aLink);
    }
    return 'Kindle link cannot be found';

}

async function getPaperbackLink(page){
    const paperbackElement = await page.$('span.a-button-inner #a-autoid-7-announce');
    if(paperbackElement){
        const href = await page.evaluate(el => el.getAttribute('href', paperbackElement));
        const aLink = "https://www.amazon.com" + href;
        console.log("Paperback link: ", aLink);
    }
    return 'Paperback link cannot be found';
}


queryBook(URL);                              

