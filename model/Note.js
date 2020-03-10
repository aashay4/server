const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NoteSchema = Schema(
    {
        title: {type: String, required: true},
        body: {type: String, required: true},
        os: {type: String, required: true},
        company: {type: String, required: true},
        price: {type: String, required: true},
        imgpath: {type: String, required: true},
        purpose: {type: String, required: true},
        size: {type: String, required: true},
        twoinone: {type: String, required: true},
        amazonlink: {type: String, required: true},
        storage: {type: String, required: true},
        ram: {type: String, required: true},
        display: {type: String, required: true},
        processor: {type: String, required: true},
    },
    { timestamps: true }
);
module.exports = Note =mongoose.model('note', NoteSchema);
