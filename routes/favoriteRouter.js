const { json } = require('express');
const express = require('express');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Favorite.find({user: req.user._id})
        .populate('user')
        .populate('campsites')
        .then(favorites => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        })
        .catch(err => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Favorite.findOne({
            user: req.user._id 
        })
        .then(favorite => {
            if (favorite) {
                req.body.forEach(fav => { //for each of the items of the request body, push it in
                if (!favorite.campsites.includes(fav._id)) {
                    favorite.campsites.push(fav._id)
                }
            })
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            } else {
                Favorite.create({ user: req.user._id})
                .then(favorite => {
                    req.body.forEach(fav => {
                            if (!favorite.campsites.includes(fav._id)) {
                                favorite.campsites.push(fav._id)
                            }
                    });
                    favorite.save()
                    .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
            })
            .catch(err => next(err));  
        })
        .catch(err => next(err));
    }
    }) .catch(err => next(err))
})
    
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Favorite.findOneAndDelete({user: req.user._id})
        .then(favorite => {
            res.statusCode = 200;
            if (favorite) {
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            } else {
                res.setHeader('Content-Type', 'text/plain');
                res.end('You do not have any favorites to delete.')
            }
        })
        .catch(err => next(err));
    });

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
 
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        // find the user collection
        Favorite.findOne({user: req.user._id})
        //start a response here
        .then(favorite => { 
            //if favorite exists
            if (favorite) {
                //if favorite doesnt exist, push the campsiteId into the array and save it
                if(!favorite.campsites.includes(req.params.campsiteId)) {
                    favorite.campsites.push(req.params.campsiteId)
                    favorite.save()
                    .then(favorite => {
                        res.statusCode =200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    .catch(err => next(err));
                // if it does exist, respond with it already exists! 
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('That campsite is already a favorite!');
                }
            //if favorite does not existat all, create one! in our syntax, a user has a id and a campsite
            } else { 
                Favorite.create({ 
                    user: req.user._id, 
                    campsites:[req.params.campsiteId] 
                }) // this has array brackets because we are only passing in that string. and in our model, we defined it as an array with brackets around it
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            }
        })
        .catch(err => next(err))
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Favorite.findOne({user: req.user._id})
        .then(favorite => {
            if (favorite) {
                const index = favorite.campsites.indexOf(req, params.campsiteId);
                if (index >= 0) {
                    favorite.campsites.splice(index, 1);
                }
                favorite.save()
                .then(favorite => {
                    console.log('Favorite Campsite Deleted!', favorite); 
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json(favorite);
                }).catch(err => next(err));
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('There are no favorites to delete!');
            }
        }) .catch(err => next(err));
    });


   
module.exports = favoriteRouter;
