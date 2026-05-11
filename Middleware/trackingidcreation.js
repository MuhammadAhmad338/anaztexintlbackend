const { nanoid } = require("nanoid");

function generateTrackingNumber(country = "UK") {
  return `${country}-${Date.now().toString(36).toUpperCase()}-${nanoid(6).toUpperCase()}`;
}

module.exports = { generateTrackingNumber };