
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Cases = mongoose.model('Cases');

//default route
router.get('/', (req, res) => {
    res.render("cases/addOrEdit", {
        viewTitle: "Insert Cases"
    });
});

//whether or not to show updating a record or inserting a new record
router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

//function to insert new record
function insertRecord(req, res) {
    var cases = new Cases();
    cases.id = req.body.id;
    cases.date = req.body.date;
    cases.cases = req.body.cases;
    cases.deaths = req.body.deaths;
    cases.name_fr = req.body.name_fr;
    cases.name_en = req.body.name_en;
    cases.save((err, doc) => {
        if (!err){
            res.redirect('cases/list');
        }
        else {
             console.log('Error during record insertion : ' + err);
        }
    });
}
//function to update record
function updateRecord(req, res) {
    Cases.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('cases/list'); }
        else {
        console.log('Error during record update : ' + err);
        }
    });
}

//Rendering a list of everything in the databse
router.get('/list', (req, res) => {
    Cases.find((err, docs) => {
        if (!err) {
            res.render("cases/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving cases list :' + err);
        }
    });
});

//used to find a specific case by its id
router.get('/:id', (req, res) => {
    Cases.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("cases/addOrEdit", {
                viewTitle: "Update Cases",
                cases: doc
            });
        }
    });
});

//used to delete a specific case by its id
router.get('/delete/:id', (req, res) => {
    Cases.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/cases/list');
        }
        else { console.log('Error in cases delete :' + err); }
    });
});


module.exports = router;