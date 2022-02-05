const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const wishDao = require('./wishDao');

const getWish = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getWishRows = await wishDao.selectWish(connection, userId);

    connection.release();
    return getWishRows;
};

const getWishByItem = async (userId, itemId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getWishRows = await wishDao.selectWishByItem(connection, userId, itemId);
    
    connection.release();
    return getWishRows;
}

const getItemInfo = async (itemId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getItemRow = await wishDao.selectItemInfo(connection, itemId);

    connection.release();
    return getItemRow;
}
module.exports = {
    getWish, // 3. 상품 찜 목록 가져오기
    getWishByItem,
    getItemInfo,
};
