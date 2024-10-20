import React from 'react';
import Moment from 'react-moment';

const ContestTable = ({ contests, platform }) => {
  const biweeklyContests = contests.filter(contest => contest.name.includes("Biweekly"));
  const otherContests = contests
    .filter(contest => !contest.name.includes("Biweekly")) 
    .filter(contest => contest.phase !== "FINISHED" && contest.phase !== "PENDING_SYSTEM_TEST");
  return (
    <div>
      {otherContests.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Contest Name</th>
              <th>Link</th>
              <th>Start Date</th>
            </tr>
          </thead>
          <tbody>
            {otherContests.map(contest => (
              <tr key={contest.id}>
                <td>{contest.name}</td>
                <td>
                  <a href={generateLink(platform, contest)} target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
                <td>
                  <Moment unix format="MMMM Do YYYY, h:mm:ss a">
                    {contest.startTimeSeconds}
                  </Moment>
                  <br />
                  (<Moment fromNow>{contest.startTimeSeconds * 1000}</Moment>)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {biweeklyContests.length > 0 && (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Contest Name</th>
                <th>Link</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {biweeklyContests.map(contest => (
                <tr key={contest.id}>
                  <td>{contest.name}</td>
                  <td>
                    <a href={generateLink(platform, contest)} target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  </td>
                  <td>
                    <Moment unix format="MMMM Do YYYY, h:mm:ss a">
                      {contest.startTimeSeconds}
                    </Moment>
                    <br />
                    (<Moment fromNow>{contest.startTimeSeconds * 1000}</Moment>)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

const generateLink = (platform, contest) => {
  if (platform === "codeforces") {
    return `https://codeforces.com/contest/${contest.id}`;
  } else if (platform === "leetcode") {

    if (contest.name.includes("Weekly")) {
      return `https://leetcode.com/contest/weekly-contest-${contest.id}`;
    } else if (contest.name.includes("Biweekly")) {
      return `https://leetcode.com/contest/biweekly-contest-${contest.id}`;
    }
  } else if (platform === "codechef") {
    return `https://www.codechef.com/START${contest.id}B`;
  }
};

export default ContestTable;
