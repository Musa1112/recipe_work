// pagination.js
export async function extractCategoryLinks(page) {
    try {
        const categLinks = await page.evaluate(() => {
            const catLinks = Array.from(document.querySelectorAll('.a-container .a-row .bxc-grid-overlay__link'));
            return catLinks.map(el => el.href);
        });
        return categLinks;
    } catch (error) {
        console.error('Error extracting category links:', error);
        return [];
    }
}

export async function collectAllCategoryLinks(page, maxPages = 5) {
    let allLinks = [];
    let currentPage = 0;
    try {
        while (currentPage < maxPages) {
            const links = await extractCategoryLinks(page);
            allLinks.push(...links);

            const nextButton = await page.$('.pagination-next-button-selector'); // Replace with the actual selector for the "Next" button
            if (nextButton) {
                await Promise.all([
                    nextButton.click(),
                    page.waitForNavigation({ waitUntil: 'load' })
                ]);
                currentPage++;
            } else {
                break;
            }
        }
    } catch (error) {
        console.error('Error collecting all category links:', error);
    }
    return allLinks;
}
