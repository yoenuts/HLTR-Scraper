const cheerio = require('cheerio');
const axios = require('axios')
const fs = require('fs')

const URL = 'https://gutenberg.org/ebooks/2701'

//download complete books, get their word counts, and also get example passages from the books

async function queryBook(url){
    response = await axios.get(url,{
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0'
        }

    });

    const $ = cheerio.load(response.data);


}

async function getFile($){
    
}

