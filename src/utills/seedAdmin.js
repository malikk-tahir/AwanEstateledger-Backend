import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), "src/config/.env");
dotenv.config({ path: envPath });
// dotenv.config({ path: "../config/.env" });

import { dbConnected } from "../config/database.js";
import User from "../modules/user/userModel.js";

const seedAdmin = async () => {
  try {
    await dbConnected();

    const adminEmail = process.env.ADMIN_EMAIL;
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(
        `User with email "${adminEmail}" already exists. Skipping seed.`,
      );
      process.exit(0);
    }

    const adminUser = await User.create({
      name: process.env.ADMIN_NAME,
      email: adminEmail,
      mobile_no: process.env.ADMIN_MOBILE_NO,
      password: process.env.ADMIN_PASSWORD,
    });

    console.log("Admin account created successfully:");
    console.log({
      name: adminUser.name,
      email: adminUser.email,
      phone: adminUser.mobile_no,
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin account:", error);
    process.exit(1);
  }
};

seedAdmin();
