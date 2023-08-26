const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

const URL = 'https://gutenberg.org/ebooks/2701';

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

async function queryBook(filePath, epubfilePath){
    try{
        const html = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(html);
    
    
        const title = await getTitle($);
        const epubLink = await getDownloadLink($);
        await downloadLink(title, epubLink, epubfilePath);
        const passage = await getPassage();
        const bookInfo = {
            title,
            epubLink
        }

        console.log(JSON.stringify(bookInfo, null, 2));
    
    }
    catch(error){
        throw 'error reading html file';
    }
}


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


async function downloadLink(title, url, filePath){
    const epubName = title + '.epub';
    const output = path.join(filePath, epubName);
    try{

        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });

        const file = fs.createWriteStream(output);
        response.data.pipe(file);

        return new Promise((resolve, reject) => {
            file.on('finish', resolve);
            file.on('error', reject);
        })
    }
    catch(error){
        console.log('Error:',error);
    }
}

async function getPassage(){

}

async function getWordCount(){
    
}


//file name
const htmlFileName = URL.split('/ebooks/')[1] + '.html';
const epubFileName = URL.split('/ebooks/')[1] + '.epub';
//file path. Folder to store html files was in my computer's Documents
const documentsPath = path.join(os.homedir(), 'Documents');
const htmlfolderPath = path.join(documentsPath, 'gutenberg-book-html');
//store epubs in a filder within gutenberg-book-html
const epubfolderPath = path.join(htmlfolderPath, 'gutenberg-book-epubs');

//check if gutenberg-book-html and gutenberg-book-epubs folder exist in the computer directory. create one if it doesnt
if (!fs.existsSync(htmlfolderPath)) {
    // Create the folder if it doesn't exist
    fs.mkdirSync(htmlfolderPath);
    console.log('Folder created:', htmlfolderPath);
}
if(!fs.existsSync(epubfolderPath)){
    fs.mkdirSync(epubfolderPath);
    console.log('Folder created:', epubfolderPath);
};

const htmlFilePath = path.join(htmlfolderPath, htmlFileName);
downloadHTML(URL, htmlFilePath).then(() => {
    queryBook(htmlFilePath, epubfolderPath);
});