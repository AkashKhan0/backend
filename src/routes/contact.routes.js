import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

function formatTimeToAMPM(time) {
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours);

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${minutes} ${ampm}`;
}

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, message, type, date, time } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let emailContent = "";

    if (type === "message") {
      emailContent = `
        New Contact Message:
        Name: ${name}
        Phone: ${phone}
        Email: ${email}
        Message: ${message}
      `;
    }

    if (type === "meeting") {

      const formattedTime = formatTimeToAMPM(time);

      emailContent = `
        New Meeting Request:
        Phone: ${phone}
        Date: ${date}
        Time: ${formattedTime}
      `;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject:
        type === "message"
          ? "New Contact Form Submission"
          : "New Meeting Request",
      text: emailContent,
    });

    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
});

export default router;
