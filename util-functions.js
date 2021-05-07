/**
 * To calculate the current streak
 * We start from the end i.e., the current that should be logged
 * to maintain the streak and check for consecutive days
 * if previous consecutive day is not present break out of the loop
 * and return the streak
 * @param {info[]} logs record.info array with all the records
 * @param {number} startDate record.startDate time in milliseconds of the first record
 * @returns {Promise<number>} streak in number of days
 */
const calculateStreak = async (logs, startDate) => {
  // if empty array
  if (logs.length < 1) return 0
  //to get the day count for current time that should be logged
  day = await totalDays(startDate)
  str = 1
  n = logs.length - 1
  
  //if log for current day is not present streak = 0
  if (day != logs[n].date) return 0
  else {
    //loop backwards and check for consecutive days
    while (n--)
      //if consecutive day found update @variable day and str
      if (day - logs[n].date == 1) {
        day = logs[n].date
        str++
      }
      //if not consecutive day and not even the same day then streak break
      else if (day - logs[n].date != 0) break
    return str
  }
}

/**
 * To calculate the maximum streak that was achieved in the given
 * array of logs, same way as @function calculateStreak but not breaking the loop,
 * instead we just check if the streak is greater than previous maximum streak.
 * @param {info[]} logs record.info array of all logs
 * @param {number} startDate record.startDate time in milliseconds of the first log
 * @returns {Promise<number>} the maximum streak achieved in the logs
 */
const maxStreak = async (logs, startDate) => {
  if (logs.length < 1) return 0
  curr = 1
  n = logs.length - 1
  max = 0
  day = logs[n].date
  while (n--) {
    //if consecutive day streak plus 1
    if (day - logs[n].date == 1) curr++
    //if not same day check if streak greater than max streak
    else if (day - logs[n].date != 0) {
      if (curr > max) max = curr
      curr = 1
    }
    //update day for each record
    day = logs[n].date
  }
  return max > curr ? max : curr
}

/**
 * To calculate the number of days it has been passed
 * since the day of first log, we subtract to get the number of milliseconds
 * then divide by the number of milliseconds in a day (24*60*60*1000),
 * adding 1 to get the number of days and return its floor value
 * @param {number} startDate record.startDate time in milliseconds since first log
 * @returns {Promise<number>} current day since first log
 */
const totalDays = async (startDate) =>
  Math.floor(1 + (Date.now() - startDate) / (1000 * 3600 * 24))

/**
 * to calculate all distinct days that has been logged for the array
 * we move left from right and count for all the days that were not
 * equal to the current day
 * @param {info[]} logs record.info array of all logs
 * @returns {Promise<number>} number of days logged
 */
const totalDistinct = async (logs) => {
  if (logs.length < 1) return 0
  n = logs.length - 1
  day = logs[n].date
  ans = 1
  while (n--)
    if (day - logs[n].date) {
      day = logs[n].date
      ans++
    }
  return ans
}

module.exports = {
  calculateStreak,
  maxStreak,
  totalDays,
  totalDistinct,
}
