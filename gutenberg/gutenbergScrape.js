const cheerio = require('cheerio');
const axios = require('axios')
const fs = require('fs');
const { log } = require('console');

const URL = 'https://gutenberg.org/ebooks/2701'

//download complete books, get their word counts, and also get example passages from the books

//project gutenberg bans scraping so I downloaded HTML, then worked with that 
async function downloadHTML(url, filePath){
    try{
        response = await axios.get(url);
        fs.writeFileSync(filePath, response.data);
        console.log("HTML downloaded successfully")
    }
    catch(error){
        throw 'Could not download HTML';
    }

}

async function queryBook(filePath, fileName){
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);

}

/*
async function queryBook(url){
    try{
        response = await axios.get(url,{
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0'
            }
    
        });
        const $ = cheerio.load(response.data);

        //
        const title = await getTitle($);
        const epubLink = await getDownloadLink($);
        if(epubLink){
            
        }

        const bookInfo = {
            title,
            epubLink
        }

        console.log(JSON.stringify(bookInfo, null, 2));

    } catch(error){
        console.log("Error:", error);
    }
    


}
*/

async function getTitle($){
    const titleElement = $('h1');
    return titleElement.text().trim()
}

async function getDownloadLink($){
    const linkElement = $('td.unpadded.icon_save a:contains("EPUB (no images, older E-readers)")');
    if(linkElement.length > 0){
        const href = linkElement.attr("href");
        const epubLink = "https://gutenberg.org/" + href;
        return epubLink;
    } else{ 
        return 'Download link not found';
    }
}


function downloadLink(url){
    
}

async function getPassages(){

}

queryBook(URL);