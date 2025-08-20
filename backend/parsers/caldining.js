import cheerio from 'cheerio';

/**
 * parse caldining menu html and return structured items
 * @param {string} html - raw html string of the menu page
 * @param {string} sourceUrl - url of the menu page
 * @returns {Array} array of menu item objects
 */
export function parseCaldiningMenu(html, sourceUrl)
{
  const items = [];

  try
  {
    const $ = cheerio.load(html);

    // select each menu item container; need to adjust selector to match caldining html
    $('.menu-item').each((_, element) =>
    {
      const name = $(element).find('.item-name').text().trim();
      const priceText = $(element).find('.item-price').text().trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      const servingSize = $(element).find('.item-serving').text().trim();
      const rawHtml = $.html(element);
      const url = sourceUrl;

      if (name)
      {
        items.push(
        {
          name,
          price,
          servingSize,
          servingUnit: null, // normalize later if needed
          url,
          rawHtml,
        });
      }
    });
  }
  catch (err)
  {
    console.error(`caldining parser error for ${sourceUrl}:`, err.message);
    // return empty array on parse failure
    return [];
  }

  return items;
}