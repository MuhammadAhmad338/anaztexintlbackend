const trackingSchema = new mongoose.Schema({
  orderId: String,

  trackingNumber: {
    type: String,
    unique: true
  },

  currentStatus: String,

  courier: String,

  timeline: [
    {
      status: String,
      location: String,
      timestamp: Date
    }
  ]
});

const Tracking = mongoose.model("Tracking", trackingSchema);

module.exports = Tracking;