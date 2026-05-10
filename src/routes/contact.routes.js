import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

/* ================= TIME FORMAT ================= */
function formatTimeToAMPM(time) {
  if (!time) return "";

  let [hours, minutes] = time.split(":");
  hours = parseInt(hours);

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${minutes} ${ampm}`;
}

/* ================= ROUTE ================= */
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, message, type, date, time } = req.body;

    /* ================= VALIDATION ================= */
    if (type === "message") {
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }
    }

    if (type === "meeting") {
      if (!phone || !date || !time) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }
    }

    /* ================= SMTP TRANSPORT (OLD STABLE METHOD) ================= */
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    /* ================= EMAIL CONTENT ================= */
    let subject = "";
    let html = "";

    if (type === "message") {
      subject = "New Contact Message";

      html = `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `;
    }

    if (type === "meeting") {
      subject = "New Meeting Request";

      const formattedTime = formatTimeToAMPM(time);

      html = `
        <h3>New Meeting Request</h3>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${formattedTime}</p>
      `;
    }

    /* ================= SEND EMAIL ================= */
    await transporter.sendMail({
      from: `"Aplusmart Website" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
      subject,
      html,
    });

    return res.json({ success: true });
  } catch (error) {
    console.log("MAIL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Email sending failed",
    });
  }
});

export default router;