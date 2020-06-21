
const {validParam, sendErrorResponse, sendSuccessResponse} = require('../../helpers/utility');
let router = require('express').Router();
let controller = require('./controller');

router.post('/receiveRequest', controller.receiveRequest);
router.post('/addAgent', controller.addAgent);


router.get('/requests', controller.requests);
router.get('/request', controller.request);

router.post('/createRequest', controller.createRequest);

router.put('/updateRequest', controller.updateRequest);

router.post('/deleteRequest', controller.deleteRequest);



module.exports = router;