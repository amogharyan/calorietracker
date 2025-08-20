import cheerio from 'cheerio';
import { MenuItem } from '../models/MenuItem.js';
import crypto from 'crypto';

// parse caldining menu html and return structured items
export function parseCaldiningMenu(html, sourceUrl)
{
  const items = [];

  try
  {
    const $ = cheerio.load(html);

    // select each menu item container; adjust selector to match caldining html
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
    return [];
  }

  return items;
}

// upsert parsed caldining menu items into database
export const upsertCaldiningMenuItems = async function(items, restaurantId)
{
  for (const item of items)
  {
    try
    {
      const hash = crypto
        .createHash('sha256')
        .update(item.rawHtml || JSON.stringify(item))
        .digest('hex');

      const existing = await MenuItem.findOne({
        restaurant: restaurantId,
        rawHtmlHash: hash,
      });

      if (existing)
      {
        continue; // item unchanged, skip db write
      }

      const menuItemData = {
        ...item,
        restaurant: restaurantId,
        rawHtmlHash: hash,
        lastScraped: new Date(),
      };

      await MenuItem.findOneAndUpdate(
        {
          restaurant: restaurantId,
          canonicalName: item.canonicalName || item.name.toLowerCase(),
        },
        menuItemData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    catch (err)
    {
      console.error(`failed to upsert caldining menu item: ${item.name}`, err);
    }
  }
};