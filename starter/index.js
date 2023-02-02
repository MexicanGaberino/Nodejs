const fs = require('fs');
const http = require('http');
const url = require('url')




//Syn functions
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataObject = JSON.parse(data);
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8');
const replaceTemplate = (temp,product)=>{
    let output= temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%PRICE%}/g,product.price)
    output = output.replace(/{%FROM%}/g,product.from)
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients)
    output = output.replace(/{%QUANTITY%}/g,product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g,product.description)
    output = output.replace(/{%ID%}/g,product.id)
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic')

    return output;
}



//Server creation
const server = http.createServer((req, res) => {
    
    const {query,pathName} = url.parse(req.url,true);
     
     //const urlId= pathName.slice(8)

    //Overview page
    if (pathName === '/Overview' || pathName == '/') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const cardsHtml = dataObject.map(el => replaceTemplate(tempCard,el)).join('');
        const output= tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
    } else if (pathName === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);
    } else if (pathName === `/product`) {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObject[query.id];
        const output = replaceTemplate(tempProduct,product)
        res.end(output);
    }
    else {
        res.end('<h1> Not found<h1/>')
    }

});
//server listening 
server.listen(8000, "127.0.0.1", () => {
    console.log("working at 120.0.01")
})