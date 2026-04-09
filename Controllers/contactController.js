const Contact = require("../Models/contactModel");

// @desc    Submit a contact form
// @route   POST /api/contacts
// @access  Public
exports.submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const newContact = await Contact.create({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully!",
      data: newContact,
    });
  } catch (error) {
    console.error("Error in submitContactForm:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Please try again later.",
      error: error.message,
    });
  }
};

// @desc    Get all contact messages (for admin)
// @route   GET /api/contacts
// @access  Private/Admin (Placeholder for now)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
