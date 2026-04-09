const express = require("express");
const router = express.Router();
const { submitContactForm, getAllContacts } = require("../Controllers/contactController");

// Public route to submit contact form
router.post("/", submitContactForm);
router.get("/", getAllContacts);

module.exports = router;
