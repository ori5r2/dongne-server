const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const scheduleProvider = require("./scheduleProvider");
const scheduleService = require("./scheduleService");
const moment = require("moment");

/**
 * API No. 5.1
 * API Name : 스케줄 생성 API
 * [POST] /schedule
 */
exports.postSchedule = async function (req, res) {
  // body : groupIdx, date, init_time, end_time, introduction, place, scheduleName
  const {
    groupIdx,
    scheduleDate,
    init_time,
    end_time,
    introduction,
    place,
    scheduleName,
  } = req.body;

  if (
    !groupIdx ||
    !scheduleDate ||
    !init_time ||
    !end_time ||
    !introduction ||
    !place ||
    !scheduleName
  ) {
    return res.send(response(baseResponse.SCHEDULE_POST_PARAMS_EMPTY));
  }

  // groupIdx validation
  if (!groupIdx) {
    return res.send(errResponse(baseResponse.GROUP_GROUPIDX_EMPTY));
  } else if (groupIdx <= 0) {
    return res.send(errResponse(baseResponse.GROUP_GROUPIDX_LENGTH));
  }

  // scheduleDate valid
  if (
    scheduleDate &&
    !moment(scheduleDate, "YYYY/MM/DD", true).isValid() &&
    !moment(scheduleDate, "YYYY-MM-DD", true).isValid()
  ) {
    return res.send(errResponse(baseResponse.SCHEDULE_SCHEDULEDATE_VALID));
  }

  // init_time valid
  if (
    init_time &&
    !moment(init_time, "YYYY/MM/DD HH:mm:ss", true).isValid() &&
    !moment(init_time, "YYYY-MM-DD HH:mm:ss", true).isValid()
  ) {
    return res.send(errResponse(baseResponse.SCHEDULE_INITTIME_VALID));
  }

  // end_time valid
  if (
    end_time &&
    !moment(end_time, "YYYY/MM/DD HH:mm:ss", true).isValid() &&
    !moment(end_time, "YYYY-MM-DD HH:mm:ss", true).isValid()
  ) {
    return res.send(errResponse(baseResponse.SCHEDULE_ENDTIME_VALID));
  }

  // introduction valid
  if (introduction && introduction.length > 150) {
    return res.send(errResponse(baseResponse.SCHEDULE_INTRODUCTION_LENGTH));
  }

  // place valid
  if (place && place.length > 50) {
    return res.send(errResponse(baseResponse.SCHEDULE_PLACE_LENGTH));
  }

  //scheduleName valid
  if (scheduleName && scheduleName.length > 100) {
    return res.send(errResponse(baseResponse.SCHEDULE_SCHEDULENAME_LENGTH));
  }

  const attendanceCode = (Math.random() + 1).toString(36).substring(5);
  const postScheduleParams = [
    groupIdx,
    scheduleDate,
    attendanceCode,
    init_time,
    end_time,
    introduction,
    place,
    scheduleName,
  ];

  const postScheduleResult = await scheduleService.postSchedule(
    postScheduleParams
  );

  return res.send(postScheduleResult);
};

/**
 * API No. 5.2
 * API Name : 스케줄 리스트 조회 API
 * [GET] /schedule/list/:groupIdx
 */
exports.getSchedule = async function (req, res) {
  // Path Variable: groupIdx
  const groupIdx = req.params.groupIdx;

  // groupIdx validation
  if (!groupIdx) {
    return res.send(errResponse(baseResponse.GROUP_GROUPIDX_EMPTY));
  } else if (groupIdx <= 0) {
    return res.send(errResponse(baseResponse.GROUP_GROUPIDX_LENGTH));
  }

  const scheduleListResponse = await scheduleProvider.retrieveScheduleList(
    groupIdx
  );
  return res.send(scheduleListResponse);
};

/**
 * API No. 5.3
 * API Name : 스케줄 상세 조회 API
 * [GET] /schedule/:scheduleIdx
 */

