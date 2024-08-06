const puppeteer = require('puppeteer');
const {XMLParser} = require('fast-xml-parser');
const axios = require('axios');

const parser = new XMLParser();

const getSitemapUrl = async (domain) => {
    try{
        const response = await fetch(`https://${domain}/robots.txt`);
        const text = await response.text();
        const sitemapUrl = text.match(/sitemap:\s*(.*)/i);

        if(!sitemapUrl){
            throw new Error('Sitemap not found');
        }
        return sitemapUrl[1].trim();
    }
    catch(error){
        console.error(error);
        throw new Error('Error in parsing robots.txt' + error.message);
    }
}

const getFirstProductSitemap = async (sitemapUrl) => {
    try{
        const response = await axios.get(sitemapUrl);
        const xmlContent = response.data;
        const jsonObj = parser.parse(xmlContent);
        
        if (!jsonObj.sitemapindex || !jsonObj.sitemapindex.sitemap || !jsonObj.sitemapindex.sitemap.length) {
            throw new Error('Invalid sitemap index format');
        }

        // Find the first product sitemap URL
        const productSitemap = jsonObj.sitemapindex.sitemap.find(sitemap => sitemap.loc.includes('sitemap_products'));
        if (!productSitemap) {
            throw new Error('Product sitemap URL not found in sitemap index');
        }

        return productSitemap.loc;
    }
    catch(error){
        console.error(error);
        throw new Error('Error in parsing sitemap' + error.message);
    }
}

const scrapeXML = async (req, res) => {
    
    try{
        const {url} = req.body;
        const sitemapUrl = await getSitemapUrl(url);
        const productSitemap = await getFirstProductSitemap(sitemapUrl);
        if(!productSitemap){
            return res.status(404).json({success: false, error: 'Product sitemap not found'});
        }
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(productSitemap);

        const xmlContent = await page.evaluate(() => document.querySelector('body').innerText);

        const jsonObj = parser.parse(xmlContent);
        const urls = jsonObj.urlset.url;
        const products = urls.filter(product=> product['image:image'] && product.lastmod).map(product => ({
            link: product.loc,
            image: product['image:image'] ? product['image:image']['image:loc'] : null,
            imageTitle: product['image:image'] ? product['image:image']['image:title'] : null,
        })).slice(0,5);
        
        await browser.close();

        res.status(200).json({success:true, data: products});
    }
    catch(error) {
        console.error(error);
        res.status(500).json({success: false, error: error.message});
    }
}

module.exports = scrapeXML;