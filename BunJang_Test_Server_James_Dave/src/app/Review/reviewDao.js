const insertReview = async (connection, postData) => {
    const insertReviewQuery = `
                INSERT INTO review(deal_id, buyer_id, review.rank, content)
                VALUES (?,?,?,?);
    `;
    const [insertReviewRows] = await connection.query(insertReviewQuery, postData);
    return insertReviewRows;
};

const insertReviewImage = async (connection, imageKey, review_id) => {
    const arr = [];
    imageKey.forEach((v) => {
        const param = `('${v}',${review_id})`;
        arr.push(param);
    });
    const params = arr.join(',');
    console.log(params);

    const insertReviewImageQuery = `
                INSERT INTO review_image(image_path, review_id)
                VALUES ${params};
    `;
    const [insertReviewImageRows] = await connection.query(insertReviewImageQuery);
    return insertReviewImageRows;
};

const selectIsReviewed = async (connection, dealId) => {
    const selectIsReviewedQuery = `
                SELECT reviewed
                FROM deal
                WHERE deal.deal_id = ?;
    `;
    const [selectIsReviewedRows] = await connection.query(selectIsReviewedQuery, dealId);
    return selectIsReviewedRows;
};

const patchDealReviewed = async (connection, dealId) => {
    const patchDealReviewedQuery = `
                UPDATE deal
                SET deal.reviewed = 1
                WHERE deal.deal_id = ?;
    `;
    const [patchDealReviewedRows] = await connection.query(patchDealReviewedQuery, dealId);
    return patchDealReviewedRows;
};

const updateReview = async (connection, dealId, userId, rank, content) => {
    console.log(rank, content, userId, dealId);
    const updateReviewQuery = `
                UPDATE review
                SET review.rank = ?, content = ?
                WHERE review.buyer_id = ? and review.deal_id = ?;
                 `;
    const [updateReviewRows] = await connection.query(updateReviewQuery, [rank, content, userId, dealId]);
    return updateReviewRows;
};

const deleteReview = async (connection, dealId) => {
    const deleteReviewQuery = `
        UPDATE review
        SET status = 0
        WHERE deal_id = ?;
        `;
    const [deleteReviewRows] = await connection.query(deleteReviewQuery, dealId);
    return deleteReviewRows;
};

const selectReviews = async (connection, userId, limit, offset) => {
    const selectReviewsQuery = `
    SELECT review.review_id, review.rank, review.content, user.user_id, user.shop_name, user.image as user_image, deal.item_id, review.created_at, GROUP_CONCAT(review_image.image_path) as review_image
    FROM review
    INNER JOIN deal
    ON deal.deal_id = review.deal_id
    INNER JOIN user
    ON user.user_id = deal.buyer_id
    LEFT JOIN review_image
    ON review_image.review_id = review.review_id
    WHERE deal.seller_id = ? AND review.status = 1
    LIMIT ?
    OFFSET ?;
    `;
    const [selectReviewsRows] = await connection.query(selectReviewsQuery, [userId, limit, offset]);
    return selectReviewsRows;
};

const selectReviewImage = async (connection, reviewIdArray) => {
    const array = reviewIdArray.join(',');
    const selectReviewImageQuery = `
            SELECT review_id, review_image_id, review_image.image_path
            FROM review_image
            WHERE review_id in (${array}) AND status = 1;
    `;
    const [selectReviewImageRows] = await connection.query(selectReviewImageQuery);
    return selectReviewImageRows;
};

const selectDealByReview = async (connection, reviewId) => {
    const selectDealByReviewQuery = `
            SELECT deal.seller_id
            FROM deal
            WHERE deal.deal_id = (SELECT review.deal_id FROM review WHERE review.review_id = ?)
            `;
    const [selectDealByReviewRows] = await connection.query(selectDealByReviewQuery, reviewId);
    return selectDealByReviewRows;
};

const insertComment = async (connection, reviewId, comment) => {
    const insertCommentQuery = `
            INSERT INTO review_comment(review_id, content)
            VALUES (?, ?);
            `;
    const [insertCommentRows] = await connection.query(insertCommentQuery, [reviewId, comment]);
    return insertCommentRows;
};

const selectComment = async (connection, commentId) => {
    const selectCommentQuery = `
            SELECT *
            FROM review_comment
            WHERE comment_id = ?;
            `;
    const [selectCommentRows] = await connection.query(selectCommentQuery, commentId);
    return selectCommentRows;
};

const updateComment = async (connection, commentId, comment) => {
    const updateCommentQuery = `
            UPDATE review_comment
            SET content = ?
            WHERE comment_id = ?;
            `;
    const [updateCommentRows] = await connection.query(updateCommentQuery, [comment, commentId]);
    return updateCommentRows;
};

const deleteComment = async (connection, commentId) => {
    const deleteCommentQuery = `
            UPDATE review_comment
            SET status = 0
            WHERE comment_id = ?;
            `;
    const [deleteCommentRows] = await connection.query(deleteCommentQuery, commentId);
    return deleteCommentRows;
};
module.exports = {
    insertReview, // 리뷰 등록
    insertReviewImage, // 리뷰 이미지 등록
    selectIsReviewed, // 리뷰된 거래 확인
    patchDealReviewed, // 리뷰한 거래로 바꾸기
    updateReview, // 후기 수정
    deleteReview, // 후기 삭제
    selectReviews, //후기 목록
    selectReviewImage, //후기 이미지
    selectDealByReview,
    insertComment,
    selectComment,
    updateComment,
    deleteComment,
};
