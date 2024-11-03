const mongoose = require("mongoose");

const category_schema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    icon: {
        type: String,
    },
});

exports.Category = mongoose.model("Category", category_schema);
