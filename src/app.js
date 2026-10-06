import express from "express";
const app = express();
import error from "./middleware/error.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import constructionRoutes from "./modules/construction/constructionRoutes.js";
import constructionLedgerRoutes from "./modules/constructionLedger/constructionLedgerRoutes.js";
import propertyRoutes from "./modules/property/propertyRoutes.js";
import societyRoutes from "./modules/society/societyRoutes.js";
import workerRoutes from "./modules/worker/workerRoutes.js";
import userRoutes from "./modules/user/userRoutes.js";
import paymentRoutes from "./modules/payments/paymentRoutes.js";
import installmentRoutes from "./modules/installement/installementRoutes.js";
import personalCategoryRoutes from "./modules/personalCategory/personalCategoryRoutes.js";
import personalTransactionRoutes from "./modules/personalTransaction/personalTransactionRoutes.js";

const allowedOrigins = [
  process.env.FRONTEND_URL || "https://ledger.awanrealestate.com",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/constructions", constructionRoutes);
app.use("/api/v1/construction-ledgers", constructionLedgerRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/societies", societyRoutes);
app.use("/api/v1/workers", workerRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/installements", installmentRoutes);
app.use("/api/v1/personalcategories", personalCategoryRoutes);
app.use("/api/v1/personaltransactions", personalTransactionRoutes);

app.use(error);
export default app;
