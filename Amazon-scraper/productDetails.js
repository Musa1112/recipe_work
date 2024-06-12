// productDetails.js
export async function extractProductDetails(page) {
    try {
        const products = await page.evaluate(() => {
            function getProductDetails(element) {
                const title = element.querySelector('.product-title-selector')?.innerText || 'N/A'; // Replace with actual selector
                const price = element.querySelector('.product-price-selector')?.innerText || 'N/A'; // Replace with actual selector
                const rating = element.querySelector('.product-rating-selector')?.innerText || 'N/A'; // Replace with actual selector
                const boughtInLastMonth = element.querySelector('.product-bought-in-last-month-selector')?.innerText || 'N/A'; // Replace with actual selector
                const delivery = element.querySelector('.product-delivery-selector')?.innerText || 'N/A'; // Replace with actual selector
                
                return { title, price, rating, boughtInLastMonth, delivery };
            }

            const productElements = Array.from(document.querySelectorAll('.product-container-selector')); // Replace with actual selector
            return productElements.map(getProductDetails);
        });

        return products;
    } catch (error) {
        console.error('Error extracting product details:', error);
        return [];
    }
}
