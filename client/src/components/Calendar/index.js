import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import { GET_RUNS_BY_DATE_RANGE } from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader";
import CalendarMonth from "./CalendarMonth";

// let oneDay = 60 * 60 * 24 * 1000;
// let todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);

const CalendarView = () => {
  const value = useAuth();
  const { username } = value.viewerQuery.data.viewer.profile;
  const [getRuns, { loading, data }] = useLazyQuery(GET_RUNS_BY_DATE_RANGE);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  // const [selectedDay, setSelectedDay] = useState(todayTimestamp);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [monthDetails, setMonthDetails] = useState();


  const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getDayDetails = (args) => {
    let date = args.index - args.firstDay;
    let day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = args.year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
    let _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
    let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    let _month = month < 0 ? prevMonth : month > 0 ? args.month + 1 : args.month;
    let timestamp = new Date(args.year, _month, _date).getTime();
    return {
      date: _date,
      day,
      month,
      timestamp,
      dayString: daysMap[day],
      runs: []
    }
  }

  const getNumberOfDays = (year, month) => {
    return 40 - new Date(year, month, 40).getDate();
  }

  const getMonthDetails = (year, month) => {
    let firstDay = (new Date(year, month)).getDay();
    let numberOfDays = getNumberOfDays(year, month);
    let monthArray = [];
    let rows = 6;
    let currentDay = null;
    let index = 0;
    let cols = 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        currentDay = getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month
        });
        monthArray.push(currentDay);
        index++;
      }
    }

    setStartDate(new Date(monthArray[0].timestamp).toISOString());
    setEndDate(new Date(monthArray[monthArray.length - 1].timestamp).toISOString());

    return monthArray;
  }

  // const isCurrentDay = (day) => {
  //   return day.timestamp === todayTimestamp;
  // }

  // const isSelectedDay = (day) => {
  //   return day.timestamp === selectedDay;
  // }

  // const getDateFromDateString = (dateValue) => {
  //   let dateData = dateValue.split('-').map(d => parseInt(d, 10));
  //   if (dateData.length < 3)
  //     return null;

  //   let year = dateData[0];
  //   let month = dateData[1];
  //   let date = dateData[2];
  //   return { year, month, date };
  // }

  const getMonthStr = (month) => monthMap[Math.max(Math.min(11, month), 0)] || 'Month';

  // const getDateStringFromTimestamp = (timestamp) => {
  //   let dateObject = new Date(timestamp);
  //   let month = dateObject.getMonth() + 1;
  //   let date = dateObject.getDate();
  //   return dateObject.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
  // }

  // const setDate = (dateData) => {
  //   let newSelectedDay = new Date(dateData.year, dateData.month - 1, dateData.date).getTime();
  //   setSelectedDay(newSelectedDay);
  //   if (this.props.onChange) {
  //     this.props.onChange(selectedDay);
  //   }
  // }

  // const updateDateFromInput = () => {
  //   let dateValue = inputRef.current.value;
  //   let dateData = getDateFromDateString(dateValue);
  //   if (dateData !== null) {
  //     setDate(dateData);
  //     setYear(dateData.year);
  //     setMonth(dateData.month - 1);
  //     setMonthDetails(getMonthDetails(dateData.year, dateData.month - 1));
  //   }
  // }

  // const setDateToInput = (timestamp) => {
  //   let dateString = getDateStringFromTimestamp(timestamp);
  //   inputRef.current.value = dateString;
  // }

  // const setNewYear = (offset) => {
  //   let newYear = year + offset;
  //   let newMonth = month;
  //   setYear(newYear);
  //   setMonthDetails(getMonthDetails(newYear, newMonth));
  // }

  const setNewMonth = (offset) => {
    let newYear = year;
    let newMonth = month + offset;
    if (newMonth === -1) {
      newMonth = 11;
      newYear--;
    } else if (newMonth === 12) {
      newMonth = 0;
      newYear++;
    }
    setYear(newYear);
    setMonth(newMonth);
  }

  useEffect(() => {
    const newMonthArray = getMonthDetails(year, month);
    setMonthDetails(newMonthArray);
  }, [year, month]);

  useEffect(() => {
    getRuns({
      variables: {
        query: { username, startDate, endDate }
      },
      fetchPolicy: "no-cache"
    });
  }, [startDate, endDate]);

  if (loading) {
    return <Loader />
  } else {
    if (data && data.runsByDateRange) {
      const { edges } = data.runsByDateRange;

      for (let i = 0; i < edges.length; i++) {
        // generate a timestamp that only takes into account year, month and date
        const runFullDate = new Date(edges[i].node.start);
        const runYear = runFullDate.getFullYear();
        const runMonth = runFullDate.getMonth();
        const runDay = runFullDate.getDate();
        const runTimestamp = new Date(runYear, runMonth, runDay).getTime();

        // find index of a matching timestamp in monthDetails
        const index = monthDetails.findIndex(dayObject => dayObject.timestamp === runTimestamp);
        // push current edge.node into the runs array at that index in monthDetails
        if (index !== -1) {
          // Make sure current edge.node isn't already in this runs array
          const runsArrayIndex = monthDetails[index].runs.findIndex(run => run.id === edges[i].node.id);
          if (runsArrayIndex === -1) {
            monthDetails[index].runs.push(edges[i].node);
          }
        }
      }
    }
    
    return (
      <CalendarMonth 
        monthDetails={monthDetails}
        month={getMonthStr(month)}
        year={year}
        setNewMonth={setNewMonth} 
      />
    );
  }
};

export default CalendarView;
