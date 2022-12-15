/*This contains the code that handles the rest API endpoints for all campsites
and campsiteId.*/

const express = require('express');

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
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next(); //passes to next relevant routing method after this one
    })

    .get((req, res) => {
        res.end('Will send all the promotions to you');
    })

    .post((req, res) => {
        res.end(`Will add the promotion: ${req.body.name} with description: ${req.body.description}`);
    })

    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })

    .delete((req, res) => {
        res.end('Deleting all promotions');
    });

promotionRouter.route('/:promotionId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain')
        next();
    })

    .get((req, res) => {
        res.end(`Will send details of the promotion: ${req.params.promotionId} to you`);
    })

    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
    })

    .put((req, res) => {
        res.write(`Updating the promotion: ${req.params.promotionId}\n`);
        res.end(`Will update the promotion: ${req.body.name}
        with description: ${req.body.description}`);        
    })

    .delete((req, res) => {
        res.end(`Deleting: ${req.params.promotionId}`);
    });



module.exports = promotionRouter;