const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

const itemDao = require('./itemDao');

const retrieveBrand = async (brandName) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const brandRow = await itemDao.selectBrand(connection, brandName);

    connection.release();
    return brandRow;
};

const retrieveTag = async (tagName) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const tagRow = await itemDao.selectTag(connection, tagName);

    connection.release();
    return tagRow;
};

const retrieveItemWishes = async (itemId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const itemWishesRow = await itemDao.selectItemWishes(connection, itemId);

    connection.release();
    return itemWishesRow;
};

const readItemsByCount = async (limit, offset) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const ItemsByCountRow = await itemDao.selectItemsByCount(connection, limit, offset);

    connection.release();
    return ItemsByCountRow;
};

const readItemsByCategory = async (categoryId, limit, offset) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const searchCategoryIdArray = [];
    //카테고리가 상위 카테고리면 하위 카테고리들 id 전부 가져오기
    const isParent = await itemDao.parentCategoryCheck(connection, categoryId);
    if (isParent.length < 1) {
        return errResponse(baseResponse.WRONG_CATEGORY_ID);
    }
    if (!isParent[0].parent_id) {
        const childCategoryIdRow = await itemDao.selectChildCategoryId(connection, categoryId);
        childCategoryIdRow.forEach((v) => {
            searchCategoryIdArray.push(v.category_id);
        });
        console.log(searchCategoryIdArray);
    } else {
        searchCategoryIdArray.push(categoryId);
    }

    const ItemsByCategoryRow = await itemDao.selectItemsByCategory(connection, searchCategoryIdArray, limit, offset);
    connection.release();
    return response(baseResponse.SUCCESS, ItemsByCategoryRow);
};

const readItemsByBrand = async (brandId, limit, offset) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const ItemsByBrandRow = await itemDao.selectItemsByBrand(connection, brandId, limit, offset);

    connection.release();
    return ItemsByBrandRow;
};

const readItemInfo = async (itemId) => {
    const connection = await pool.getConnection(async (conn) => conn);

    //단일정보
    const selectItemInfoRow = await itemDao.selectItemInfo(connection, itemId);
    console.log(selectItemInfoRow);
    if (selectItemInfoRow.length < 1) {
        return errResponse(baseResponse.EMPTY_ITEM);
    }
    const userId = selectItemInfoRow[0].seller_id;

    //이미지, 태그
    const selectImagesRow = await itemDao.selectImages(connection, itemId);
    const selectTagsRow = await itemDao.selectTags(connection, itemId);
    console.log(selectImagesRow, selectTagsRow);

    //판매상품 3개 미리보기
    const selectItemShopRow = await itemDao.selectUserItemList(connection, userId);
    console.log(selectItemShopRow);
    //후기 2개 미리보기, 후기평균,후기숫자
    const selectItemReviewStatusRow = await itemDao.selectItemReviewStatus(connection, userId);
    console.log(selectItemReviewStatusRow);
    const selectItemReviewRow = await itemDao.selectItemReviewList(connection, userId);
    console.log(selectItemReviewRow);

    connection.release();
    //json 객체 만들기
    const reqJson = {
        item: {
            price: selectItemInfoRow[0].price,
            title: selectItemInfoRow[0].title,
            safety_pay: selectItemInfoRow[0].safety_pay,
            creatd_at: selectItemInfoRow[0].created_at,
            view: selectItemInfoRow[0].view,
            wish_count: selectItemInfoRow[0].wish_count,
            location: selectItemInfoRow[0].location,
            condition: selectItemInfoRow[0].condition,
            delivery_fee_included: selectItemInfoRow[0].delivery_fee_included,
            count: selectItemInfoRow[0].count,
            detail: selectItemInfoRow[0].detail,
            images: selectImagesRow,
            tags: selectTagsRow,
            category_id: selectItemInfoRow[0].category_id,
            inquiry_count: selectItemInfoRow[0].inquiry_count,
            sale: selectItemInfoRow[0].sale,
        },
        shop: {
            shop_name: selectItemInfoRow[0].shop_name,
            seller_id: selectItemInfoRow[0].seller_id,
            follower_count: selectItemInfoRow[0].follower_count,
            item_count: selectItemInfoRow[0].item_count,
            shop_items: selectItemShopRow,
        },
        review: {
            review_count: selectItemReviewStatusRow[0].review_count,
            rank_avg: selectItemReviewStatusRow[0].AVGrank,
            reviews: selectItemReviewRow,
        },
    };

    return response(baseResponse.SUCCESS, reqJson);
};

const retrieveItemList = async (searchFor) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const searchParamsList = searchFor.split(' ');
    let searchParamsString = searchParamsList[0];
    searchParamsList.forEach((v, i) => {
        if (i == 0) return;
        searchParamsString = searchParamsString + '|' + v;
    });
    const selectItemListRow = await itemDao.selectItemListPre(connection, searchParamsString); //배열로 검색하는거 추가하기
    console.log(selectItemListRow);
    connection.release();
    return selectItemListRow;
};

