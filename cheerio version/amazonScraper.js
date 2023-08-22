const cheerio = require('cheerio');
const axios = require('axios');

const URL = 'https://www.amazon.com/dp/B0036Z9U2A?tag=hltr-20';
//query amazon link, gets number of pages, title, author, audiobook duration, kindle link, and paperback link.
/*
req(URL, (error, response, html) => {
    if(!error && response.statusCode == 200){
        const $ = cheerio.load(html);
        //.find().text() or .children() 
        //const linkBars = $('ul.a-unordered-list.a-nostyle.a-button-list.a-horizontal');
        const stuff = $('.a-row ul.a-unordered-list.a-nostyle.a-button-list.a-horizontal');
        
    }
});
*/

async function queryBook(url){
    try{
        //create a request using axios
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0'
            }
        });
        //parse the response into html
        const $ = cheerio.load(response.data);
        //if you dont wait it'll return a promise
        const title = await queryTitle($);
        const author = await queryAuthor($);
        const page = await queryPages($);
        console.log(title);
        console.log(author);
        console.log(page);
    }
    catch(error){
        console.log("Error:", error);
    }
}

async function queryTitle($){
    const titleElement = $('#productTitle');
    if(titleElement){
        return titleElement.text().trim();
    } else { return 'Title not found' }
}

async function queryAuthor($){
    const authorElement = $('#bylineInfo span.author.notFaded a.a-link-normal');
    if(authorElement){
        return authorElement.text().trim();
    } else { return 'Author not found' }
}

async function queryPages($){
    const pageElement = $('#rpi-attribute-book_details-ebook_pages .a-section.a-spacing-none.a-text-center.rpi-attribute-value span.a-declarative a.a-popover-trigger.a-declarative span');
    if(pageElement){
        return pageElement.text().trim();
    } else { return 'Book Pages not found' }

}

queryBook(URL)




