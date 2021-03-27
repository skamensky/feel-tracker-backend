const getNowAsUTCTimeStamp = (): Number => {
  let localTime = new Date();
  let utcTime = new Date(
    localTime.getUTCFullYear(),
    localTime.getUTCMonth(),
    localTime.getUTCDate(),
    localTime.getUTCHours(),
    localTime.getUTCMinutes(),
    localTime.getUTCSeconds(),
    localTime.getUTCMilliseconds()
  );
  return utcTime.getTime();
};

module.exports = {
  getNowAsUTCTimeStamp,
};
