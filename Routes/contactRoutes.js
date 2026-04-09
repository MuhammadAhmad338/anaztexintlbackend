const express = require("express");
const router = express.Router();
const { submitContactForm, getAllContacts } = require("../Controllers/contactController");
//hello
router.post("/", submitContactForm);
router.get("/", getAllContacts);

module.exports = router;