exports.getScheduleInfo = async function (req, res) {
  // Path Variable: scheduleIdx
  const scheduleIdx = req.params.scheduleIdx;

  // scheduleIdx validation
  if (!scheduleIdx) {
    return res.send(errResponse(baseResponse.SCHEDULE_SCHEDULEIDX_EMPTY));
  } else if (scheduleIdx <= 0) {
    return res.send(errResponse(baseResponse.SCHEDULE_SCHEDULEIDX_LENGTH));
  }

  const scheduleInfoResponse = await scheduleProvider.retrieveScheduleInfo(
    scheduleIdx
  );

  return res.send(scheduleInfoResponse);
};

/**
 * API No. 5.4
 * API Name : 스케줄 수정 API
 * [PATCH] /schedule/:scheduleIdx
 */
exports.patchSchedule = async function (req, res) {
  // path variable
  const scheduleIdx = req.params.scheduleIdx;

  // scheduleIdx validation
  if (!scheduleIdx) {
    return res.send(errResponse(baseResponse.SCHEDULE_SCHEDULEIDX_EMPTY));
  } else if (scheduleIdx <= 0) {
    return res.send(errResponse(baseResponse.SCHEDULE_SCHEDULEIDX_LENGTH));
  }

  // body : scheduleDate, init_time, end_time, introduction, place, scheduleName
  const editScheduleParams = req.body;

  // scheduleDate valid
  if (
    editScheduleParams.scheduleDate &&
    !moment(editScheduleParams.scheduleDate, "YYYY/MM/DD", true).isValid() &&
    !moment(editScheduleParams.scheduleDate, "YYYY-MM-DD", true).isValid()
  ) {
    return res.send(errResponse(baseResponse.SCHEDULE_SCHEDULEDATE_VALID));
  }

  // init_time valid
  if (
    editScheduleParams.init_time &&
    !moment(
      editScheduleParams.init_time,
      "YYYY/MM/DD HH:mm:ss",
      true
    ).isValid() &&
    !moment(editScheduleParams.init_time, "YYYY-MM-DD HH:mm:ss", true).isValid()
  ) {
    return res.send(errResponse(baseResponse.SCHEDULE_INITTIME_VALID));
  }

  // end_time valid
  if (
    editScheduleParams.end_time &&
    !moment(
      editScheduleParams.end_time,
      "YYYY/MM/DD HH:mm:ss",
      true
    ).isValid() &&
    !moment(editScheduleParams.end_time, "YYYY-MM-DD HH:mm:ss", true).isValid()
  ) {
    return res.send(errResponse(baseResponse.SCHEDULE_ENDTIME_VALID));
  }

  // introduction valid
  if (
    editScheduleParams.introduction &&
    editScheduleParams.introduction.length > 150
  ) {
    return res.send(errResponse(baseResponse.SCHEDULE_INTRODUCTION_LENGTH));
  }

  // place valid
  if (editScheduleParams.place && editScheduleParams.place.length > 50) {
    return res.send(errResponse(baseResponse.SCHEDULE_PLACE_LENGTH));
  }

  //scheduleName valid
  if (
    editScheduleParams.scheduleName &&
    editScheduleParams.scheduleName.length > 100
  ) {
    return res.send(errResponse(baseResponse.SCHEDULE_SCHEDULENAME_LENGTH));
  }

  // edit
  const editScheduleResponse = await scheduleService.editSchedule(
    scheduleIdx,
    editScheduleParams
  );

  return res.send(editScheduleResponse);
};

/**
 * API No. 5.5
 * API Name : 스케줄 삭제 API
 * [PATCH] /schedule/:scheduleIdx/status
 */
exports.patchScheduleStatus = async function (req, res) {
  // Path Variable: scheduleIdx
  const scheduleIdx = req.params.scheduleIdx;

  // scheduleIdx validation
  if (!scheduleIdx) {
    return res.send(errResponse(baseResponse.SCHEDULE_SCHEDULEIDX_EMPTY));
  } else if (scheduleIdx <= 0) {
    return res.send(errResponse(baseResponse.SCHEDULE_SCHEDULEIDX_LENGTH));
  }

  const editScheduleStatusResponse = await scheduleService.editScheduleStatus(
    scheduleIdx
  );
  return res.send(editScheduleStatusResponse);
};
