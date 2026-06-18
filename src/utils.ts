/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Automatically converts Google Drive view URLs to clean, direct image download URLs
 * so they can be loaded directly inside <img> tags.
 * Supports standard format `/file/d/ID/view`, unified link versions and custom links.
 */
export function cleanImageUrl(url: string | undefined): string {
  if (!url) return '';
  const clean = url.trim();

  if (clean.includes('drive.google.com')) {
    let fileId = '';
    
    // 1. Matches /file/d/ID/view, /file/u/0/d/ID/view, /file/u/1/d/ID, etc.
    const fileDMatch = clean.match(/\/file\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
      fileId = fileDMatch[1];
    } else {
      // 2. General fallback for any /d/ID pattern in drive path
      const generalDMatch = clean.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (generalDMatch && generalDMatch[1]) {
        fileId = generalDMatch[1];
      } else {
        // 3. Matches query parameter id=FILE_ID
        const idParamMatch = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (idParamMatch && idParamMatch[1]) {
          fileId = idParamMatch[1];
        }
      }
    }

    if (fileId) {
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  return clean;
}

/**
 * Checks if a given image URL matches any of the pre-seeded or default category
 * Unsplash background images, so we can clean/delete them whenever an admin
 * uploads or pastes their own image/links.
 */
export function isDefaultPresettedImage(url: string | undefined): boolean {
  if (!url) return false;
  const cleanUrl = url.trim();
  const defaultSeeds = [
    'https://images.unsplash.com/photo-1597362925123-77861d3fbac7',
    'https://images.unsplash.com/photo-1566385101042-1a010c159f81',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    'https://images.unsplash.com/photo-1518843875459-f738682238a6',
    'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2',
    'https://images.unsplash.com/photo-1519996521430-02b798c1d881',
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba',
    'https://images.unsplash.com/photo-1610832958506-ee5633619144',
    'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c',
    'https://images.unsplash.com/photo-1574325131876-ae2b0805c52b',
    'https://images.unsplash.com/photo-1536304997881-a372c179924b',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    'https://images.unsplash.com/photo-1600271886742-f049cd451bba',
    'https://images.unsplash.com/photo-1534482421-64566f976cfa',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    'https://images.unsplash.com/photo-1551248429-40975aa4de74',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
    'https://images.unsplash.com/photo-1604313251413-4fd779a1fec9',
    'https://images.unsplash.com/photo-1603048588665-791ca8aea617',
    'https://images.unsplash.com/photo-1587593810167-a8597a8e2a8a',
    'https://images.unsplash.com/photo-1544025162-d76694265947',
    'https://images.unsplash.com/photo-1602489228247-320af6411f9d',
    'https://images.unsplash.com/photo-1516467508483-a7212febe31a',
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735',
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5',
    'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854',
    'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b',
    'https://images.unsplash.com/photo-1550583724-b2692b85b150',
    'https://images.unsplash.com/photo-1628088062854-d1870b4553da',
    'https://images.unsplash.com/photo-1486887396153-fa416525c108',
    'https://images.unsplash.com/photo-1528750901443-e986c702604e',
    'https://images.unsplash.com/photo-1542838132-92c53300491e',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b',
    'https://images.unsplash.com/photo-1506806732259-39c2d0268443'
  ];
  return defaultSeeds.some(seed => cleanUrl.includes(seed));
}
