const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const reviewProvider = require('./reviewProvider');
const reviewDao = require('./reviewDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { connect } = require('http2');
const res = require('express/lib/response');
const { send } = require('process');

const createReview = async (postData, imageKey) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction(); // 트랜잭션 적용 시작

        const postReviewRow = await reviewDao.insertReview(connection, postData);
        const postReviewId = postReviewRow.insertId;
        const patchDealReviewedRow = await reviewDao.patchDealReviewed(connection, postData[0]);
        console.log(`#1 리뷰 등록 완료 : ${postReviewId}`);

        if (imageKey && imageKey.length > 0) {
            const postImageRow = await reviewDao.insertReviewImage(connection, imageKey, postReviewId);
            console.log(`#2 이미지 등록 완료 : ${JSON.stringify(postImageRow, null, 4)}`);
        }

        await connection.commit();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createReview Service error\n: ${err.message}`);
        await conn.rollback(); // 롤백
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

const updateReview = async (dealId, userId, rank, content) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const updateReviewRow = await reviewDao.updateReview(connection, dealId, userId, rank, content);

        connection.release();
        console.log(`${userId}번 회원님이 ${dealId}번 거래에 등록된 후기를 수정하셨습니다.`);
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - updateReview Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

const deleteReview = async (dealId) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteReviewRow = await reviewDao.deleteReview(connection, dealId);
        console.log(deleteReviewRow);

        if (deleteReviewRow.affectedRows == 1) {
            console.log(`${dealId}번 거래에 등록된 후기를 삭제하셨습니다.`);
            return response(baseResponse.SUCCESS);
        } else if (deleteReviewRow.affectedRows == 0) {
            return errResponse(baseResponse.INVALID_DEAL);
        }

        connection.release();
    } catch (err) {
        logger.error(`App - deleteReview Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

const postComment = async (reviewId, comment) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postCommentRow = await reviewDao.insertComment(connection, reviewId, comment);
        console.log(`${reviewId}번 리뷰에 대한 답변이 달렸습니다.`);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - postComment Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

const putComment = async (commentId, comment) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const putCommentRow = await reviewDao.updateComment(connection, commentId, comment);
        console.log(`${commentId}번 후기가 수정되었습니다.`);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - putComment Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

const deleteComment = async (commentId) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteCommentRow = await reviewDao.deleteComment(connection, commentId);
        console.log(`${commentId}번 후기가 삭제되었습니다.`);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - deleteComment Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
module.exports = {
    createReview,
    updateReview,
    deleteReview,
    postComment,
    putComment,
    deleteComment,
};
