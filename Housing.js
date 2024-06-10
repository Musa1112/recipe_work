import puppeteer from 'puppeteer';
import fs from 'fs';
import { format } from '@fast-csv/format';

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    const allProducts = [];
    let currentPage = 1;
    const maxPages = 5;
    
    try {
        while (currentPage <= maxPages) {
            const url = `https://nigeriapropertycentre.com/for-sale/houses/showtype?page=${currentPage}`;
            await page.goto(url, {
                waitUntil: "networkidle2",
                timeout: 60000 // Increase timeout to 60 seconds
            });

            const products = await page.evaluate(() => {
                const productElements = Array.from(document.querySelectorAll(".col-md-12 .wp-block.property.list"));
                const productData = productElements.map(product => {
                    const title = product.querySelector(".wp-block-title.hidden-xs")?.textContent.trim() || '';
                    const price = product.querySelector(".wp-block-content.clearfix.text-xs-left.text-sm-left span.pull-sm-left")?.textContent.trim() || '';
                    const imageLink = product.querySelector(".sm-width-min-200-max-250.xs-width-min-200-max-350")?.src || '';
                    const phoneAndCompany = product.querySelector(".wp-block-content.clearfix.text-xs-left.text-sm-left .marketed-by.pull-right.hidden-xs.hidden-sm.text-right")?.textContent.trim() || '';
                    const location = product.querySelector(".wp-block-content.clearfix.text-xs-left.text-sm-left .voffset-bottom-10")?.textContent.trim() || '';

                    const newPandC = phoneAndCompany.replace(/\n+/g, '\n').split("\n").map((item) => item.trim());
                    const phoneContact = newPandC.length > 1 ? newPandC[1] : '';
                    const companyName = newPandC[0] || '';

                    return { title, price,  phoneContact, companyName, location, imageLink };
                });
                return productData;
            });

            allProducts.push(...products);
            console.log(`Page ${currentPage} scraped successfully.`);

            currentPage++;
        }
    } catch (error) {
        console.error(`Error occurred while scraping: ${error.message}`);
    } finally {
        await browser.close();
        console.log(`Scraping complete. Total products scraped: ${allProducts.length}`);
        
        // Export to CSV
        const csvStream = format({ headers: true });
        const writableStream = fs.createWriteStream('products.csv');

        writableStream.on('finish', () => {
            console.log('CSV file has been written successfully.');
        });

        csvStream.pipe(writableStream);
        allProducts.forEach(product => {
            csvStream.write(product);
        });
        csvStream.end();

        console.log(allProducts);
    }
})();
