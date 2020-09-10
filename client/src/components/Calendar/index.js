import React, { useState } from "react";
// import { useQuery } from "@apollo/client";
// import moment from "moment";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import styled from "styled-components";

// import { GET_RUNS_BY_DATE_RANGE } from "../../graphql/queries";
// import { useAuth } from "../../context/AuthContext";
// import Loader from "../Loader";
import { LittleButton } from "../../elements";
import { colors } from "../../styles";

let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);

const CalendarView = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(todayTimestamp);

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
    let timestamp = new Date(args.year, args.month, _date).getTime();
    return {
      date: _date,
      day,
      month,
      timestamp,
      dayString: daysMap[day]
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
    return monthArray;
  }

  const [monthDetails, setMonthDetails] = useState(getMonthDetails(year, month));

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

  const setNewYear = (offset) => {
    let newYear = year + offset;
    let newMonth = month;
    setYear(newYear);
    setMonthDetails(getMonthDetails(newYear, newMonth));
  }

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
    setMonthDetails(getMonthDetails(newYear, newMonth));
  }

  // const value = useAuth();
  // const { username } = value.viewerQuery.data.viewer.profile;

  // const { data, loading } = useQuery(GET_RUNS_BY_DATE_RANGE, {
  //   variables: {
  //     query: { 
  //       username,
  //       startDate: "2020-08-31T19:26:11.000Z",
  //       endDate: "2020-09-05T19:25:18.891Z"
  //     }
  //   }
  // });

  // if (loading) {
  //   return <Loader />
  // }

  const renderCalendar = () => {
    let days = monthDetails.map((day, index) => {
      return (
        <DayBox key={`day${index}`} dark={day.month !== 0}>
          <DateContainer>
            {day.date}
          </DateContainer>
        </DayBox>
      )
    })

    return (
      <div>
        <MonthHeader>
          <h3>{getMonthStr(month)} {" "} {year}</h3>
          <ButtonContainer>
            <PrevNextButton 
              type="button"
              onClick={() => setNewMonth(-1)}
            >
              <AiOutlineLeft />
            </PrevNextButton>
            <PrevNextButton 
              type="button"
              onClick={() => setNewMonth(1)}
            >
              <AiOutlineRight />
            </PrevNextButton>
          </ButtonContainer>
        </MonthHeader>
        <WeekContainer>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
            <WeekdayHeader key={`weekdayheader${i}`}>{d}</WeekdayHeader>
          ))}
        </WeekContainer>
        <WeekContainer>
          {days}
        </WeekContainer>
      </div>
    )
  }

  return (
    <CalendarSection>
      {renderCalendar()}
    </CalendarSection>
  );
};

export default CalendarView;

const CalendarSection = styled.section`
  padding: 10px 0;
`;

const WeekContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: var(--step-0);

  h3 {
    font-size: var(--step-0);
    font-weight: 600;
  }
`;

const WeekdayHeader = styled.div`
  border-bottom: 1px solid ${colors.primary};
  font-size: var(--step-0);
  font-weight: 600;
  padding: 0.5rem;
  text-align: center;
`;

const DateContainer = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: var(--step--1);
  font-weight: 600;
`;

const DayBox = styled.div`
  position: relative;
  background-color: ${props => props.dark === true ? colors.backgroundDark : colors.background};
  border-left: 1px solid ${colors.defaultColor};
  border-bottom: 1px solid ${colors.defaultColor};

  &:nth-of-type(7n) {
    border-right: 1px solid ${colors.defaultColor};
  }

  &:before {
    content: "";
    display: block;
    padding-top: 100%;
  }

  &:hover,
  &:focus-within {
    box-shadow: inset 0px 0px 0px 2px ${colors.primary};
  }
`;

const PrevNextButton = styled(LittleButton)`
  background-color: transparent;

  &:hover,
  &:focus {
    background-color: ${colors.primary};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  > * + * {
    margin-left: 2rem;
  }
`;