const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const dealDao = require('./dealDao');

const getItemInfo = async (itemId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getItemInfoRow = await dealDao.selectItemInfo(connection, itemId);

    connection.release();
    return getItemInfoRow;
}

const getDealByItem = async (itemId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getDealRow = await dealDao.selectDealByItem(connection, itemId);
    connection.release();
    return getDealRow;
}

const getDealBuy = async (buyerId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getDealBuyRow = await dealDao.selectDealBuy(connection, buyerId);

    connection.release();
    return getDealBuyRow;
}

const getDealSell = async (sellerId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getDealSell = await dealDao.selectDealSell(connection, sellerId);

    connection.release();
    return getDealSell;
}

const getSellItem = async (sellerId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getSellItemRow = await dealDao.selectSellItem(connection, sellerId);

    connection.release();
    return getSellItemRow;
}
module.exports = {
    getItemInfo,
    getDealByItem,
    getDealBuy,
    getDealSell,
    getSellItem
};
