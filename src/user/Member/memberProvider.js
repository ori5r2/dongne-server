const { pool } = require("../../../config/database");
const baseResponseStatus = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const memberDao = require("./memberDao");

// DB Test
exports.retrieveUserList = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const handleError = (error) => logger.error(`❌retrieveUserList DB Error: ${error.message}`);
  
    try {
      const testResult = await memberDao.selectUserPosts(connection);
      connection.release();
      return response(baseResponseStatus.SUCCESS, testResult);
    } catch (error) {
      handleError(error);
      connection.release();
      return errResponse(baseResponseStatus.DB_ERRORS);
    }
  };

// 단체 모든 회원명단 리스트 조회 - API NO. 4.1
exports.retrieveClubMemberList = async function (adminIdx, start, pageSize) {
  const connection = await pool.getConnection(async (conn) => conn);
  const handleError = (error) => logger.error(`❌retriebeClubMemberList DB Error: ${error.message}`);

  //Try문 예외처리
  try {
    const clubMemberParams = [adminIdx, start, pageSize];
    const clubMemberResult = await memberDao.selectClub(connection, clubMemberParams);
    connection.release();
    return clubMemberResult;

  } catch (error) {
    handleError(error);
    connection.release();
    return errResponse(baseResponseStatus.DB_ERRORS);
  }
};

// API NO. 4.1 - AdminIdx Status Check
exports.checkClubStatus = async function (adminIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const handleError = (error) => logger.error(`❌checkClubStatus DB Error: ${error.message}`);

  //Try문 예외처리
  try {
    const clubStatus = await memberDao.selectClubStatus(connection, adminIdx);
    connection.release();
    return clubStatus[0].status;

  } catch (error) {
    handleError(error);
    connection.release();
    return errResponse(baseResponseStatus.DB_ERRORS);
  }
};

// API NO. 4.1 - Paging's Total Data Count
exports.retrieveTotalDataCount = async function (adminIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const handleError = (error) => logger.error(`❌retrieveTotalDataCount DB Error: ${error.message}`);

  //Try문 예외처리
  try {
    const totalDataCountResult = await memberDao.selectTotalDataCount(connection, adminIdx);
    connection.release();
    return totalDataCountResult;

  } catch (error) {
    handleError(error);
    connection.release();
    return errResponse(baseResponseStatus.DB_ERRORS);
  }
};

// API NO. 4.1 - Validation Check's adminIdx Status
exports.checkAdminIdxStatus = async function (adminIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const handleError = (error) => logger.error(`❌checkClubStatus DB Error: ${error.message}`);

  //Try문 예외처리
  try {
    const adminIdxStatusParams = [adminIdx, userIdx];
    const adminIdxStatus = await memberDao.selectAdminIdxStatus(connection, adminIdxStatusParams);
    connection.release();
    return adminIdxStatus;

  } catch (error) {
    handleError(error);
    connection.release();
    return errResponse(baseResponseStatus.DB_ERRORS);
  }
};


// 회원 상세 조회 - API NO. 4.2
exports.retrieveMemberInfo = async function (retrieveUserIdx, adminIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const handleError = (error) => logger.error(`❌retrieveMemberInfo DB Error: ${error.message}`);

  //Try문 예외처리
  try {
    // Validation Check's adminIdx Status (middle)
    const adminIdxStatusParams = [adminIdx, userIdx]
    const adminIdxStatus = await memberDao.selectAdminIdxStatus(connection, adminIdxStatusParams);
    if (adminIdxStatus[0]?.status != "ACTIVE"){
      return errResponse(baseResponseStatus.USER_ADMINIDX_STATUS);
    }

    // Validation Check's retrieveUserIdx Status (middle)
    const retrieveUserIdxStatusParams = [adminIdx, retrieveUserIdx];
    const retrieveUserIdxStatus = await memberDao.selectRetrieveUserIdxStatus(connection, retrieveUserIdxStatusParams);
    if (retrieveUserIdxStatus[0]?.status != "ACTIVE"){
      return errResponse(baseResponseStatus.USER_RETRIEVEUSERIDX_STATUS);
    }

    const memberInfo = await memberDao.selectMemberInfo(connection, retrieveUserIdx);
    connection.release();
    return memberInfo;

  } catch (error) {
    handleError(error);
    connection.release();
    return errResponse(baseResponseStatus.DB_ERRORS);
  }
};

// API NO. 4.2 - User Status Check
exports.checkUserStatus = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const handleError = (error) => logger.error(`❌checkUserStatus DB Error: ${error.message}`);

  //Try문 예외처리
  try {
    const userStatus = await memberDao.selectUserStatus(connection, userIdx);
    connection.release();
    return userStatus[0]?.status;

  } catch (error) {
    handleError(error);
    connection.release();
    return errResponse(baseResponseStatus.DB_ERRORS);
  }
};