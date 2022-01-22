// 모든 유저 조회
const selectUser = async (connection) => {
    const selectUserListQuery = `
                SELECT user_id, shop_name, image 
                FROM user;
                `;
    const [userRows] = await connection.query(selectUserListQuery);
    return userRows;
};

const selectShop = async (connection, shop_name) => {
    const selectShopQuery = `
                SELECT user_id, shop_name, status
                FROM user
                WHERE shop_name = ? and status = 1;
                `;
    const [shopRow] = await connection.query(selectShopQuery, shop_name);
    return shopRow;
};

// 소셜ID로 회원 조회 ********************
const selectSocialId = async (connection, selectSocialIdParams) => {
    const selectSocialIdQuery = `
                SELECT user_id, user_name, social_id, status
                FROM user
                WHERE user_name = ? AND social_id = ? AND social_info = ?;
                `;
    const [socialIdRows] = await connection.query(selectSocialIdQuery, selectSocialIdParams);
    return socialIdRows;
};

// 유저 이름으로 회원 조회
const selectUserName = async (connection, name) => {
    const selectUserNameQuery = `
              SELECT user_id, user_name
              FROM user 
              WHERE user_name = ?;
              `;
    const [nameRows] = await connection.query(selectUserNameQuery, name);
    return nameRows;
};

// userId 회원 조회
const selectUserId = async (connection, userId) => {
    const selectUserIdQuery = `
                 SELECT  
                 FROM UserInfo 
                 WHERE id = ?;
                 `;
    const [userRow] = await connection.query(selectUserIdQuery, userId);
    return userRow;
};

// 유저 생성
const insertUserInfo = async (connection, insertUserInfoParams) => {
    const insertUserInfoQuery = `
        INSERT INTO user(social_id, user_name, social_info, shop_name)
        VALUES (?, ?, ? ,?);
    `;
    const [insertUserInfoRow] = await connection.query(insertUserInfoQuery, insertUserInfoParams);

    return insertUserInfoRow;
};

