/*This contains the code that handles the rest API endpoints for all campsites
and campsiteId.*/

const express = require('express');
const Campsite = require('../models/campsite');

/*This creates an express router. It gives us an object name that we can use
with express routing methods.*/
const campsiteRouter = express.Router();

/*We are going to chain the 5 methods together into a single chain. All the methods
share the same path, which is defined in server.js. We will chain all of them
to the route method, which is for the root level of the campsite routes. 
After the call to the route method, we will take app.all, remove the all part, and
chain them together.*/ 

/*We define the path in server.js*/
campsiteRouter.route('/')
    .get((req, res, next) => {
        Campsite.find()
        .then(campsites => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsites);
        })
        .catch(err => next(err));
    })

    .post((req, res, next) => {
        Campsite.create(req.body)
        .then(campsite => {
            console.log('Campsite Created ', campsite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite);
        })
        .catch(err =>next(err))
    })

    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /campsites');
    })

    .delete((req, res, next) => {
        Campsite.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
    });

campsiteRouter.route('/:campsiteId')

    .get((req, res, next) => {
        Campsite.findById(req.params.campsiteId)
        .then(campsite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite)
        })
        .catch(err => next(err));
    })

    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
    })

    .put((req, res, next) => {
        Campsite.findById(req.params.campsiteId, {
            $set: req.body
        }, { new: true})
        .then(campsite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite)
        })
        .catch(err => next(err));
    })

    .delete((req, res, next) => {
        Campsite.findByIdAndDelete(req.params.campsiteId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response)
        })
        .catch(err => next(err));
    });



module.exports = campsiteRouter;