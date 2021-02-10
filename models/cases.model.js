const mongoose = require('mongoose');

//model of the data that is to be put into the database
var casesSchema = new mongoose.Schema({
    id: {
        type: String,
        required: 'This field is required.'
    },
    date: {
        type: String
    },
    cases: {
        type: Number
    },
    deaths: {
        type: Number
    },
    name_fr: {
        type: String
    },
    name_en: {
        type: String
    }
});


mongoose.model('Cases', casesSchema);