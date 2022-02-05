const insertInquiry = async (connection, content, itemId, userId) => {
    const insertInquiryQuery = `
    INSERT INTO inquiry(content, item_id, user_id)
    VALUES (?,?,?);
`;
    const [insertInquiryRows] = await connection.query(insertInquiryQuery, [content, itemId, userId]);
    return insertInquiryRows;
};

const selectMyInquiry = async (connection, inquiryId, userId) => {
    const selectMyInquiryQuery = `
    SELECT inquiry_id
    FROM inquiry
    WHERE inquiry_id = ? AND user_id = ? AND status = 1;
    `;
    const [selectMyInquiryRows] = await connection.query(selectMyInquiryQuery, [inquiryId, userId]);
    return selectMyInquiryRows;
};

const deleteInquiry = async (connection, inquiryId) => {
    const deleteInquiryQuery = `
    UPDATE inquiry
    SET status = 0
    WHERE inquiry_id = ?;
    `;
    const [deleteInquiryRows] = await connection.query(deleteInquiryQuery, inquiryId);
    return deleteInquiryRows;
};

const selectInquiry = async (connection, itemId) => {
    const selectInquiryQuery = `
    SELECT inquiry_id, user.shop_name, user.user_id, content, inquiry.created_at, user.image
    FROM inquiry
    INNER JOIN user
    on inquiry.user_id = user.user_id
    WHERE inquiry.status = 1 AND item_id = ?
    ORDER BY inquiry.created_at DESC;
    `;
    const [selectInquiryRows] = await connection.query(selectInquiryQuery, itemId);
    return selectInquiryRows;
};

module.exports = {
    insertInquiry,
    selectMyInquiry,
    deleteInquiry,
    selectInquiry,
};
