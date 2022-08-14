const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const accountDao = require("./finAccountDao");

export const getRecentFinAccount = async (adminIdxNum) => {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const getRecentFinAccountResult = await accountDao.retrieveFinAccount(connection, adminIdxNum);
    connection.release();
    return response(baseResponse.SUCCESS, getRecentFinAccountResult[0]);
  } catch (error) {
    connection.release();
    logger.error(`Admin - getRecentFinAccount Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
