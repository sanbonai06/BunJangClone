const jwtMiddleware = require('../../../config/jwtMiddleware');
const inquiryProvider = require('./inquiryProvider');
const inquiryService = require('./inquiryService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

const regexEmail = require('regex-email');
const { emit } = require('nodemon');

const postInquiry = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const itemId = req.params.itemId;
    const { content } = req.body;

    const createInquiryResponse = await inquiryService.createInquiry(content, itemId, userIdFromJWT);
    return res.send(createInquiryResponse);
};

const deleteInquiry = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const inquiryId = req.params.inquiryId;
    console.log(userIdFromJWT);

    const getMyInquiry = await inquiryProvider.getMyInquiry(inquiryId, userIdFromJWT);
    if (getMyInquiry.length == 0) {
        return res.send(errResponse(baseResponse.ERROR_INQUIRY));
    }

    const deleteInquiryResponse = await inquiryService.deleteInquiry(inquiryId);
    return res.send(deleteInquiryResponse);
};

const getInquiry = async (req, res) => {
    const itemId = req.params.itemId;
    if (!itemId) {
        return res.send(errResponse(baseResponse.PATH_VARIABLE_EMPTY));
    }
    const getInquiryResponse = await inquiryProvider.getInquiry(itemId);
    return res.send(response(baseResponse.SUCCESS, getInquiryResponse));
};

module.exports = {
    postInquiry,
    deleteInquiry,
    getInquiry,
};
