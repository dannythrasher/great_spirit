// server.js

// BASE SETUP
// ============================================================================

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/great_spirit');

var Liquor     = require('./app/models/liquor');

// call the packages we need
var express    = require('express');          // call express
var app        = express();                   // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;          // set our PORT

// ROUTES FOR OUR API
// ============================================================================
var router = express.Router();                //  get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening');
    next();  //make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!'});
});

// more routes for our API will happen here

// on routes that end in /liquors
router.route('/liquors')

    // create a liquor (accessed at POST http://localhost:8080/api/liquors)
    .post(function(req, res) {

       var liquor = new Liquor();           // create a new instance of the Liquor model
       liquor.name = req.body.name;         // set the liquors name (comes from the request)
       liquor.type = req.body.type;         // set the liquors type
       liquor.description = req.body.description;  // set the liquors description
       liquor.comments = req.body.comments;  // add comments about the liquor
       liquor.ranking = req.body.ranking;    // rank the liquor
       liquor.imgUrl = req.body.imgUrl;      // show an image of the liquor
       // save the liquor and check for errors
       liquor.save(function(err) {
           if (err)
               res.send(err);

           res.json({ message: 'Liquor created!'});
         });
       })

    // get all the liquors (accessed at GET http://localhost:8080/api/liquors)
    .get(function(req, res) {
        Liquor.find(function(err, liquors) {
              if (err)
                  res.send(err);

              res.json(liquors);
       });
    });

// on all routes that end in /liquors/:liquor_id
// ==========================================================================
router.route('/liquors/:liquor_id')

    // get the liquor with that id (accessed at GET http://localhost:8080/api/liquors/:liquor_id)
    .get(function(req, res){
        Liquor.findById(req.params.liquor_id, function(err, liquor) {
              if (err)
                  res.send(err)
              res.json(liquor);
        });
    })

    // update the liquor with this id (accessed at PUT http://localhost:8080/api/liquors/:liquor_id)
    .put(function(req, res){

        // use our liquor model to find the liquor we want
        Liquor.findById(req.params.liquor_id, function(err, liquor) {
              if (err)
                  res.send(err)

              liquor.name = req.body.name;  // update the liquors info

              // save the liquor
              liquor.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Liquor updated!'});
              });
        });
    })

    // delete the liquor with this id (accessed at DELETE http://localhost:8080/api/liquors/:liquor_id)
    .delete(function(req, res) {
        Liquor.remove({
              _id: req.params.liquor_id
        }, function(err, liquor) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted'});

        });
    });

// REGISTER OUR ROUTES ----------------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
