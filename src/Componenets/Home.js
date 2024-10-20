import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';
import ContestTable from './ContestTable';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      codeforcesContests: [],
      leetcodeWeeklyContests: [],
      leetcodeBiweeklyContests: [],
      codechefContests: [],
      showMoreCF: 1,
    };
  }

  componentDidMount() {
    axios.get(`https://codeforces.com/api/contest.list`)
      .then(res => {
        const { status, result } = res.data;
        if (status === 'OK') {
          const upcomingCFContests = result.filter(contest => contest.startTimeSeconds > Math.floor(Date.now() / 1000));
          this.setState({
            codeforcesContests: upcomingCFContests,
          });
        }
      });

    const { weeklyContests, biweeklyContests } = this.getLeetCodeContests();
    const codechefContests = this.getCodeChefContests();

    this.setState({
      leetcodeWeeklyContests: weeklyContests,
      leetcodeBiweeklyContests: biweeklyContests,
      codechefContests: codechefContests,
    });

    document.title = "Contest Page";
  }

  getLeetCodeContests() {
    const weeklyContests = [];
    const biweeklyContests = [];
    let currentDate = new Date();
    const sundays = this.getNextRecurringDates(currentDate, 7, 8, 0);
    const saturdays = this.getNextRecurringDates(currentDate, 6, 20, 0);

    const now = Math.floor(Date.now() / 1000); 
    for (let i = 0; i < sundays.length; i++) {
      const startTimeSeconds = Math.floor(sundays[i].getTime() / 1000);
      if (startTimeSeconds > now) {

        weeklyContests.push({
          name: `Weekly Contest ${421 + i}`,
          phase: "UPCOMING",
          id: 421 + i,
          startTimeSeconds: startTimeSeconds,
        });
      }
    }

    for (let i = 0; i < saturdays.length; i++) {
      const startTimeSeconds = Math.floor(saturdays[i].getTime() / 1000);
      if (startTimeSeconds > now) {
        biweeklyContests.push({
          name: `Biweekly Contest ${124 + i}`,
          phase: "UPCOMING",
          id: 124 + i,
          startTimeSeconds: startTimeSeconds,
        });
      }
    }

    return { weeklyContests, biweeklyContests };
  }

  getCodeChefContests() {
    const contests = [];
    let currentDate = new Date();
    const wednesdays = this.getNextRecurringDates(currentDate, 3, 20, 0);
    const now = Math.floor(Date.now() / 1000); 
    for (let i = 0; i < wednesdays.length; i++) {
      const startTimeSeconds = Math.floor(wednesdays[i].getTime() / 1000);
      if (startTimeSeconds > now) {
        contests.push({
          name: `Starters ${157 + i}`,
          phase: "UPCOMING",
          id: 157 + i,
          startTimeSeconds: startTimeSeconds,
        });
      }
    }

    return contests;
  }

  getNextRecurringDates(startDate, targetWeekday, targetHour, targetMinute, alternateWeeks = false) {
    const dates = [];
    let date = new Date(startDate);

    date.setDate(date.getDate() + (targetWeekday + 7 - date.getDay()) % 7);

    for (let i = 0; i < 10; i++) {
      const nextContest = new Date(date);
      nextContest.setHours(targetHour, targetMinute, 0, 0);

      dates.push(nextContest);
      date.setDate(date.getDate() + (alternateWeeks ? 14 : 7));
    }

    return dates;
  }

  toggleShowMoreCF = () => {
    this.setState(prevState => ({
      showMoreCF: prevState.showMoreCF,
    }));
  }

  render() {
    const { codeforcesContests, leetcodeWeeklyContests, leetcodeBiweeklyContests, codechefContests, showMoreCF } = this.state;

    const upcomingLeetCodeWeekly = leetcodeWeeklyContests.filter(c => c.phase === "UPCOMING").slice(0, 2);
    const upcomingLeetCodeBiweekly = leetcodeBiweeklyContests.filter(c => c.phase === "UPCOMING").slice(0, 2);
    const upcomingCodeChef = codechefContests.filter(c => c.phase === "UPCOMING").slice(0, 3);

    return (
      <div className="container">
        <h1 className="text-align">Contests</h1>

        <h2>Codeforces Contests</h2>
        <ContestTable 
          contests={[...codeforcesContests].reverse()}  
          platform="codeforces" 
        />

        <h2>LeetCode Contests</h2>
        <h3>Weekly Contests</h3>
        <ContestTable contests={upcomingLeetCodeWeekly} platform="leetcode" />

        <h3>Biweekly Contests</h3>
        <ContestTable contests={upcomingLeetCodeBiweekly} platform="leetcode" />

        <h2>CodeChef Contests</h2>
        <h3>Upcoming</h3>
        <ContestTable contests={upcomingCodeChef} platform="codechef" />
      </div>
    );
  }
}

export default Home;
