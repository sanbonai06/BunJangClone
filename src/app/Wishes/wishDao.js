const insertWish = async (connection, userId, itemId) => {
    const insertWishQuery = `
        INSERT INTO wish(user_id, item_id)
        VALUES (?, ?);
        `;
    const [insertWishRows] = await connection.query(insertWishQuery, [userId, itemId]);
    return insertWishRows; 
}

const deleteWish = async (connection, userId, itemId) => {
    const deleteWishQuery = `
        DELETE
        FROM wish
        WHERE user_id = ? and item_id = ?;
        `;
    const [deleteWishRows] = await connection.query(deleteWishQuery, [userId, itemId]);
    return deleteWishRows;
}

const selectWish = async (connection, userId) => {
    const selectWishQuery = `
        SELECT wish.item_id, user.shop_name, user.image as 'shop_image', item.safety_pay, item.title, 
            item.price, item.created_at, image.image_path
        FROM wish, user, item
        INNER JOIN image
        ON image.item_id = item.item_id
        WHERE wish.user_id = ? and item.item_id = wish.item_id and user.user_id = item.user_id
        GROUP BY image.item_id;
        `;
    const [selectWishRows] = await connection.query(selectWishQuery, userId);
    return selectWishRows;
}

const selectWishByItem = async (connection, userId, itemId) => {
    const selectWishByItemQuery = `
        SELECT wish.user_id, wish.item_id
        FROM wish
        WHERE wish.user_id = ? and wish.item_id = ? and status = 1;
        `;
    const [selectWishByItemRows] = await connection.query(selectWishByItemQuery, [userId, itemId]);
    return selectWishByItemRows;
}

const selectItemInfo = async (connection, itemId) => {
    const selectItemInfoQuery = `
        SELECT item.user_id
        FROM item
        WHERE item.item_id = ${itemId};
        `;
    const [selectItemInfoRows] = await connection.query(selectItemInfoQuery);
    return selectItemInfoRows;
}
module.exports = {
    insertWish,
    deleteWish,
    selectWish,
    selectWishByItem,
    selectItemInfo,
};
