const calculateStreak = async (logs, startDate) => {
  if(logs.length<1)return 0
  day = await totalDays(startDate)
  str=1
  n=logs.length-1
  if(day!=logs[n].date)
    return 0
  else {
     while(n--)
      if(day-logs[n].date==1){
        day=logs[n].date
        str++
      } else if(day-logs[n].date!=0)
        break
    return str
  }
}

const maxStreak = async (logs, startDate) =>{
  if(logs.length<1)return 0
  curr=1
  n=logs.length-1
  max = 0
  day = logs[n].date
  while(n--){
    if(day-logs[n].date==1)
      curr++
    else if(day-logs[n].date!=0){
      if(curr>max)
        max=curr
      curr=1
    }
    day=logs[n].date
  }
  return max>curr?max:curr
}

const totalDays = async (startDate) => Math.floor(1 + (Date.now() - startDate) / (1000*3600*24))

const totalDistinct = async (logs) => {
  if(logs.length<1)return 0
  n=logs.length-1
  day = logs[n].date
  ans=1
  while(n--)
    if(day-logs[n].date){
      day=logs[n].date
      ans++
    }
  return ans
}

module.exports = {
  calculateStreak,
  maxStreak,
  totalDays,
  totalDistinct
}