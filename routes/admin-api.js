const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const JWTVerifier = require('../modules/JWTVerifier');


const OAUTH_URL = "https://verify.fortellis.io/oauth2";
let verifier = new JWTVerifier(OAUTH_URL);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/**
 * Authenticate requests are from Fortellis using the Authorization header token
 */
router.use(async function(req, res, next) {
    if (!req.headers.authorization  || req.headers.authorization.split(' ')[0] !== 'Bearer') {
      return res.status(403).json({ code: 403, message: 'No Authorization header found!' });
    } 
    try {
        await verifier.verifyAccessToken(req.headers.authorization.split(' ')[1]);        
    } catch (err) {
        return res.status(401).json({code: 401, message: "Unauthorized"});
    }
    next();
});

router.post('/activate', (req, res, next) => {
    const { body = { } } = req;
    const entityInfo = body.entityInfo; //The information about the entity requesting the activation
    const solutionInfo = body.solutionInfo //The information about the solution requesting the activation
    const userInfo = body.userInfo; //The information about the user that is requesting the activation
    const apiInfo = body.apiInfo; //The information about the api the request is asking for a connection to
    const subscriptionId = body.subscriptionId; //The id that identifies this pairing of entity and solution
    const connectionId = body.connectionId; //The id that identifies this connection to an api within the subscription
    //Store the information about the activation request and perform any necessary actions to activate the connection.
    const response = {
        links: [
            {
                href: "http://example.com/deactivate",
                rel: "related",
                method: "POST"
            }
        ]
    };
    res.json(response);
});

router.post('/deactivate/:connectionId', (req, res, next) => {
    const { params: { connectionId } = { } } = req;
    //Deactivate the connection identified by connectionId
    const response = {
        links: [
            {
                href: "http://example.com/activate",
                rel: "related",
                method: "POST"
            }
        ]
    };
    res.json(response);
});

module.exports = router;