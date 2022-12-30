/*This contains the code that handles the rest API endpoints for all campsites
and campsiteId.*/

const { json } = require('express');
const express = require('express');
const Partner = require('../models/partner');
const authenticate = require('../authenticate');
const cors = require('./cors');


/*This creates an express router. It gives us an object name that we can use
with express routing methods.*/
const partnerRouter = express.Router();

/*We are going to chain the 5 methods together into a single chain. All the methods
share the same path, which is defined in server.js. We will chain all of them
to the route method, which is for the root level of the campsite routes. 
After the call to the route method, we will take app.all, remove the all part, and
chain them together.*/ 

/*We define the path in server.js*/
partnerRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Partner.find()
        .then(partners => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json(partners)
        })
        .catch(err => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Partner.create(req.body)
        .then(partner => {
            console.log('Partner Created:', partner)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json(partner)
        })
    .catch(err =>next(err))

    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /partners');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Partner.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
    });

partnerRouter.route('/:partnerId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Partner.findById(req.params.partnerId)
        .then(partner => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json(partner)
        })
        .catch(err => next(err));
        })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Partner.findById(req.params.partnerId, {
            $set: req.body
        }, { new: true })
        .then(partner => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner)
        })
        .catch(err => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Partner.findByIdAndDelete(req.params.partnerId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response)
        })
        .catch(err => next(err));
    });


module.exports = partnerRouter;