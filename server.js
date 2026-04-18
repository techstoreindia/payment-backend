const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Razorpay keys (TEST MODE)
const razorpay = new Razorpay({
  key_id: "rzp_test_Sevhd81TySbeVV",
  key_secret: "3l0WPTFAUwg89akNriqMtuqq",
});

// 🟢 Create Order API
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // ₹ to paise
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
});

// 🟢 Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀v2");
});

// 🟢 Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
