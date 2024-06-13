import puppeteer from "puppeteer";
// function for the entire scraping
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        
    });
    const url = "https://auth.geeksforgeeks.org/";
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load" });

    //catch error when there is any

    try {
        // Input login details
        await page.type('input[type="text"]', 'iliyamusa900@gmail.com', { delay: 100 });
        await page.type( 'input[type="password"]', 'Medicine5413#', { delay: 100 });

        // Waiting for the login or sign in button to be available and click it
        await page.waitForSelector('.btn.btn-green.signin-button');
        await page.click('.btn.btn-green.signin-button');

        // Waiting for navigation to the next page
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // waiting for an element that indicates the page is fully loaded
        await page.waitForSelector('.footer-container ul'); 

        // Take a full-page screenshot
        await page.screenshot({ path: 'screenshot.png', fullPage: true });
    } catch (error) {
        console.log(error);
    }

    await browser.close();
})();
