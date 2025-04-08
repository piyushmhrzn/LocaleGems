const mongoose = require("mongoose");
const slugify = require("slugify");

const EventSchema = new mongoose.Schema({
    image: { type: String },
    destination_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Destination",
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
}, { timestamps: true });

// Generate slug before saving
EventSchema.pre("save", function (next) {
    if (this.isModified("name") || !this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

// Ensure slug updates when name changes
EventSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (update.name) {
        update.slug = slugify(update.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model("Event", EventSchema);