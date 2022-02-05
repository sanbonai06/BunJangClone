const selectBrand = async (connection, brandName) => {
    const selectBrandQuery = `
            SELECT brand_id, name
            FROM brand
            WHERE name = ?;
    `;
    const [brandRows] = await connection.query(selectBrandQuery, brandName);
    return brandRows;
};

const insertItem = async (connection, postData) => {
    const insertItemQuery = `
            INSERT INTO item(item.user_id, item.category_id, item.title, item.location, item.price, item.delivery_fee_included,
                 item.count, item.condition, item.exchange, item.detail, item.safety_pay, item.brand_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [insertItemRows] = await connection.query(insertItemQuery, postData);
    return insertItemRows;
};

const updateItem = async (connection, postData) => {
    const updateItemQuery = `
        UPDATE item
        SET item.user_id = ?, item.category_id = ?, item.title = ?, item.location = ?, item.price = ?, item.delivery_fee_included = ?,
        item.count = ?, item.condition = ?, item.exchange = ?, item.detail = ?, item.safety_pay = ?, item.brand_id = ?
        WHERE item_id = ?;
        `;
    const [updateItemRow] = await connection.query(updateItemQuery, postData);
    return updateItemRow;
};

const selectTag = async (connection, tagName) => {
    const selectTagQuery = `
            SELECT tag_id, tag_name
            FROM tag
            WHERE tag_name = ? AND tag.status = 1;
    `;
    const [tagRows] = await connection.query(selectTagQuery, tagName);
    return tagRows;
};

const insertTag = async (connection, tagName) => {
    const insertTagQuery = `
            INSERT INTO tag(tag_name)
            VALUES (?);
    `;
    const [insertTagRows] = await connection.query(insertTagQuery, tagName);
    return insertTagRows;
};

const insertItemTag = async (connection, item_id, tag_id) => {
    const insertItemTagQuery = `
            INSERT INTO item_tag(item_id, tag_id)
            VALUES (?, ?);
    `;
    const [insertItemTagRows] = await connection.query(insertItemTagQuery, [item_id, tag_id]);
    return insertItemTagRows;
};
const insertItemImage = async (connection, imageKey, item_id) => {
    const arr = [];
    imageKey.forEach((v) => {
        const param = `('${v}',${item_id})`;
        arr.push(param);
    });
    const params = arr.join(',');
    console.log(params);

    const insertItemImageQuery = `
                INSERT INTO image(image_path, item_id)
                VALUES ${params};
    `;
    const [insertItemImageRows] = await connection.query(insertItemImageQuery);
    return insertItemImageRows;
};

const deleteItemTag = async (connection, itemId) => {
    const deleteItemTagQuery = `
                DELETE FROM item_tag
                WHERE item_id = ?;
    `;
    const [deleteItemTagRow] = await connection.query(deleteItemTagQuery, itemId);
    return deleteItemTagRow;
};

const deleteItemImage = async (connection, itemId) => {
    const deleteItemImageQuery = `
                UPDATE image
                SET status = 0
                WHERE item_id = ?;
    `;
    const [deleteItemImageRow] = await connection.query(deleteItemImageQuery, itemId);
    return deleteItemImageRow;
};

const deleteItemInquiry = async (connection, itemId) => {
    const deleteItemInquiryQuery = `
    UPDATE inquiry
    SET status = 0
    WHERE item_id = ?;
    `;
    const [deleteItemInquiryRows] = await connection.query(deleteItemInquiryQuery, itemId);
    return deleteItemInquiryRows;
};

const deleteItem = async (connection, itemId) => {
    const deleteItemQuery = `
                UPDATE item
                SET status = 0
                WHERE item_id = ?;
    `;
    const [deleteItemRow] = await connection.query(deleteItemQuery, itemId);
    return deleteItemRow;
};

const setItemSale = async (connection, itemId, sale) => {
    const setItemSaleQuery = `
                UPDATE item
                SET sale = ?
                WHERE item_id = ?;
    `;
    const [setItemSaleRow] = await connection.query(setItemSaleQuery, [sale, itemId]);
    return setItemSaleRow;
};

const selectItemWishes = async (connection, itemId) => {
    const selectItemWishesQuery = `
                SELECT user.user_id, user.shop_name, user.image
                FROM wish
                INNER JOIN user
                on user.user_id  = wish.user_id AND user.status = 1
                WHERE item_id = ? AND wish.status = 1;
    `;
    const [itemWishesRows] = await connection.query(selectItemWishesQuery, itemId);
    return itemWishesRows;
};

const selectItemsByCount = async (connection, limit, offset) => {
    const selectItemsByCountQuery = `
                SELECT item.item_id, item.title, item.price, item.safety_pay, item.location, item.created_at, image.image_path, (select count(*) from wish where wish.item_id = item.item_id) wish_count
                FROM item
                INNER JOIN image
                on image.item_id = item.item_id
                WHERE item.status = 1
                GROUP BY image.item_id
                ORDER BY item.view DESC
                LIMIT ?
                OFFSET ?;
    `;
    const [itemsByCountRows] = await connection.query(selectItemsByCountQuery, [limit, offset]);
    return itemsByCountRows;
};

const parentCategoryCheck = async (connection, category_id) => {
    const parentCategoryCheckQuery = `
                SELECT parent_id
                FROM category
                WHERE category_id = ?;
    `;
    const [parentCategoryCheckRows] = await connection.query(parentCategoryCheckQuery, category_id);
    return parentCategoryCheckRows;
};

const selectChildCategoryId = async (connection, category_id) => {
    const selectChildCategoryIdQuery = `
                SELECT category_id
                FROM category
                WHERE parent_id = ?;
    `;
    const [selectChildCategoryIdRows] = await connection.query(selectChildCategoryIdQuery, category_id);
    return selectChildCategoryIdRows;
};

const selectItemsByCategory = async (connection, categoryIdArray, limit, offset) => {
    const array = categoryIdArray.join(',');
    const selectItemsByCategoryQuery = `
                SELECT item.item_id, item.title, item.price, item.safety_pay, item.location, item.created_at, image.image_path, (select count(*) from wish where wish.item_id = item.item_id) wish_count
                FROM item
                INNER JOIN image
                on image.item_id = item.item_id
                WHERE category_id IN (${array}) AND item.status = 1 AND item.sale = "Sale"
                GROUP BY image.item_id
                ORDER BY item.view DESC
                LIMIT ?
                OFFSET ?;
    `;
    const [itemsByCategoryRows] = await connection.query(selectItemsByCategoryQuery, [limit, offset]);
    return itemsByCategoryRows;
};

const selectItemsByBrand = async (connection, brand_id, limit, offset) => {
    const selectItemsByBrandQuery = `
                SELECT item.item_id, item.title, item.price, item.safety_pay, item.location, item.created_at, image.image_path, (select count(*) from wish where wish.item_id = item.item_id) wish_count
                FROM item
                INNER JOIN image
                on image.item_id = item.item_id
                WHERE brand_id = ? AND item.status = 1 AND item.sale = "Sale"
                GROUP BY image.item_id
                ORDER BY item.view DESC
                LIMIT ?
                OFFSET ?;
    `;
    const [itemsByBrandRows] = await connection.query(selectItemsByBrandQuery, [brand_id, limit, offset]);
    return itemsByBrandRows;
};

const selectItemInfo = async (connection, itemId) => {
    const selectItemInfoQuery = `
                SELECT  (select count(*) from wish where wish.item_id = item.item_id AND wish.status = 1) wish_count,
                        (select count(*) from inquiry where inquiry.item_id = ${itemId} AND inquiry.status = 1) inquiry_count,
                        (select count(*) from follow where follow_to = user.user_id AND follow.status = 1) follower_count,
                        (select count(*) from item where item.user_id = user.user_id AND item.status = 1) item_count,
                        item.price, item.title, item.safety_pay, item.created_at, item.view,  item.condition, item.delivery_fee_included,
                        item.count, item.detail, item.category_id,  user.shop_name, user.user_id as seller_id, item.location, item.sale
                FROM item
                INNER JOIN user
                ON user.user_id = item.user_id
                WHERE item.item_id = ${itemId} AND item.status = 1;
    `;
    const [selectItemInfoRows] = await connection.query(selectItemInfoQuery);
    return selectItemInfoRows;
};

const selectImages = async (connection, itemId) => {
    const selectImagesQuery = `
    SELECT image_path
    FROM image
    WHERE image.item_id = ? And image.status =1;
    `;
    const [selectImagesRows] = await connection.query(selectImagesQuery, itemId);
    return selectImagesRows;
};

const selectTags = async (connection, itemId) => {
    const selectTagsQuery = `
    SELECT tag.tag_name
    FROM item_tag
    INNER JOIN tag
    ON tag.tag_id = item_tag.tag_id
    WHERE item_tag.item_id = ? AND item_tag.status =1;
    `;
    const [selectTagRows] = await connection.query(selectTagsQuery, itemId);
    return selectTagRows;
};

const selectUserItemList = async (connection, userId) => {
    const selectUserItemListQuery = `
        SELECT item.item_id, item.price, item.title, image.image_path
        FROM item
        INNER JOIN image 
        on image.item_id = item.item_id
        WHERE item.user_id = ? and item.status = 1
        GROUP BY image.item_id
        LIMIT 3;
        `;
    const [selectUserItemListRows] = await connection.query(selectUserItemListQuery, userId);
    return selectUserItemListRows;
};

const selectItemReviewList = async (connection, userId) => {
    const selectReviewListQuery = `
    SELECT review.review_id, review.rank, review.content, review.created_at, user.user_id as buyer_id, user.image as buyer_image, 
    user.shop_name as buyer_name, item.item_id, item.title as item_title
    FROM deal
    INNER JOIN review
    ON review.deal_id = deal.deal_id AND review.status = 1
    INNER JOIN user
    ON review.buyer_id = user.user_id
    INNER JOIN item
    ON item.item_id = deal.item_id
    WHERE deal.seller_id = ?
    LIMIT 2;
        `;
    const [selectReviewListRows] = await connection.query(selectReviewListQuery, userId);
    return selectReviewListRows;
};

const selectItemReviewStatus = async (connection, userId) => {
    const selectItemReviewStatusQuery = `
    SELECT (select count(*) from review where review.deal_id = deal.deal_id and review.status = 1) review_count,  AVG(review.rank) as AVGrank
    FROM deal
    INNER JOIN review
    ON review.deal_id = deal.deal_id
    WHERE deal.seller_id = ?;
    `;
    const [selectItemReviewStatusRows] = await connection.query(selectItemReviewStatusQuery, userId);
    return selectItemReviewStatusRows;
};

const selectItemListPre = async (connection, searchParams) => {
    const selectItemListPreQuery = `
        SELECT item_id, title
        FROM item
        WHERE item.title REGEXP ? AND item.status = 1
        LIMIT 20;
    `;
    const [selectItemListPreRows] = await connection.query(selectItemListPreQuery, searchParams);
    return selectItemListPreRows;
};

const selectItemListDefault = async (connection, searchParams, limit, offset) => {
    const selectItemListFilterQuery = `
        SELECT item.item_id, item.title, item.price, item.safety_pay, item.location, item.created_at, 
        image.image_path, (select count(*) from wish where wish.item_id = item.item_id) wish_count
        FROM item
        INNER JOIN image
        on image.item_id = item.item_id
        WHERE item.title REGEXP ? AND item.status = 1
        GROUP BY image.item_id
        ORDER BY item.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset};
    `;
    const [selectItemListFilterRow] = await connection.query(selectItemListFilterQuery, [searchParams]);
    return selectItemListFilterRow;
};

const selectItemListFilter = async (connection, searchParams, limit, offset, filterString, orderString) => {
    const selectItemListFilterQuery = `
        SELECT item.item_id, item.title, item.price, item.safety_pay, item.location, item.created_at, 
        image.image_path, item.brand_id, item.category_id, (select count(*) from wish where wish.item_id = item.item_id) wish_count
        FROM item
        INNER JOIN image
        on image.item_id = item.item_id
        WHERE item.title REGEXP ? AND item.status = 1 ${filterString}
        GROUP BY image.item_id
        ${orderString}
        LIMIT ${limit}
        OFFSET ${offset};
    `;
    const [selectItemListFilterRows] = await connection.query(selectItemListFilterQuery, [searchParams]);
    return selectItemListFilterRows;
};

module.exports = {
    selectBrand, // 브랜드 이름으로 가져오기
    insertItem, // 상품 등록
    updateItem, //상품 수정
    selectTag, // 태그 이름으로 가져오가
    insertTag, // 태그 테이블 등록
    insertItemTag, // 상품-태그 테이블 등록
    insertItemImage, // 상품 이미지 등록
    deleteItemTag, // 상품-태그 이미지 삭제
    deleteItemImage, // 상품 이미지 삭제
    deleteItemInquiry, // 상품 문의 삭제
    deleteItem, // 상품 삭제
    setItemSale, // 판매상태 변경
    selectItemWishes, // 상품 찜한 사람 목록
    selectItemsByCount, // 조회수 순으로 정렬
    parentCategoryCheck, // 부모카테고리인지 확인
    selectChildCategoryId, // 자식카테고리 ID 가져오기
    selectItemsByCategory, // 카테고리별 상품 목록
    selectItemsByBrand, // 브랜드별 상품 목록
    selectItemInfo,
    selectImages,
    selectTags,
    selectUserItemList,
    selectItemReviewList,
    selectItemReviewStatus,
    selectItemListPre,
    selectItemListFilter,
    selectItemListDefault,
};
