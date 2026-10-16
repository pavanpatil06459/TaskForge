
const Contact = require("../models/Contact");

exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields must be valid text.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    // Validate empty fields and length
    if (
      cleanName.length < 2 ||
      cleanName.length > 80 ||
      cleanSubject.length < 3 ||
      cleanSubject.length > 150 ||
      cleanMessage.length < 10 ||
      cleanMessage.length > 2000
    ) {
      return res.status(400).json({
        success: false,
        message: "Please check the length of your form fields.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      cleanEmail.length > 254 ||
      !emailRegex.test(cleanEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const contact = await Contact.create({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been submitted successfully!",
      contactId: contact._id,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your message. Please try again.",
    });
  }
};
