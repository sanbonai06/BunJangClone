const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const { getDealBuy } = require('../Deal/dealProvider');

const reviewDao = require('./reviewDao');

const getIsReviewed = async (dealId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const IsReviewedRow = await reviewDao.selectIsReviewed(connection, dealId);

    connection.release();
    return IsReviewedRow;
};

const readReviews = async (userId, limit, offset) => {
    const connection = await pool.getConnection(async (conn) => conn);

    const selectReviewsRow = await reviewDao.selectReviews(connection, userId, limit, offset);
    if (selectReviewsRow.length > 0) {
        selectReviewsRow.forEach((v) => {
            if (v.review_image) {
                const ri = v.review_image.split(',');
                v.review_image = ri;
            }
        });
    }
    console.log(selectReviewsRow);
    /* const reviewIdArray = [];
    if (selectReviewsRow.length > 0) {
        //리뷰id만 빼서 배열에 저장
        selectReviewsRow.forEach((v) => {
            reviewIdArray.push(v.review_id);
        });

        //리뷰id로 이미지들 가져옴
        const selectReviewImageRow = await reviewDao.selectReviewImage(connection, reviewIdArray);

        if (selectReviewImageRow.length > 0) {
            const exportObj = [];
            //이미지가 있는 리뷰ID들만 빼서 배열에 저장
            const ImageReviewIdArray = [];
            selectReviewImageRow.forEach((v) => {
                ImageReviewIdArray.push(v.review_id);
            });

            //하나의 리뷰에 속한 이미지들 묶어서 객체로 만듦.
            const imageReviewIdSet = new Set(ImageReviewIdArray);
            imageReviewIdSet.forEach((v) => {
                const images = { image: [] };
                selectReviewImageRow.forEach((w) => {
                    if (w.review_id == v) {
                        images.image.push({ image_id: w.review_image_id, image_path: w.image_path });
                    }
                });
                exportObj.push({ review_id: v, images: images });
            });

            //해당 리뷰ID가 있는 리뷰 객체에 넣어.
        }
    } */

    connection.release();
    return selectReviewsRow;
};

const getDealByReview = async (reviewId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getDealByReviewRow = await reviewDao.selectDealByReview(connection, reviewId);

    connection.release();
    return getDealByReviewRow;
}

const getComment = async (commentId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getCommentRow = await reviewDao.selectComment(connection, commentId);

    connection.release();
    return getCommentRow;
}
module.exports = {
    getIsReviewed, // 후기 작성된 거래 여부
    readReviews, // 상점 후기 목록
    getDealByReview,
    getComment,
};
