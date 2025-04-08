const mongoose = require("mongoose");
const slugify = require("slugify");

const DestinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    image: { type: String },
    location: { type: String, required: true },
    coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    city: { type: String, required: true },
    country: { type: String, required: true },
    short_description: { type: String, required: true },
    long_description: { type: String, required: true },
}, { timestamps: true });

// Generate slug before saving
DestinationSchema.pre("save", function (next) {
    if (this.isModified("name") || !this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

// Ensure slug updates when name changes
DestinationSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (update.name) {
        update.slug = slugify(update.name, { lower: true, strict: true });
    }
    next();
});

DestinationSchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("Destination", DestinationSchema);