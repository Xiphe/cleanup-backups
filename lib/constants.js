var second = 1000;
var minute = second * 60;
var hour = minute * 60;
var day = hour * 24;
var week = day * 7;
var month = day * 30;
var jear = day * 365;

module.exports = {
  DEFAULTS: {
    glob: '*',
    getAge: require('./get-age')
  },
  TIMES: {
    SECOND: second,
    MINUTE: minute,
    HOUR: hour,
    DAY: day,
    WEEK: week,
    MONTH: month,
    JEAR: jear
  },
  ERR: {
    MISSING_RULES: 'missing rules',
    MISSING_BASE_FOLDER: 'missing base folder',
    AGE_DID_NOT_INCREASE: 'ages in rules are not allowed to decrease'
  }
};
