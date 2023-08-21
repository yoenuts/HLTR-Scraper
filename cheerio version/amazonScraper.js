const cheerio = require('cheerio');
const req = require('request');

const URL = 'https://www.amazon.com/dp/B0036Z9U2A?tag=hltr-20';
//query amazon link, gets number of pages, title, author, audiobook duration, kindle link, and paperback link.
req(URL, (error, response, html) => {
    if(!error && response.statusCode == 200){
        const $ = cheerio.load(html);
        //.find().text() or .children() 
    }
});




