const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const itemProvider = require('./itemProvider');
const itemDao = require('./itemDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { connect } = require('http2');

const createItem = async (postBody, userId, imageKey) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction(); // 트랜잭션 적용 시작

        // item 테이블 데이터 가공
        const postData = [
            userId,
            postBody.category_id,
            postBody.title,
            postBody.location,
            postBody.price,
            postBody.delivery_fee_included,
            postBody.count,
            postBody.condition,
            postBody.exchange,
            postBody.detail,
            postBody.safety_pay,
        ];

        //태그 배열 생성
        const tags = postBody.tags;
        const tagArray = [];
        const tagIdArray = [];
        if (tags) {
            tags.forEach((v) => {
                tagArray.push(v);
            });

            if (tagArray.length > 0) {
                let count = 0;
                for (let i in tagArray) {
                    //태그 테이블 등록
                    const tagRow = await itemProvider.retrieveTag(tagArray[i]);
                    //태그 검색해서 없으면 태그 테이블에 추가하고
                    if (tagRow.length == 0) {
                        const insertTagResult = await itemDao.insertTag(connection, tagArray[i]);
                        console.log(`#1 태그 테이블 신규 등록${i} : ${insertTagResult.insertId}`);
                        tagIdArray.push(insertTagResult.insertId);
                    } else {
                        tagIdArray.push(tagRow[0].tag_id);
                    }

                    //브랜드 등록 (postData에 push)
                    const brandRow = await itemProvider.retrieveBrand(tagArray[i]);
                    if (brandRow.length > 0) {
                        if (count == 0) {
                            postData.push(brandRow[0].brand_id);
                            count = 1;
                        }
                    }
                }
                if (count == 0) {
                    // 없으면 null
                    postData.push(null);
                }
            }
        }

        // 상품 등록
        const insertItemResult = await itemDao.insertItem(connection, postData);
        console.log(`#2 상품등록 : ${insertItemResult.insertId}`);

        //상품-태그 테이블 등록
        if (tagArray.length > 0) {
            for (let i in tagArray) {
                const insertItemTagResult = await itemDao.insertItemTag(connection, insertItemResult.insertId, tagIdArray[i]);
                console.log(`#3 상품-태그 테이블 등록${i} : 이 테이블은 고유id 없음`);
            }
        }

        //상품 이미지 등록
        if (imageKey || imageKey.length > 0) {
            console.log(imageKey);
            const postImageRow = await itemDao.insertItemImage(connection, imageKey, insertItemResult.insertId);
            console.log(`#4 이미지 등록 완료 : ${JSON.stringify(postImageRow, null, 4)}`);
        }

        connection.commit();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        await connection.rollback(); //롤백
        logger.error(`App - createItem Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

const updateItem = async (postBody, userId, itemId, imageKey) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction(); // 트랜잭션 적용 시작

        // item 테이블 데이터 가공
        const postData = [
            userId,
            postBody.category_id,
            postBody.title,
            postBody.location,
            postBody.price,
            postBody.delivery_fee_included,
            postBody.count,
            postBody.condition,
            postBody.exchange,
            postBody.detail,
            postBody.safety_pay,
        ];

        //태그 배열 생성
        const tags = postBody.tags;
        const tagArray = [];
        const tagIdArray = [];
        if (tags) {
            tags.forEach((v) => {
                tagArray.push(v);
            });
        }

        if (tagArray.length > 0) {
            let count = 0;
            for (let i in tagArray) {
                //태그 테이블 등록

                const tagRow = await itemProvider.retrieveTag(tagArray[i]);
                //태그 검색해서 없으면 태그 테이블에 추가하고
                if (tagRow.length == 0) {
                    const insertTagResult = await itemDao.insertTag(connection, tagArray[i]);
                    console.log(`#1 태그 테이블 신규 등록${i} : ${insertTagResult.insertId}`);
                    tagIdArray.push(insertTagResult.insertId);
                } else {
                    tagIdArray.push(tagRow[0].tag_id);
                }

                //브랜드 등록 (postData에 push)
                const brandRow = await itemProvider.retrieveBrand(tagArray[i]);
                if (brandRow.length > 0) {
                    if (count == 0) {
                        postData.push(brandRow[0].brand_id);
                        count = 1;
                    }
                }
            }
            if (count == 0) {
                // 없으면 null
                postData.push(null);
            }
        }

        // 상품 업데이트
        postData.push(itemId);
        const updateItemResult = await itemDao.updateItem(connection, postData);
        console.log(`#2 상품업데이트 : ${itemId}`);

        //기존 상품-태그 테이블 삭제
        const deleteItemTagResult = await itemDao.deleteItemTag(connection, itemId);
        console.log(`#3- 기존 상품-태그 삭제`);

        //상품-태그 테이블 등록
        if (tagArray.length > 0) {
            for (let i in tagArray) {
                const insertItemTagResult = await itemDao.insertItemTag(connection, itemId, tagIdArray[i]);
                console.log(`#4 상품-태그 테이블 등록${i} : 이 테이블은 고유id 없음`);
            }
        }

        //기존 상품 이미지 삭제
        const deleteItemImageResult = await itemDao.deleteItemImage(connection, itemId);
        console.log(`#5 기존 상품 이미지 삭제`);

        //상품 이미지 등록
        //상품 이미지 등록
        if (imageKey || imageKey.length > 0) {
            const postImageRow = await itemDao.insertItemImage(connection, imageKey, itemId);
            console.log(`#4 이미지 등록 완료 : ${JSON.stringify(postImageRow, null, 4)}`);
        }

        connection.commit();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        await connection.rollback(); //롤백
        logger.error(`App - updateItem Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

const deleteItem = async (itemId) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        // 상품 삭제
        const deleteItemResult = await itemDao.deleteItem(connection, itemId);
        console.log(`${itemId} 상품 삭제 완료`);

        //문의 삭제
        const deleteItemInquiryResult = await itemDao.deleteItemInquiry(connection, itemId);
        console.log(`${itemId} 상품문의 삭제 완료`);
        //이미지 삭제
        const deleteItemImageResult = await itemDao.deleteItemImage(connection, itemId);
        console.log(`${itemId} 상품이미지 삭제 완료`);
        //상품-태그 삭제
        const deleteItemTagResult = await itemDao.deleteItemTag(connection, itemId);
        console.log(`${itemId} 상품태그 삭제 완료`);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - deleteItem Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

const setItemSale = async (itemId, sale) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const setItemSaleResult = await itemDao.setItemSale(connection, itemId, sale);
        console.log(`{${itemId} 판매 상태 변경 : ${sale}}`);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - setItemSale Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

module.exports = {
    createItem,
    updateItem,
    deleteItem,
    setItemSale,
};
