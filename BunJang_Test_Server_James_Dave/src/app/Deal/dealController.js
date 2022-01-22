const jwtMiddleware = require('../../../config/jwtMiddleware');
const dealProvider = require('./dealProvider');
const dealService = require('./dealService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

const regexEmail = require('regex-email');
const { emit } = require('nodemon');

const createDeal = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const itemId = req.params.itemId;
    const {deal_type, address, pay} = req.body;
    if(!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    if(deal_type === 0 && address != null) {
        return res.send(errResponse(baseResponse.ERROR_DEAL));
    }

    else if(deal_type === 1 && address == null) {
        return res.send(errResponse(baseResponse.ERROR_DEAL));
    }

    const readItemResult = await dealProvider.getItemInfo(itemId);

    if(readItemResult.length < 1) {
        return res.send(response(baseResponse.EMPTY_ITEM));
    }

    const readDealByItemIdResult = await dealProvider.getDealByItem(itemId);
    
    if(readDealByItemIdResult.length > 0) {
        return res.send(errResponse(baseResponse.ALREADY_PURCHASED_ITEM));
    }

    const sellerId = readItemResult[0].user_id;
    const createDealResult = await dealService.postDeal(itemId, userIdFromJWT, sellerId, deal_type, address, pay);
    const itemState = 'Reserved'
    const changeStateItemSaleResult = await dealService.changeStateItemSale(itemId, itemState);

    return res.send(createDealResult);
}

const readDealBuy = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    
    if(!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const readDealBuyResult = await dealProvider.getDealBuy(userIdFromJWT);

    return res.send(response(baseResponse.SUCCESS, readDealBuyResult));
}

const readDealSell = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    
    if(!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const readDealSellResult = await dealProvider.getDealSell(userIdFromJWT);

    return res.send(response(baseResponse.SUCCESS, readDealSellResult));
}

const approveDeal = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const itemId= req.params.itemId;
    if(!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
    const readDealByItemIdResult = await dealProvider.getDealByItem(itemId);

    if(readDealByItemIdResult[0].seller_id != userIdFromJWT) {
            return res.send(errResponse(baseResponse.ERROR_SELLER));
    }
    
    if(readDealByItemIdResult[0].process != 'Purchased') {
        return res.send(errResponse(baseResponse.ERROR_PROCESS));
    }

    

    const approveDealResult = await dealService.patchApproveDeal(itemId);


    return res.send(approveDealResult);
}

const confirmDeal = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const itemId= req.params.itemId;
    if(!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const readDealByItemIdResult = await dealProvider.getDealByItem(itemId);
    if(readDealByItemIdResult[0].buyer_id != userIdFromJWT) {
            return res.send(errResponse(baseResponse.ERROR_BUYER));
    }

    if(readDealByItemIdResult[0].process != 'Approved') {
        return res.send(errResponse(baseResponse.ERROR_PROCESS));
    }

    
    const confirmDealResult = await dealService.patchConfirmDeal(itemId);
    const itemState = 'Sold';
    const changeStateItemSaleResult = await dealService.changeStateItemSale(itemId, itemState);


    return res.send(confirmDealResult);
}
module.exports = {
    createDeal, // 1.결제하기 API
    readDealBuy,   // 2.구매내역 API
    readDealSell,   // 3. 판매내역 API
    approveDeal,    // 4. 판매승인 API
    confirmDeal,    // 5. 구매확정 API
};
