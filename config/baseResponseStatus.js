module.exports = {
    // Success
    SUCCESS: { isSuccess: true, code: 1000, message: '성공' },

    // Common
    TOKEN_EMPTY: { isSuccess: false, code: 2000, message: 'JWT 토큰을 입력해주세요.' },
    TOKEN_VERIFICATION_FAILURE: { isSuccess: false, code: 3000, message: 'JWT 토큰 검증 실패' },
    TOKEN_VERIFICATION_SUCCESS: { isSuccess: true, code: 1001, message: 'JWT 토큰 검증 성공' }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY: { isSuccess: false, code: 2001, message: '이메일을 입력해주세요' },
    SIGNUP_EMAIL_LENGTH: { isSuccess: false, code: 2002, message: '이메일은 30자리 미만으로 입력해주세요.' },
    SIGNUP_EMAIL_ERROR_TYPE: { isSuccess: false, code: 2003, message: '이메일을 형식을 정확하게 입력해주세요.' },
    SIGNUP_PASSWORD_EMPTY: { isSuccess: false, code: 2004, message: '비밀번호를 입력 해주세요.' },
    SIGNUP_PASSWORD_LENGTH: { isSuccess: false, code: 2005, message: '비밀번호는 6~20자리를 입력해주세요.' },
    SIGNUP_NICKNAME_EMPTY: { isSuccess: false, code: 2006, message: '닉네임을 입력 해주세요.' },
    SIGNUP_NICKNAME_LENGTH: { isSuccess: false, code: 2007, message: '닉네임은 최대 20자리를 입력해주세요.' },

    SIGNIN_EMAIL_EMPTY: { isSuccess: false, code: 2008, message: '이메일을 입력해주세요' },
    SIGNIN_EMAIL_LENGTH: { isSuccess: false, code: 2009, message: '이메일은 30자리 미만으로 입력해주세요.' },
    SIGNIN_EMAIL_ERROR_TYPE: { isSuccess: false, code: 2010, message: '이메일을 형식을 정확하게 입력해주세요.' },
    SIGNIN_PASSWORD_EMPTY: { isSuccess: false, code: 2011, message: '비밀번호를 입력 해주세요.' },

    USER_USERID_EMPTY: { isSuccess: false, code: 2012, message: 'userId를 입력해주세요.' },
    USER_USERID_NOT_EXIST: { isSuccess: false, code: 2013, message: '해당 회원이 존재하지 않습니다.' },

    USER_USEREMAIL_EMPTY: { isSuccess: false, code: 2014, message: '이메일을 입력해주세요.' },
    USER_USEREMAIL_NOT_EXIST: { isSuccess: false, code: 2015, message: '해당 이메일을 가진 회원이 존재하지 않습니다.' },
    USER_ID_NOT_MATCH: { isSuccess: false, code: 2016, message: '유저 아이디 값을 확인해주세요' },
    USER_NICKNAME_EMPTY: { isSuccess: false, code: 2017, message: '변경할 닉네임 값을 입력해주세요' },

    USER_STATUS_EMPTY: { isSuccess: false, code: 2018, message: '회원 상태값을 입력해주세요' },

    QUERY_STRING_EMPTY: { isSuccess: false, code: 2100, message: '쿼리 스트링 값을 입력해주세요' } /* */,

    BODY_EMPTY: { isSuccess: false, code: 2200, message: 'BODY 값을 입력해주세요' } /* */,
    BODY_WRONG: { isSuccess: false, code: 2201, message: 'BODY 값의 형식이 잘못되었습니다' } /* */,

    PATH_VARIABLE_EMPTY: { isSuccess: false, code: 2300, message: 'Path Variable 값을 입력해주세요' } /* */,
    SALE_STATUS_WRONG: { isSuccess: false, code: 2301, message: '판매상태 값이 잘못되었습니다' } /* */,
    SEARCH_QUERY_EMPTY: { isSuccess: false, code: 2302, message: '상품검색 쿼리 값이 비었습니다' },
    WRONG_CATEGORY_ID: { isSuccess: false, code: 2303, message: '카테고리 ID가 잘못되었습니다' },
    OPTION_IS_NOT_NULL: { isSuccess: false, code: 2400, message: '필수항목들을 입력하세요' },
    NOT_FOLLOW: { isSuccess: false, code: 2500, message: '팔로우가 되어있지 않습니다.' },
    EMPTY_FOLLOW: { isSuccess: false, code: 2501, message: '팔로우 되어있는 회원이 없습니다.' },
    EMPTY_FOLLOWER: { isSuccess: false, code: 2502, message: '팔로워가 없습니다.' },
    ALEREDY_FOLLOW: { isSuccess: false, code: 2503, message: '이미 팔로우가 되어있습니다.' },
    EMPTY_BRAND_FOLLOW: { isSuccess: false, code: 2504, message: '팔로우 되어있는 브랜드가 없습니다.' },
    EMPTY_BRAND: { isSuccess: false, code: 2601, message: '브랜드가 없습니다.' },
    EMPTY_ITEM: { isSuccess: false, code: 2602, message: '유효하지 않은 상품입니다.' },
    ALREADY_PURCHASED_ITEM: { isSuccess: false, code: 2700, message: '이미 예약된 상품입니다.' },
    ERROR_PROCESS: { isSuccess: false, code: 2800, message: '판매과정 오류' },
    ERROR_DEAL: { isSuccess: false, code: 2801, message: '거래방식-배송지 간의 오류' },
    ERROR_SELLER: { isSuccess: false, code: 2900, message: '해당 상품 판매자가 아닙니다.' },
    ERROR_BUYER: { isSuccess: false, code: 2901, message: '해당 상품을 구매한 구매자가 아닙니다.' },
    ERROR_REVIEW: { isSuccess: false, code: 2902, message: '사용자가 작성한 후기가 없습니다.' },
    ERROR_INQUIRY: { isSuccess: false, code: 2903, message: '사용자가 작성한 문의가 아닙니다.' },
    ERROR_COMMENT: { isSuccess: false, code: 2904, message: 'commentId 오류.' },
    ERROR_ACCOUNTNUM: { isSuccess: false, code: 2905, message: '계좌번호 입력 오류' },
    ERROR_WISH: { isSuccess: false, code: 2906, message: 'ItemId 오류' },
    ERROR_SELF_FOLLOW: {isSuccess: false, code: 2907, message: '자기자신을 팔로우'},
    ERROR_SELF_WISH: {isSuccess: false, code: 2908, message: '자신의 아이템을 찜할수는 없습니다.'},

    // Response error
    SIGNUP_REDUNDANT_SOCIALID: { isSuccess: false, code: 3001, message: '중복된 소셜ID입니다.' },
    SIGNUP_REDUNDANT_NICKNAME: { isSuccess: false, code: 3002, message: '중복된 닉네임입니다.' },

    SIGNIN_EMAIL_WRONG: { isSuccess: false, code: 3003, message: '아이디가 잘못 되었습니다.' },
    SIGNIN_PASSWORD_WRONG: { isSuccess: false, code: 3004, message: '비밀번호가 잘못 되었습니다.' },
    SIGNIN_INACTIVE_ACCOUNT: { isSuccess: false, code: 3005, message: '비활성화 된 계정입니다. 고객센터에 문의해주세요.' },
    SIGNIN_WITHDRAWAL_ACCOUNT: { isSuccess: false, code: 3006, message: '탈퇴 된 계정입니다. 고객센터에 문의해주세요.' },
    MANY_ACCOUNT: { isSuccess: false, code: 3007, message: '이미 두개의 계좌가 등록되었습니다.' },
    SIGNIN_BODY_WRONG: { isSuccess: false, code: 3100, message: '존재하지 않는 계정입니다.' } /* */,
    REVIEWED_DEAL: { isSuccess: false, code: 3200, message: '이미 후기를 작성한 거래입니다.' } /* */,
    INVALID_DEAL: { isSuccess: false, code: 3201, message: '존재하지 않는 거래번호입니다.' },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR: { isSuccess: false, code: 4000, message: '데이터 베이스 에러' },
    SERVER_ERROR: { isSuccess: false, code: 4001, message: '서버 에러' },
};
