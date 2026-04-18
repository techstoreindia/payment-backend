const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto"); // ✅ NEW

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

// 🟢 NEW: Verify Payment API
app.post("/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", "3l0WPTFAUwg89akNriqMtuqq") // same key_secret
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({
        success: true,
        message: "Payment verified ✅"
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature ❌"
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
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
