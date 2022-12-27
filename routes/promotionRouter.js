/*This contains the code that handles the rest API endpoints for all campsites
and campsiteId.*/

const { json } = require('express');
const express = require('express');
const Partner = require('../models/partner');
const Promotion = require('../models/promotion');
const authenticate = require('../authenticate');

/*This creates an express router. It gives us an object name that we can use
with express routing methods.*/
const promotionRouter = express.Router();

/*We are going to chain the 5 methods together into a single chain. All the methods
share the same path, which is defined in server.js. We will chain all of them
to the route method, which is for the root level of the campsite routes. 
After the call to the route method, we will take app.all, remove the all part, and
chain them together.*/ 

/*We define the path in server.js*/
promotionRouter.route('/')
    .get((req, res, next) => {
        Promotion.find()
        .then(promotions => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain')
            res.json(promotions)
        })
        .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Promotion.create(req.body)
        .then(promotion => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain')
            res.json(promotion)
        })
        .catch(err => next(err));
    })

    .put(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Promotion.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json(response);
        })
        .catch(err => next(err));
    });

promotionRouter.route('/:promotionId')
    .get((req, res, next) => {
        Promotion.findById(req.params.promotionId)
        .then(promotion => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain')
            res.json(promotion)
        })
        .catch(err => next(err));
        })

    .post(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        Promotion.findById(req.params.promotionId, {
            $set: req.body
        },{ new: true})
        .then(promotion => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json(promotion)
        })
        .catch(err => next(err));
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Promotion.findByIdAndDelete(req.params.promotionId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json(response)
        })
        .catch(err => next(err));
    });

module.exports = promotionRouter;