const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const followDao = require('./followDao');

const getFollow = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getFollowRow = await followDao.selectFollow(connection, userId);

    connection.release();
    return getFollowRow;
}

const getCountFollower = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getCountFollowerRow = await followDao.countFollower(connection, userId);

    connection.release();
    return getCountFollowerRow;
}

const getItemByShop = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getItemByShopRow = await followDao.selectItemByShop(connection, userId);

    connection.release();
    return getItemByShopRow;
}

const getFollower = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getFollower = await followDao.selectFollower(connection, userId);
    
    connection.release();
    return getFollower;
}

const checkFollow = async (userId, toDelete) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkFollowResult = await followDao.checkFollow(connection, userId, toDelete);

    connection.release();
    return checkFollowResult;
}

const getBrand = async (brandId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getBrandRow = await followDao.selectBrand(connection, brandId);

    connection.release();
    return getBrandRow;
}

const checkBrandFollow = async (userId, brandId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkBrandFollowRow = await followDao.checkBrandFollow(connection, userId, brandId);

    connection.release();
    return checkBrandFollowRow;
}

const getBrandFollow = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getBrandFollowRow = await followDao.selectBrandFollow(connection, userId);

    connection.release();
    return getBrandFollowRow;
}

const getCountBrandItem = async (brandId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getCountBrandItemRow = await followDao.countBrandItem(connection, brandId);

    connection.release();
    return getCountBrandItemRow;
}

const getTotalBrand = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getTotalBrandRow = await followDao.selectTotalBrand(connection);

    connection.release();
    return getTotalBrandRow;
}
module.exports = {
    getFollow,  // 3. 상점 팔로잉 목록 API
    getCountFollower,
    getItemByShop,
    getFollower,
    checkFollow,
    getBrand,
    checkBrandFollow,
    getBrandFollow,
    getCountBrandItem,
    getTotalBrand,
};
