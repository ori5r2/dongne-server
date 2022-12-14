// DB Test
const selectUserPosts = async (connection) => {
    const selectTestUserQuery = `
          SELECT *
          FROM User
          ;
        `;
    const [testResult] = await connection.query(selectTestUserQuery);
  
    return testResult;
  };

// 단체 모든 회원명단 리스트 조회 (SELECT) - API NO. 3.1
const selectClub = async (connection, clubMembersPagingParams) => {
    const selectClubMemberQuery = `
    SELECT name, userImgUrl,
    teamName
    FROM ClubMembers
    JOIN User
    ON ClubMembers.userIdx = User.userIdx
    JOIN ClubTeamList
    ON ClubMembers.clubTeamListIdx = ClubTeamList.clubTeamListIdx
    WHERE ClubMembers.adminIdx = ? and User.status = "ACTIVE" and ClubMembers.status = "ACTIVE"
    LIMIT ?, ?;
        `;

    const [clubMemberRows] = await connection.query(selectClubMemberQuery, clubMembersPagingParams);
  
    return clubMemberRows;
  };

// API NO. 3.1 - Admin status (SELECT)
const selectClubStatus = async (connection, adminIdx) => {
  const selectClubStatusQuery = `
      SELECT status
      FROM Admin
      WHERE adminIdx = ?;
      `;

  const [clubStatusRows] = await connection.query(selectClubStatusQuery, adminIdx);

  return clubStatusRows;
};

// API NO. 3.1 - Paging's Total Data Count
const selectTotalDataCount = async (connection, adminIdx) => {
  const selectTotalDataCountQuery = `
    SELECT COUNT(adminIdx) as totalDataCount
    FROM ClubMembers
    WHERE adminIdx = ?;
      `;

  const [totalDataCountRows] = await connection.query(selectTotalDataCountQuery, adminIdx);

  return totalDataCountRows;
};


// 회원 상세 조회 - API NO. 3.2
const selectMemberInfo = async (connection, memberInfoParams) => {
  const selectMemberInfoQuery = `
    SELECT name as 이름,
    phoneNum as 전화번호,
    school as 학교,
    birth as 생년월일,
    address as 주소,
    introduction as 소개,
    teamName as "소속 팀/조"
    FROM User
    JOIN ClubMembers
    ON ClubMembers.userIdx = User.userIdx
    JOIN ClubTeamList
    ON ClubMembers.clubTeamListIdx = ClubTeamList.clubTeamListIdx
    WHERE User.userIdx = ? and ClubMembers.adminIdx = ?;
      `;

  const [memberInfoRows] = await connection.query(selectMemberInfoQuery, memberInfoParams);

  return memberInfoRows;
};

// API NO. 3.2 - User Status Check
const selectUserStatus = async (connection, userIdx) => {
  const selectUserStatusQuery = `
      SELECT status
      FROM User
      WHERE userIdx = ?;
      `;

  const [userStatusRows] = await connection.query(selectUserStatusQuery, userIdx);

  return userStatusRows;
};

// API NO. 3.2 - Token User with adminIdx Status Check
const selectTokenUserStatus = async (connection, TokenUserStatusParams) => {
  const selectTokenUserStatusQuery = `
      SELECT status
      FROM ClubMembers
      WHERE userIdx = ? and adminIdx = ?;
      `;

  const [tokenUserStatusRows] = await connection.query(selectTokenUserStatusQuery, TokenUserStatusParams);

  return tokenUserStatusRows;
};

// API NO. 3.2, API NO. 3.5 - Validation Check's member Status
const selectMemberStatus = async (connection, TokenUserStatusParams) => {
  const selectMemberStatusQuery = `
    SELECT
    ClubMembers.status,
    User.status as UserStatus
    FROM ClubMembers
    JOIN User
    ON User.userIdx = ClubMembers.userIdx
    WHERE ClubMembers.userIdx = ? and adminIdx = ?;
      `;

  const [tokenUserStatusRows] = await connection.query(selectMemberStatusQuery, TokenUserStatusParams);

  return tokenUserStatusRows;
};

// 회원 삭제 - API NO. 3.3
const editMember = async (connection, editMemberParams) => {
  const updateMemberQuery = `
    UPDATE ClubMembers
    SET status = "DELETED"
    WHERE userIdx = ? and adminIdx = ?;
      `;

  const [updateMemberRows] = await connection.query(updateMemberQuery, editMemberParams);

  return updateMemberRows;
};

// 동아리의 회원 팀/조 카테고리 추가 - API NO. 3.4
const createClubTeam = async (connection, createClubTeamParams) => {
  const insertClubTeamQuery = `
    INSERT INTO ClubTeamList (adminIdx, teamName)
    VALUE (?, ?);
      `;

  const [insertClubTeamRows] = await connection.query(insertClubTeamQuery, createClubTeamParams);

  return insertClubTeamRows;
};

// API NO. 3.5 Validation Check's clubTeamListIdx Status
const selectClubTeamListIdxStatus = async (connection, clubTeamListIdxStatusParams) => {
  const selectClubTeamListIdxStatusQuery = `
    SELECT status
    FROM ClubTeamList
    WHERE clubTeamListIdx = ? and adminIdx = ?;
      `;

  const [clubTeamListIdxStatusRows] = await connection.query(selectClubTeamListIdxStatusQuery, clubTeamListIdxStatusParams);

  return clubTeamListIdxStatusRows;
};

// 동아리 소속회원 팀/조 카테고리 적용 - API NO. 3.5
const updateMemberClubTeam = async (connection, updateMemberClubTeamParams) => {
  const updateMemberClubTeamQuery = `
    UPDATE ClubMembers
    SET clubTeamListIdx = ?
    WHERE userIdx = ? and adminIdx = ?;
      `;

  const [updateMemberClubTeamRows] = await connection.query(updateMemberClubTeamQuery, updateMemberClubTeamParams);

  return updateMemberClubTeamRows;
};

  module.exports = 
  { selectUserPosts,
    selectClub,
    selectClubStatus,
    selectTotalDataCount,
    selectMemberInfo,
    selectUserStatus,
    selectTokenUserStatus,
    selectMemberStatus,
    editMember,
    createClubTeam,
    selectClubTeamListIdxStatus,
    updateMemberClubTeam,

    
  };

  
  
