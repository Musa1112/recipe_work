
# Puppeteer Full-Page Screenshot Script

This script uses Puppeteer to automate the login process on GeeksforGeeks and take a full-page screenshot after successfully logging in.

## prerequisites or dependencies needed.

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/) for package management


## Installation

1. **Clone the repository:**

    ```sh
    https://github.com/Musa1112/recipe_work
    ```



2. **Install the dependencies:**

    ```sh
    npm install
    ```

    or

    ```sh
    yarn install
    ```

## Setup Environment Variables

in the root of the project and add your login credentials:


SERNAME=your-email@example.com
PASSWORD=your-password
make sure credetials use are registered with geekforgeek

## run the script use
node geek_screenshot.js


## here is the geek_screenshort.js file script

```js

import puppeteer from "puppeteer";
import dotenv from "dotenv";

dotenv.config();

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: "./temp"
    });
    const url = "https://auth.geeksforgeeks.org/";
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load" });

    try {
        // Input login details
        await page.type('#luser', process.env.GFG_USERNAME, { delay: 100 });
        await page.type('#password', process.env.GFG_PASSWORD, { delay: 100 });

        // Wait for the login button to be available and click it
        await page.waitForSelector('.btn.btn-green.signin-button');
        await page.click('.btn.btn-green.signin-button');

        // Wait for navigation to the next page
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // Optionally, wait for a specific element that indicates the page is fully loaded
        await page.waitForSelector('#some-element-on-next-page'); // Replace with an appropriate selector

        // Take a full-page screenshot
        await page.screenshot({ path: 'fullpage_screenshot.png', fullPage: true });
    } catch (error) {
        console.log(error);
    }

    await browser.close();
})();


