require("dotenv").config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Food = require('./models/Food');

async function migrate() {
  const assetsPath = path.join(__dirname, '../frontend/src/assets/assets.js');
  const uploadsDir = path.join(__dirname, 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const content = fs.readFileSync(assetsPath, 'utf8');

  // 1. Build a mapping of Variable -> Filename
  const importRegex = /import\s+(\w+)\s+from\s+['"]\.\/(.*?)['"];?/g;
  const imageMap = {};
  let mapMatch;
  while ((mapMatch = importRegex.exec(content)) !== null) {
    imageMap[mapMatch[1]] = mapMatch[2]; // e.g. potato_image_1: "potato_image_1.png"
  }

  // 2. Extract the product objects
  const products = [];
  const structRegex = /name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*price:\s*(\d+),\s*offerPrice:\s*(\d+),\s*image:\s*\[([\s\w,]+)\]/g;
  let match;
  while ((match = structRegex.exec(content)) !== null) {
    const varNames = match[5].split(',').map(i => i.trim()).filter(i => i);
    // Find absolute filenames
    const filenames = varNames.map(v => imageMap[v]);

    products.push({
      name: match[1],
      category: match[2],
      price: parseInt(match[3]),
      offerPrice: parseInt(match[4]),
      filenames: filenames
    });
  }

  console.log(`Successfully parsed ${products.length} products from assets.js!`);
  
  // 3. Connect to MongoDB
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/amazon-snacks";
  await mongoose.connect(mongoUri);
  console.log(`Connected to Database!`);

  let addedCount = 0;
  let skippedCount = 0;

  // 4. Migrate and Copy
  for (let p of products) {
    const exists = await Food.findOne({ name: p.name });
    
    if (!exists) {
      const publicUrls = [];
      
      for (let file of p.filenames) {
        if (!file) continue;
        const sourceFile = path.join(__dirname, '../frontend/src/assets', file);
        const destFile = path.join(uploadsDir, file);
        
        // Copy physical image to backend
        if (fs.existsSync(sourceFile)) {
          fs.copyFileSync(sourceFile, destFile);
          publicUrls.push(`http://localhost:5000/uploads/${file}`);
        } else {
          console.log("Could not find image source:", sourceFile);
        }
      }

      // Hash-based deterministic ratings based on the name
      const nameHash = p.name.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
      const rating = ((Math.abs(nameHash) % 2) + 3.5).toFixed(1);
      const numReviews = (Math.abs(nameHash) % 400 + 20);

      await Food.create({
        name: p.name,
        category: p.category,
        price: p.price,
        offerPrice: p.offerPrice,
        image: publicUrls,
        description: "Fresh and premium quality. Guaranteed best price on the market.",
        stock: 50,
        rating: rating,
        numReviews: numReviews
      });

      console.log(`Added -> ${p.name}`);
      addedCount++;
    } else {
      skippedCount++;
      // console.log(`Skipped (Already exists) -> ${p.name}`);
    }
  }

  console.log(`\nMigration completed safely!`);
  console.log(`New Products Added: ${addedCount}`);
  console.log(`Previously Existing Skipped: ${skippedCount}\n`);
  
  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration Fatal Error:", err);
  process.exit(1);
});
