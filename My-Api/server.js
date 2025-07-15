import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

app.post("/payment-process", (req, res) => {
  const { plan, cardNumber, expiry, cvv, planName, planPrice } = req.body;
  if (!cardNumber || !expiry || !cvv || !planName || !planPrice) {
    return res
      .status(400)
      .json({ success: false, message: "Missing payment details" });
  }

  if (cardNumber.endsWith("999")) {
    return res.status(200).json({
      success: true,
      message: `Payement for ${planName}(${planPrice}) is succesfull`,
      transactionId: `TRN${cardNumber}_${Math.abs(hashcode(planName))}`,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Payment failed. Please try another card",
    });
  }
});

function hashcode(s) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
