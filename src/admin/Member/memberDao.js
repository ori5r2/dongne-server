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
const selectClub = async (connection, adminIdx) => {
    const selectClubMemberQuery = `
        SELECT name, userImgUrl
        FROM ClubMembers
        JOIN User
        ON ClubMembers.userIdx = User.userIdx
        WHERE adminIdx = ? and User.status = "ACTIVE";       
        `;

    const [clubMemberRows] = await connection.query(selectClubMemberQuery, adminIdx);
  
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

// 회원 상세 조회 - API NO. 3.3
const selectMemberInfo = async (connection, userIdx) => {
  const selectMemberInfoQuery = `
  SELECT name as 이름,
  phoneNum as 전화번호,
  school as 학교,
  birth as 생년월일,
  address as 주소,
  introduction as 소개
  FROM User
  WHERE userIdx = ?
      `;

  const [memberInfoRows] = await connection.query(selectMemberInfoQuery, userIdx);

  return memberInfoRows;
};

// API NO. 3.3 - User Status Check
const selectUserStatus = async (connection, userIdx) => {
  const selectUserStatusQuery = `
      SELECT status
      FROM User
      WHERE userIdx = ?;
      `;

  const [userStatusRows] = await connection.query(selectUserStatusQuery, userIdx);

  return userStatusRows;
};


  module.exports = 
  { selectUserPosts,
    selectClub,
    selectClubStatus,
    selectMemberInfo,
    selectUserStatus,


    
  };

  
  