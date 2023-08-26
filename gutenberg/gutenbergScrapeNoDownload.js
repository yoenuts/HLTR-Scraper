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