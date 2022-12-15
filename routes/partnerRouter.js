/*This contains the code that handles the rest API endpoints for all campsites
and campsiteId.*/

const express = require('express');

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
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next(); //passes to next relevant routing method after this one
    })

    .get((req, res) => {
        res.end('Will send all the partners to you');
    })

    .post((req, res) => {
        res.end(`Will add the partner: ${req.body.name} with description: ${req.body.description}`);
    })

    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /partners');
    })

    .delete((req, res) => {
        res.end('Deleting all partners');
    });

partnerRouter.route('/:partnerId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain')
        next();
    })

    .get((req, res) => {
        res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
    })

    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
    })

    .put((req, res) => {
        res.write(`Updating the partner: ${req.params.partnerId}\n`);
        res.end(`Will update the partner: ${req.body.name}
        with description: ${req.body.description}`);        
    })

    .delete((req, res) => {
        res.end(`Deleting: ${req.params.partnerId}`);
    });



module.exports = partnerRouter;