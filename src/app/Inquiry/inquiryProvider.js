const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const inquiryDao = require('./inquiryDao');

const getMyInquiry = async (inquiryId, userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectMyInquiryRow = await inquiryDao.selectMyInquiry(connection, inquiryId, userId);

    connection.release();
    return selectMyInquiryRow;
};

const getInquiry = async (itemId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectInquiryRow = await inquiryDao.selectInquiry(connection, itemId);

    connection.release();
    return selectInquiryRow;
};

module.exports = {
    getMyInquiry,
    getInquiry,
};
