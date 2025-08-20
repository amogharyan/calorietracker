import { MenuItem } from '../models/MenuItem.js';
import crypto from 'crypto';

// compute hash/checksum of raw html
function computeHash(rawHtml)
{
  return crypto.createHash('sha256').update(rawHtml).digest('hex');
}

// upsert caldining menu items into mongo idempotently
export async function upsertCaldiningMenuItems(items, restaurantId)
{
  const summary = {
    inserted: 0,
    updated: 0,
    skipped: 0,
  };

  for (const item of items)
  {
    // compute raw html hash for change detection
    const rawHtmlHash = computeHash(item.rawHtml);

    // canonicalize name for fuzzy/duplicate detection
    const canonicalName = item.name.trim().toLowerCase();

    // find existing item by restaurant + canonicalName
    const existing = await MenuItem.findOne({
      restaurant: restaurantId,
      canonicalName,
    });

    if (existing)
    {
      // skip update if nothing changed
      if (existing.rawHtmlHash === rawHtmlHash)
      {
        summary.skipped += 1;
        continue;
      }

      // update changed fields
      existing.name = item.name;
      existing.price = item.price;
      existing.servingSize = parseFloat(item.servingSize) || null;
      existing.servingUnit = null; // normalize later
      existing.sourceUrl = item.url;
      existing.rawHtmlHash = rawHtmlHash;
      existing.lastScraped = new Date();

      await existing.save();
      summary.updated += 1;
    }
    else
    {
      // insert new item
      const newItem = new MenuItem({
        restaurant: restaurantId,
        name: item.name,
        canonicalName,
        price: item.price,
        servingSize: parseFloat(item.servingSize) || null,
        servingUnit: null,
        sourceUrl: item.url,
        rawHtmlHash,
        lastScraped: new Date(),
      });

      await newItem.save();
      summary.inserted += 1;
    }
  }

  return summary;
}