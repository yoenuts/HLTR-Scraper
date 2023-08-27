const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const EPub = require('epub-wordcount');


const URL = 'https://gutenberg.org/ebooks/2701';

//download complete books, get their word counts, and also get example passages from the books

//project gutenberg bans scraping so I downloaded HTML 
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

async function queryBook(eFileName, filePath, epubFolder, epubFilePath){
    try{
        const html = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(html);
    
        const epubLink = await getDownloadLink($);
        //pass the link, name of the epub file and where to save it
        await downloadLink(epubLink, epubFolder, eFileName);
        const wordCount = await getWordCount(epubFilePath);

        const bookInfo = {
            epubLink,
            wordCount
        }

        console.log(JSON.stringify(bookInfo, null, 2));
    
    }
    catch(error){
        console.error("Error:", error);
        throw error;
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


async function downloadLink(url, filePath, fileName){
    const output = path.join(filePath, fileName);
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

async function getWordCount(FilePath){
    try{
        const wordCount = await EPub.countWords(FilePath);
        return wordCount;
    }
    catch(error){
        console.log("Error counting: ", error);
        throw error;
    }
}

//file name
const htmlFileName = URL.split('/ebooks/')[1] + '.html';
const epubFileName = URL.split('/ebooks/')[1] + '.epub';
//file path. Folder to store html files was in my computer's Documents
const documentsPath = path.join(os.homedir(), 'Documents');
const htmlfolderPath = path.join(documentsPath, 'gutenberg-book-html');
//store epubs in a folder within gutenberg-book-html
const epubfolderPath = path.join(htmlfolderPath, 'gutenberg-book-epubs');

//check if gutenberg-book-html and gutenberg-book-ep   ubs folder exist in the computer directory. create one if it doesnt
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
epubFilePath = path.join(epubfolderPath, epubFileName);

downloadHTML(URL, htmlFilePath).then(() => {
    queryBook(epubFileName, htmlFilePath, epubfolderPath, epubFilePath);
}).catch(error => {
    throw error;
});