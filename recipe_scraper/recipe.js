import puppeteer from 'puppeteer';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize and configure the SQLite database
async function initializeDatabase() {
  const db = await open({
    filename: './recipes.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      ingredients TEXT,
      rating TEXT
    )
  `);

  return db;
}

// Insert the extracted data into the database
async function insertData(db, data) {
  const { title, ingredients, rating } = data;
  await db.run('INSERT INTO recipes (title, ingredients, rating) VALUES (?, ?, ?)', [title, ingredients.join(', '), rating]);
}

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null, 
    userDataDir: "./temp"
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://www.allrecipes.com/recipes/');

  // Extracting each product link
  const links = await page.evaluate(() => {
    const linkElements = Array.from(document.querySelectorAll('.comp.tax-sc__recirc-list-container.mntl-block a'));
    const linkUrls = linkElements.map(el => el.href);
    return linkUrls;
  });

  console.log(`Found ${links.length} links`);

  const db = await initializeDatabase();

  for (const productLink of links) {
    let success = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!success && attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Visiting ${productLink} (Attempt ${attempts})`);

        // Visiting product link
        await page.goto(productLink, { waitUntil: 'networkidle2', timeout: 60000 }); // Increased timeout to 60 seconds

        // Extracting product data from each of the product link
        const productData = await page.evaluate(() => {
          const title = document.querySelector("h1")?.textContent.trim();

          const ingredientElements = document.querySelectorAll("#mntl-structured-ingredients_1-0 ul li");
          const ingredients = Array.from(ingredientElements).map(el => el.textContent.trim());

          const ratingElement = document.querySelector(".comp.mntl-recipe-review-bar__rating.mntl-text-block.type--squirrel-bold");
          const rating = ratingElement ? ratingElement.textContent.trim() : '0';


          return { title, ingredients, rating };
        });

        if (productData.title && productData.ingredients && productData.rating) {
          await insertData(db, productData);
        } else {
          console.log(`Incomplete data for ${productLink}:`, productData);
        }

        success = true;

      } catch (error) {
        console.error(`Error visiting ${productLink}:`, error);
        if (attempts >= maxAttempts) {
          console.error(`Failed to retrieve ${productLink} after ${maxAttempts} attempts`);
        }
      }
    }
  }

  await browser.close();
  await db.close();
  console.log('done');
})();
