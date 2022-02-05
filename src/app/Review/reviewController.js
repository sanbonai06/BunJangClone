const jwtMiddleware = require('../../../config/jwtMiddleware');
const reviewProvider = require('./reviewProvider');
const reviewService = require('./reviewService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

const regexEmail = require('regex-email');
const { emit } = require('nodemon');

/**
 * API No. 1
 * API Name : 후기 작성 api
 * [POST] /api/review/:dealId
 */
const postReview = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const dealId = req.params.dealId;
    const { rank, content } = req.body;
    const postImage = req.files;

    if (!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    // 만약에 이미 리뷰 쓴거면 바로 리턴
    const isReviewedRow = await reviewProvider.getIsReviewed(dealId);
    console.log(isReviewedRow);
    if (isReviewedRow[0].reviewed == 1) {
        console.log('이미 등록된 리뷰');
        return res.send(response(baseResponse.REVIEWED_DEAL));
    }

    const imageKey = [];
    if (postImage) {
        postImage.forEach((v) => {
            imageKey.push(v.key);
        });
    }

    const postData = [parseInt(dealId), userIdFromJWT, parseInt(rank), content];

    const createReviewResponse = await reviewService.createReview(postData, imageKey);
    return res.send(createReviewResponse);
};

/**
 * API No. 2
 * API Name : 후기 수정 api
 * [PUT] /api/review/:dealId
 */
const updateReview = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const { rank, content } = req.body;
    const dealId = req.params.dealId;

    if (!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const isReviewedRow = await reviewProvider.getIsReviewed(dealId);
    if (!isReviewedRow.length) {
        return res.send(response(baseResponse.ERROR_REVIEW));
    }

    const updateReviewResult = await reviewService.updateReview(dealId, userIdFromJWT, rank, content);

    return res.send(updateReviewResult);
};

/**
 * API No. 3
 * API Name : 후기 삭제 api
 * [PATCH] /api/review/:dealId
 */
const patchReview = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const dealId = req.params.dealId;

    if (!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const deleteReviewResult = await reviewService.deleteReview(dealId);
    return res.send(deleteReviewResult);
};

/**
 * API No. 4
 * API Name : 상점 후기 목록 api
 * [GET] /api/review/:userId/?limit=&offset=
 */
const getReviews = async (req, res) => {
    const userId = req.params.userId;
    const limit = req.query.limit;
    const offset = req.query.offset;
    if (!limit || !offset) {
        return res.send(response(baseResponse.QUERY_STRING_EMPTY));
    }
    const getReviewsResult = await reviewProvider.readReviews(parseInt(userId), parseInt(limit), parseInt(offset));
    return res.send(response(baseResponse.SUCCESS, getReviewsResult));
};

const createComment = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const reviewId = req.params.reviewId;
    const comment = req.body.comment;

    if (!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const readDealByReview = await reviewProvider.getDealByReview(reviewId);
    console.log(readDealByReview[0].seller_id);
    if(readDealByReview[0].seller_id != userIdFromJWT) {
        return res.send(response(baseResponse.ERROR_SELLER));
    }
    const createCommentResult = await reviewService.postComment(reviewId, comment);

    return res.send(createCommentResult);
}

const updateComment = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const commentId = req.params.commentId;
    const comment = req.body.comment;

    const readComment = await reviewProvider.getComment(commentId);

    if (!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    if(!readComment.length) {
        return res.send(response(baseResponse.ERROR_COMMENT));
    }
    const updateCommentResult = await reviewService.putComment(commentId, comment);

    return res.send(updateCommentResult);
}

const deleteComment = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const commentId = req.params.commentId;
    const readComment = await reviewProvider.getComment(commentId);

    if (!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    if(!readComment.length) {
        return res.send(response(baseResponse.ERROR_COMMENT));
    }
    const deleteCommentResult = await reviewService.deleteComment(commentId);

    return res.send(deleteCommentResult);
}
module.exports = {
    postReview,
    updateReview,
    patchReview,
    getReviews,
    createComment,
    updateComment,
    deleteComment,
};
