export const getMonthStr = (month) => {
  const monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return monthMap[Math.max(Math.min(11, month), 0)] || 'Month';
}

export const getNumberOfDays = (year, month) => {
  return 40 - new Date(year, month, 40).getDate();
}

export const getDayDetails = (args) => {
  const date = args.index - args.firstDay;
  const day = args.index % 7;
  let prevMonth = args.currentMonth - 1;
  let prevYear = args.currentYear;

  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }

  const prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
  const _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
  const month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
  const _month = month < 0 ? prevMonth : month > 0 ? args.currentMonth + 1 : args.currentMonth;
  const timestamp = new Date(args.currentYear, _month, _date).getTime();

  return {
    date: _date,
    day,
    month,
    timestamp,
    runs: []
  }
}

export const getMonthDetails = (currentYear, currentMonth, edges = []) => {
  let firstDay = (new Date(currentYear, currentMonth)).getDay();
  let numberOfDays = getNumberOfDays(currentYear, currentMonth);
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
        currentYear,
        currentMonth
      });
      monthArray.push(currentDay);
      index++;
    }
  }

  // Populate month array with run data from edges
  for (let i = 0; i < edges.length; i++) {
    // generate a timestamp that only takes into account year, month and date
    const runFullDate = new Date(edges[i].node.start);
    const runYear = runFullDate.getFullYear();
    const runMonth = runFullDate.getMonth();
    const runDay = runFullDate.getDate();
    const runTimestamp = new Date(runYear, runMonth, runDay).getTime();

    // find index of a matching timestamp in monthArray
    const index = monthArray.findIndex(dayObject => dayObject.timestamp === runTimestamp);

    // push current edge.node into the runs array at that index in monthArray
    if (index !== -1) {
      // Make sure current edge.node isn't already in this runs array
      const runsArrayIndex = monthArray[index].runs.findIndex(run => run.id === edges[i].node.id);
      if (runsArrayIndex === -1) {
        monthArray[index].runs.push(edges[i].node);
      }
    }
  }

  return monthArray;
}
