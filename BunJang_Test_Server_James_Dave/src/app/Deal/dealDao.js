const selectItemInfo = async (connection, itemId) => {
    const selectItemInfoQuery = `
        SELECT  user_id
        FROM item
        WHERE item_id = ? and status = 1;
        `;
    const [selectItemInfoRows] = await connection.query(selectItemInfoQuery, itemId);
    return selectItemInfoRows;
}

const insertDeal = async (connection, insertDealParams) => {
    const insertDealQuery = `
        INSERT INTO deal(item_id, buyer_id, seller_id, type, address, pay)
        VALUES (?, ?, ?, ?, ?, ?);
        `;
    const [insertDealRows] = await connection.query(insertDealQuery, insertDealParams);
    return insertDealRows;
}

const selectDealByItem = async (connection, itemId) => {
    const selectDealByItemQuery = `
        SELECT deal_id, process, buyer_id, seller_id
        FROM deal
        WHERE item_id = ? and status = 1;
        `;
    const [selectDealByItemRows] = await connection.query(selectDealByItemQuery, itemId);
    return selectDealByItemRows;
}

const selectDealBuy = async (connection, buyerId) => {
    const selectDealBuyQuery = `
        SELECT deal.deal_id, deal.seller_id, deal.created_at, deal.process, item.title, item.price, item.safety_pay, image.image_path
        FROM deal, item
        INNER JOIN image
        ON image.item_id = item.item_id
        WHERE deal.buyer_id = ? and item.item_id = deal.item_id
        GROUP BY image.item_id;
        `;
    const [selectDealBuyRows] = await connection.query(selectDealBuyQuery, buyerId);
    return selectDealBuyRows
}

const selectDealSell = async (connection, sellerId) => {
    const selectDealSellQuery = `
        SELECT item.item_id, item.title, item.price, item.sale, item.safety_pay, 
            item.created_at, image.image_path
        FROM item
        INNER JOIN image
        ON image.item_id = item.item_id
        WHERE item.user_id = ? and item.status = 1
        GROUP BY image.item_id;
        `;
    const [selectDealSellRows] = await connection.query(selectDealSellQuery, sellerId);
    return selectDealSellRows;
}

const updateApproveDeal = async (connection, itemId) => {
    const updateApproveDealQuery = `
        UPDATE deal
        SET process = 'Approved'
        WHERE item_id = ?;
        `;
    const [updateApproveDealRows] = await connection.query(updateApproveDealQuery, itemId);
    return updateApproveDealRows;
}

const updateConfirmDeal = async (connection, itemId) => {
    const updateConfirmDealQuery = `
        UPDATE deal
        SET process = 'Confirmed'
        WHERE item_id = ?;
        `;
    const [updateConfirmDealRows] = await connection.query(updateConfirmDealQuery, itemId);
    return updateConfirmDealRows;
}

const updateItemSale = async (connection, itemId, state) => {
    const updateItemSaleQuery = `
        UPDATE item
        SET sale = ?
        WHERE item_id = ?;
        `;
    const [updateItemSaleRow] = await connection.query(updateItemSaleQuery, [state, itemId]);
    return updateItemSaleRow;
}
module.exports = {
    selectItemInfo,
    insertDeal,
    selectDealByItem,
    selectDealBuy,
    selectDealSell,
    updateApproveDeal,
    updateConfirmDeal,
    updateItemSale
};
