require('./models/db');
require('./controllers/casesController');

const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const casesController = require('./controllers/casesController');
const upload = require('express-fileupload')
const Cases = mongoose.model('Cases');
var app = express();

const csv = require('csv-parser');
const fs = require('fs');

var results = []; // stores the all the csv data into this array

app.use(upload())

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

//port to deploy the server
app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

//show the cases list route
app.use('/cases', casesController);

//default route
app.post('/', (req, res) => {
    if (req.files){
        console.log(req.files)
        var file = req.files.file
        var filename = file.name
        console.log(filename)

        file.mv('./uploads/' + filename, function (err){
            if (err){
                res.send(err)
            }else{
                try {  
  
                    fs.createReadStream('./uploads/' + filename)
                      .pipe(csv({}))
                      .on('data', (data) => {
                        results.push(data);
                      })
                      .on('end', () => {
                       for(var i = 0; i< results.length; i++){
                         var cases = new Cases();
                        cases.id = results[i].id;
                        cases.date = results[i].date;
                        cases.cases = results[i].cases;
                        cases.deaths = results[i].deaths;
                        cases.name_fr = results[i].name_fr;
                        cases.name_en = results[i].name_en; 
                        
                         cases.save((err, doc) => {
                            if (err){
                                 console.log('Error during record insertion : ' + err);
                            }
                        }); 
                       }
                      });
                    }
                    catch(error){
                      console.log(error);
                    }
                    
            }
        })
    }
    res.redirect(req.get('referer'));
})