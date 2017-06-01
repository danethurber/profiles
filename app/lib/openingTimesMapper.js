const continuousTimeUtils = require('./continuousTimeUtils');

const daysOrderedForUi = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function isOpen(times) {
  return daysOrderedForUi.some((day) => {
    const daySessions = times[day.toLowerCase()];
    return daySessions && daySessions.length > 0;
  });
}

function mapWeek(times) {
  if (isOpen(times) === false) {
    return undefined;
  }
  const parsedTimes = [];

  daysOrderedForUi.forEach((day) => {
    const daySessions = times[day.toLowerCase()];
    const sessions = continuousTimeUtils.mapDay(daySessions);
    parsedTimes.push({ day, sessions });
  });
  return continuousTimeUtils.addTimePadding(parsedTimes, true);
}

function timesValid(allTimes) {
  // the source data always has both reception and surgery populated
  // if opening times exist
  return allTimes && allTimes.reception && allTimes.surgery;
}

function mapAll(allTimes) {
  return timesValid(allTimes) ? {
    reception: mapWeek(allTimes.reception),
    surgery: mapWeek(allTimes.surgery),
  } : {};
}

module.exports = {
  mapAll,
  mapWeek
};
