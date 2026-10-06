import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), "src/config/.env");
dotenv.config({ path: envPath });

import { dbConnected } from "../config/database.js";
import PersonalCategory from "../modules/personalCategory/personalCategoryModel.js";
const defaultCategories = [
  // Incoming categories
  "construction project",
  "property sale",
  "other businesses",
  // Outgoing categories
  "office expense",
  "home expense",
  "charity",
  "donation",
  "travelling",
];

const seedCategories = async () => {
  try {
    await dbConnected();

    let createdCount = 0;
    let skippedCount = 0;

    for (const categoryName of defaultCategories) {
      const normalizedName = categoryName.trim().toLowerCase();

      // Check if category already exists to avoid duplicate key errors
      const existingCategory = await PersonalCategory.findOne({
        name: normalizedName,
      });

      if (existingCategory) {
        skippedCount++;
        continue;
      }

      await PersonalCategory.create({
        name: normalizedName,
        isDefault: true,
      });

      createdCount++;
    }

    console.log("Categories Seeding Completed:");
    console.log(`- Created: ${createdCount}`);
    console.log(`- Skipped (already exist): ${skippedCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