// 패스워드 체크
const selectUserPassword = async (connection, selectUserPasswordParams) => {
    const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM UserInfo 
        WHERE email = ? AND password = ?;`;
    const [selectUserPasswordRow] = await connection.query(selectUserPasswordQuery, selectUserPasswordParams);

    return selectUserPasswordRow;
};

const updateUserInfo = async (connection, changeUserParams) => {
    const updateUserQuery = `
        UPDATE user 
        SET image = ?, shop_name = ?, shop_url = ?, shop_time = ?, shop_introduce = ?, shop_policy = ?, shop_notice = ?
        WHERE user_id = ?;`;
    const [updateUserRow] = await connection.query(updateUserQuery, changeUserParams);
    return updateUserRow;
};

const createAccount = async (connection, createAccountParams) => {
    const createAccountQuery = `
        INSERT INTO bank_account(user_id, user_name, bank, account_number, for_sale, for_return)
        VALUES (?, ?, ?, ?, ?, ?);
        `;
    const [createAccountRow] = await connection.query(createAccountQuery, createAccountParams);
    return createAccountRow;
};

const updateAccount = async (connection, updateAccountParams) => {
    const updateAccountQuery = `
        UPDATE bank_account
        SET user_name = ?, bank = ?, account_number = ?, for_sale = ?, for_return = ?
        WHERE account_number = ? and user_id = ? ;
        `;
    const [updateAccountRow] = await connection.query(updateAccountQuery, updateAccountParams);
    return updateAccountRow;
};

const deleteAccount = async (connection, userId, account_num) => {
    const deleteAccountQuery = `
        UPDATE bank_account
        SET status = 0
        WHERE user_id = ? and account_number = ?;
        `;
    const [deleteAccountRow] = await connection.query(deleteAccountQuery, [userId, account_num]);
    return deleteAccountRow;
};

const selectAccountByAccountNum = async (connection, accountNum) => {
    const selectAccountQuery = `
        SELECT account_number, bank, user_name, for_sale, for_return
        FROM bank_account
        WHERE account_number = ? and status = 1;
        `;
    const [selectAccountRow] = await connection.query(selectAccountQuery, accountNum);
    return selectAccountRow;
}

const selectAccountByUserId = async (connection, userId) => {
    const selectAccountQuery = `
        SELECT account_number, bank, user_name, for_sale, for_return
        FROM bank_account
        WHERE user_id = ? and status = 1;
        `;
    const [selectAccountRow] = await connection.query(selectAccountQuery, userId);
    return selectAccountRow;
};

const countItem = async (connection, userId) => {
    const countItemQuery = `
        SELECT count(*) as countItem
        FROM item
        WHERE item.user_id = ? and status = 1;
        `;
    const [countItemRows] = await connection.query(countItemQuery, userId);
    return countItemRows;
};

const selectUserInfo = async (connection, userId) => {
    const selectUserInfoQuery = `
        SELECT user.shop_name, user.image, user.created_at, user.shop_time, user.shop_introduce, user.shop_policy, user.shop_notice,
            (select count(*) from item where item.user_id = user.user_id and item.status = 1) item_count, 
            (select count(*) from follow where follow.follow_from = user.user_id) following_count,
            (select count(*) from follow where follow_to = user.user_id) follower_count,
            (select count(*) from deal where deal.type = 0 and deal.status = 1) direct_deal_count,
            (select count(*) from deal where deal.type = 1 and deal.status = 1) delivery_deal_count,
            (select count(*) from deal where deal.seller_id = user.user_id and deal.status = 1) total_deal_count
        FROM user
        WHERE user.user_id = ? 
            `;
    const [selectUserInfoRow] = await connection.query(selectUserInfoQuery, userId);
    return selectUserInfoRow;
};

const selectUserItemList = async (connection, userId, shopId) => {
    const selectUserItemListQuery = `
        SELECT item.item_id, item.price, item.title, image.image_path, 
            (select count(*) from wish where wish.user_id = ?) isWish
        FROM item
        INNER JOIN image 
        on image.item_id = item.item_id
        WHERE item.user_id = ? and item.status = 1
        GROUP BY image.item_id;
        `;
    const [selectUserItemListRow] = await connection.query(selectUserItemListQuery, [userId, shopId]);
    return selectUserItemListRow;
};

const selectReviewList = async (connection, userId) => {
    const selectReviewListQuery = `
        SELECT deal.deal_id, review.review_id, review.rank, review.content, review.created_at, 
        user.user_id, user.image, user.shop_name
        FROM deal, review, user
        WHERE deal.seller_id =? and 
            review.deal_id = deal.deal_id and review.status =1 
            and user.user_id = (select deal.buyer_id from deal where deal.deal_id = review.deal_id)
        LIMIT 2;
        `;
    const [selectReviewListRow] = await connection.query(selectReviewListQuery, userId);
    return selectReviewListRow;
};

const selectUserRank = async (connection, userId) => {
    const selectUserRankQuery = `
        SELECT deal.deal_id, AVG(review.rank) as AvgRank
        FROM deal, review
        WHERE deal.seller_id = ? and deal.status = 1 and review.deal_id = deal.deal_id;
        `;
    const [selectUserRankRows] = await connection.query(selectUserRankQuery, userId);
    return selectUserRankRows;
}

const selectReviewCount = async (connection, userId) => {
    const selectReviewCountQuery = `
        SELECT count(*) as review_count
        FROM deal, review
        WHERE deal.seller_id = ? and review.deal_id = deal.deal_id and review.status = 1;
        `;
    const [selectReviewCountRows] = await connection.query(selectReviewCountQuery, userId);
    return selectReviewCountRows;
}

const selectMyInfo = async (connection, userId) => {
    const selectMyInfoQuery = `
        SELECT user.shop_name, user.image,
            (select count(*) from wish where wish.user_id = ${userId} and wish.status = 1) wish_count,
            (select count(*) from follow where follow.follow_from = user.user_id and follow.status = 1) following_count,
            (select count(*) from follow where follow_to = user.user_id and follow.status = 1) follower_count
        FROM user
        WHERE user.user_id = ${userId};
        `;
    const [selectMyInfoRows] = await connection.query(selectMyInfoQuery);
    return selectMyInfoRows;
}
module.exports = {
    selectUser,
    selectShop, //상점 이름으로 상점 검색
    selectSocialId, //소셜ID로 회원 조회
    selectUserName, //유저 이름으로 회원 조회
    selectUserId,
    insertUserInfo, // 유저 생성
    selectUserPassword,
    updateUserInfo,
    createAccount,
    updateAccount,
    deleteAccount,
    selectAccountByAccountNum,
    selectAccountByUserId,
    countItem,
    selectUserInfo,
    selectUserItemList,
    selectReviewList,
    selectUserRank,
    selectReviewCount,
    selectMyInfo,
};
