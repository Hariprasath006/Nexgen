const fs = require('fs');

const content = fs.readFileSync('../frontend/src/assets/assets.js', 'utf8');

const regex = /name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*price:\s*(\d+),\s*offerPrice:\s*(\d+),\s*image:\s*\[([\s\w,]+)\]/g;

let match;
const products = [];
while ((match = regex.exec(content)) !== null) {
  const images = match[5].split(',').map(i => i.trim()).filter(i => i);
  products.push({
    name: match[1],
    category: match[2],
    price: parseInt(match[3]),
    offerPrice: parseInt(match[4]),
    images: images
  });
}

console.log(`Parsed ${products.length} products!`);
console.log(products[0]);
