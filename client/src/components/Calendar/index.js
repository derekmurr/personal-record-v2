import React, { useState } from "react";
import { useQuery } from "@apollo/client";

import { GET_RUNS_BY_DATE_RANGE } from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";
import { getDayDetails, getMonthDetails, getNumberOfDays } from "./helpers";
import Loader from "../Loader";
import CalendarMonth from "./CalendarMonth";

const CalendarView = () => {
  const value = useAuth();
  const { username } = value.viewerQuery.data.viewer.profile;

  // Initialize today
  const today = new Date();

  // Initialize currentMonth and currentYear, defaults based on today
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const firstDay = (new Date(currentYear, currentMonth)).getDay();
  const numberOfDays = getNumberOfDays(currentYear, currentMonth);
  
  // Determine startDate and endDate based on currentMonth and currentYear
  const startDayObject = getDayDetails({
    index: 0,
    numberOfDays,
    firstDay,
    currentYear,
    currentMonth
  });
  const endDayObject = getDayDetails({
    index: 41,
    numberOfDays,
    firstDay,
    currentYear,
    currentMonth
  });

  const [startDate, setStartDate] = useState(new Date(startDayObject.timestamp).toISOString());
  const [endDate, setEndDate] = useState(new Date(endDayObject.timestamp).toISOString());
  
  // Make query based on startDate and endDate
  
  const { data, loading } = useQuery(GET_RUNS_BY_DATE_RANGE, {
    variables: {
      query: { username, startDate, endDate }
    },
    fetchPolicy: "no-cache"
  });

  const setNewMonth = (offset) => {
    let newYear = currentYear;
    let newMonth = currentMonth + offset;
    if (newMonth === -1) {
      newMonth = 11;
      newYear--;
    } else if (newMonth === 12) {
      newMonth = 0;
      newYear++;
    }
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);

    const startDayObject = getDayDetails({
      index: 0,
      numberOfDays: getNumberOfDays(currentYear, currentMonth),
      firstDay: (new Date(currentYear, currentMonth)).getDay(),
      currentYear: newYear,
      currentMonth: newMonth
    });
    const endDayObject = getDayDetails({
      index: 41,
      numberOfDays: getNumberOfDays(currentYear, currentMonth),
      firstDay: (new Date(currentYear, currentMonth)).getDay(),
      currentYear: newYear,
      currentMonth: newMonth
    });

    setStartDate(new Date(startDayObject.timestamp).toISOString());
    setEndDate(new Date(endDayObject.timestamp).toISOString());
  }
  
  // Render Loader component while query works
  if (loading) {
    return <Loader />
  }

  // Build monthArray based on start date, end date, and query data
  const monthArray = getMonthDetails(currentYear, currentMonth, data?.runsByDateRange?.edges);
  
  // Render calendar, passing it monthArray
  return (
    <CalendarMonth
      monthArray={monthArray}
      currentMonth={currentMonth}
      currentYear={currentYear}
      setNewMonth={setNewMonth} 
    />
  );
}

export default CalendarView;