const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");

require("dotenv").config();

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

dns.setDefaultResultOrder("ipv4first");

const app = express();

app.use(cors());
app.use(express.json());

// ================= ROUTES =================
const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const performanceRoutes = require("./routes/performance");
const testRoutes = require("./routes/tests");
const aiRoutes = require("./routes/aiRoutes");
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/ai", aiRoutes);
// ================= HOME =================

app.get("/", (req, res) => {
  res.send("PlacementProAI Server Running");
});

// ================= DATABASE =================

mongoose
  .connect(process.env.MONGO_URI, {
    family: 4,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
  });