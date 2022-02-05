const insertFollow = async (connection, userId, followUserId) => {
    const insertFollowQuery = `
        INSERT INTO follow(follow_from, follow_to)
        VALUES (?, ?);
        `;
    const [insertFollowRows] = await connection.query(insertFollowQuery, [userId, followUserId]);
    return insertFollowRows
}

const selectFollow = async (connection, userId) => {
    const selectFollowQuery = `
        SELECT follow.follow_to, user.shop_name
        FROM follow, user
        WHERE follow.follow_from = ? and user.user_id = follow.follow_to
        `;
    const [selectFollowRows] = await connection.query(selectFollowQuery, userId);
    return selectFollowRows;
}

const deleteFollow = async (connection, userId, toDelete) => {
    const deleteFollowQuery = `
        DELETE
        FROM follow
        WHERE follow_from = ? and follow_to = ?
        `;
    const [deleteFollowRows] = await connection.query(deleteFollowQuery, [userId, toDelete]);
    return deleteFollowRows;
}

const selectFolloingInfo = async (connection, userId) => {
    const selectFolloingInfoQuery = `
        SELECT count(title) as '상품개수', item.price
        FROM item
        WHERE item.user_id = ? and item.status = 1
        `;
    const [selectFolloingInfoRows] = await connection.query(selectFolloingInfoQuery, userId);
    return selectFolloingInfoRows;
}

const countFollower = async (connection, userId) => {
    const countFollowerQuery = `
        SELECT count(*) as countFollower
        FROM follow
        WHERE follow_to = ?;
        `;
    const [countFollowerRows] = await connection.query(countFollowerQuery, userId);
    return countFollowerRows;
}

const selectItemByShop = async (connection, userId) => {
    const selectItemByShopQuery = `
        SELECT item.item_id, item.price, image.image_path
        FROM item
        INNER JOIN image
        ON image.item_id = item.item_id
        WHERE item.user_id = ? and item.status = 1
        GROUP BY image.item_id
        LIMIT 3;
        `;
    const [selectItemByShopRows] = await connection.query(selectItemByShopQuery, userId);
    return selectItemByShopRows;
}

const selectFollower = async (connection, userId) => {
    const selectFollowerQuery = `
        SELECT follow.follow_from as user_id, user.shop_name, user.image,
            (select count(*) from item where item.user_id = follow.follow_from and item.status = 1) as countItem,
            (select count(*) from follow where follow.follow_to = user_id) as countFollower
        FROM follow, user
        WHERE follow.follow_to = ? and user.user_id = follow.follow_from;
        `;
    const [selectFollowerRows] = await connection.query(selectFollowerQuery, userId);
    return selectFollowerRows;
}

const checkFollow = async (connection, userId, toDelete) => {
    const checkFollowQuery = `
        SELECT follow_from, follow_to
        FROM follow
        WHERE follow_from = ? and follow_to = ?;
        `;
    const [checkFollowRows] = await connection.query(checkFollowQuery, [userId, toDelete]);
    return checkFollowRows;
}

const selectBrand = async (connection, brandId) => {
    const selectBrandQuery = `
        SELECT brand.name
        FROM brand
        WHERE brand_id = ? and status = 1;
        `;
    const [selectBrandRows] = await connection.query(selectBrandQuery, brandId);
    return selectBrandRows;
}

const insertBrandFollow = async (connection, userId, brandId) => {
    const insertBrandFollowQuery = `
        INSERT INTO brand_follow(user_id, brand_id)
        VALUES (?, ?);
        `;
    const [insertBrandFollowRows] = await connection.query(insertBrandFollowQuery, [userId, brandId]);
    return insertBrandFollowRows;
}

const checkBrandFollow = async (connection, userId, brandId) => {
    const checkBrandFollowQuery = `
        SELECT brand_id
        FROM brand_follow
        WHERE user_id = ? and brand_id = ? and status = 1;
        `;
    const [checkBrandFollowRows] = await connection.query(checkBrandFollowQuery, [userId, brandId]);
    return checkBrandFollowRows;
}

const deleteBrandFollow = async (connection, userId, brandId) => {
    const deleteBrandFollowQuery = `
        DELETE
        FROM brand_follow
        WHERE user_id = ? and brand_id = ?;
        `;
    const [deleteBrandFollowRows] = await connection.query(deleteBrandFollowQuery, [userId, brandId]);
    return deleteBrandFollowRows;
}

const selectBrandFollow = async (connection, userId) => {
    const selectBrandFollowQuery = `
        SELECT brand_follow.brand_id, brand.name
        FROM brand_follow, brand
        WHERE brand_follow.user_id = ? and brand.brand_id = brand_follow.brand_id and brand.status = 1;
        `;
    const [selectBrandFollowRows] = await connection.query(selectBrandFollowQuery, userId);
    return selectBrandFollowRows;
}

const countBrandItem = async (connection, brandId) => {
    const countBrandItemQuery = `
        SELECT count(*) as counterBrandItem
        FROM item
        WHERE item.brand_id = ? and item.status = 1;
        `;
    const [countBrandItemRows] = await connection.query(countBrandItemQuery, brandId);
    return countBrandItemRows;
}

const selectTotalBrand = async (connection) => {
    const selectTotalBrandQuery = `
        SELECT brand_id, name, 
            (select count(*) from item where item.brand_id = brand.brand_id and item.status = 1) as countItem
        FROM brand
        WHERE brand.status = 1;
        `;
    const [selectTotalBrandRows] = await connection.query(selectTotalBrandQuery);
    return selectTotalBrandRows;
}
module.exports = {
    insertFollow,   // 1. 상점 팔로우 API
    deleteFollow,   // 2. 상점 팔로우 취소 API
    selectFollow,   // 3. 상점 팔로잉 목록 API
    selectFolloingInfo,
    countFollower,
    selectItemByShop,
    selectFollower,
    checkFollow,
    selectBrand,
    insertBrandFollow,
    checkBrandFollow,
    deleteBrandFollow,
    selectBrandFollow,
    countBrandItem,
    selectTotalBrand,
};
