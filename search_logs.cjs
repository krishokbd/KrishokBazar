const fs = require('fs');
const path = '/.gemini/antigravity/brain/a3be6b16-0f19-41ef-917c-364bac4d710c/.system_generated/logs/transcript.jsonl';
if (fs.existsSync(path)) {
  console.log('Log file exists!');
  const content = fs.readFileSync(path, 'utf8');
  console.log('Log size:', content.length);
  
  // Find "Cow Milk" or "Duck Eggs" or "https://cdn.shopify.com"
  const idx = content.indexOf('Cow Milk');
  if (idx !== -1) {
    console.log('Found Cow Milk around index:', idx);
    console.log(content.slice(idx - 1000, idx + 2000));
  } else {
    console.log('Did not find "Cow Milk"');
    // Let's print some lines of the log
    const lines = content.split('\n');
    console.log('Total log lines:', lines.length);
    for (let i = 0; i < Math.min(5, lines.length); i++) {
       console.log(`Line ${i}:`, lines[i].slice(0, 200));
    }
  }
} else {
  console.log('No log file found at path');
}