const getItemsByDefault = async (searchFor, limit, offset) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const searchParamsList = searchFor.split(' ');
    let searchParamsString = searchParamsList[0];
    searchParamsList.forEach((v, i) => {
        if (i == 0) return;
        searchParamsString = searchParamsString + '|' + v;
    });
    const selectItemListByDefaultRow = await itemDao.selectItemListDefault(connection, searchParamsString, limit, offset);
    console.log(selectItemListByDefaultRow);
    connection.release();
    return selectItemListByDefaultRow;
};

const retrieveFilterList = async (searchFor, filter, limit, offset) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const searchParamsList = searchFor.split(' ');
    const filterParamsList = filter.split('.');
    const inputArr = [];
    //console.log(filterParamsList)
    let searchParamsString = searchParamsList[0];
    searchParamsList.forEach((v, i) => {
        if (i == 0) return;
        searchParamsString = searchParamsString + '|' + v;
    });
    filterParamsList.forEach((v, i) => {
        const middleArr = v.split('-');
        const middleObj = {};
        if (middleArr[0] === 'range' || middleArr[0] === 'brand') {
            const valArr = middleArr[1].split('|');
            middleObj[middleArr[0]] = valArr;
        } else {
            middleObj[middleArr[0]] = middleArr[1];
        }
        inputArr.push(middleObj);
    });
    console.log(inputArr);
    let filterString = [];
    let orderString = [];
    inputArr.forEach((v, i) => {
        if (Object.keys(v)[0] === 'brand') {
            filterString.push(` AND item.brand_id IN (${v.brand.join(',')})`);
        } else if (Object.keys(v)[0] === 'range') {
            if (v.range[0] === 'null') {
                filterString.push(` AND item.price =< ${v.range[1]}`);
            } else if (v.range[1] === 'null') {
                filterString.push(` AND item.price >= ${v.range[0]}`);
            } else filterString.push(` AND item.price BETWEEN ${v.range.join(' AND ')}`);
        } else if (Object.keys(v)[0] === 'includeSold') {
            if (v.includedSold === 'included') filterString.push(` AND item.sale = 'Sold'`);
        } else if (Object.keys(v)[0] === 'sort') {
            if (v.sort === 'recent') {
                orderString.push(`ORDER BY item.created_at DESC`);
            } else if (v.sort === 'low') {
                orderString.push(`ORDER BY item.price ASC`);
            } else if (v.sort === 'high') {
                orderString.push(`ORDER BY item.price DESC`);
            }
        } else if (Object.keys(v)[0] === 'term') {
            if (v.term !== 'all') {
                if (v.term === 'day') {
                    filterString.push(` AND DATE(item.created_at) >= DATE_SUB(NOW(), INTERVAL 1 DAY)`);
                } else if (v.term === '3days') filterString.push(` AND DATE(item.created_at) >= DATE_SUB(NOW(), INTERVAL 3 DAY)`);
                else if (v.term === 'week') filterString.push(` AND DATE(item.created_at) >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
                else if (v.term === 'month') filterString.push(` AND DATE(item.created_at) >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);
            }
        } else if (Object.keys(v)[0] === 'deliveryFee' || 'condition' || 'exchange') {
            if (Object.keys(v)[0][0] !== 'all') {
                if (Object.keys(v)[0] === 'deliveryFee') filterString.push(` AND item.delivery_fee_included = ${v.deliveryFee}`);
                if (Object.keys(v)[0] === 'condition') filterString.push(` AND item.condition = ${v.condition}`);
                if (Object.keys(v)[0] === 'exchange') filterString.push(` AND item.exchange = ${v.exchange}`);
            }
        }
    });
    const resultArr = filterString.join('');
    console.log(resultArr);
    //const filterString = inputArr.join('AND');
    const selectItemListRow = await itemDao.selectItemListFilter(connection, searchParamsString, limit, offset, resultArr, orderString); //배열로 검색하는거 추가하기
    //console.log(selectItemListRow);
    connection.release();
    return selectItemListRow;
};

module.exports = {
    retrieveBrand, // 브랜드 이름으로 가져오기
    retrieveTag, // 태그 이름으로 가져오기
    retrieveItemWishes, // 상품 찜한 사람 목록
    readItemsByCount, // 조회수 순으로 상품 목록
    readItemsByCategory, // 카테고리별 상품 목록
    readItemsByBrand, //브랜드별 상품 목록
    readItemInfo, // 상품 상세 페이지
    retrieveItemList,
    retrieveFilterList,
    getItemsByDefault,
};
