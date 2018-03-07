const request = require("./request");
const util = require('./util.js');
function restrictDate(year, month, dirs) {
    const thisYear = new Date().getFullYear();
    if (year === thisYear && month === 1) {
      dirs.isLeftHidden = true;
    }
    if (year === thisYear && month === 12) {
      dirs.isRightHidden = true;
    }
    return dirs;
}

function getMoreSpots(totalSpots, allDays) {
    if (totalSpots > 28 && totalSpots <= 35) {
        var moreContainerNum = 35 - totalSpots;
        for (var ii = 0; ii < moreContainerNum; ii += 1) {
          allDays.push({});
        }
    } else if (totalSpots > 35) {
        var moreContainerNum = 42 - totalSpots;
        for (var ii = 0; ii < moreContainerNum; ii += 1) {
          allDays.push({});
        }
    }
    return allDays;
}

function Markthem(allDays, allDataArray) {
    let matchData = "";
    //标记上有赛事的天
    for (let i of allDataArray){
        for (let ii of allDays) {
            if (i.day == ii.id) {
                ii.marked = "marked";
                ii.data = i.data;
                ii.chosen = i.chosen;
            }
            if (ii.chosen) {
                matchData = ii.data;
            }
        }
    }
    return matchData;
}

function chooseTheLatest (theYear, theMonth, allDataArray) {
    //默认显示每月第一天比赛（chosen），但如果是当月则显示今天或之后的最近比赛
    const daysArray = [];
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let chosenDay = "";
    for (let one of allDataArray) {
        daysArray.push(one.day);
    }
    daysArray.sort((a, b) => {
        return a -b;
    });
    if (theYear == year && theMonth == month) {
        chosenDay = daysArray.find(function(elem) {
            return elem >= day;
        })

    } else {
        chosenDay = daysArray[0];
    }
    console.log("chosenDay: ", chosenDay);
    for (let item of allDataArray) {
        if (item.day == chosenDay) {
            item.chosen = "chosen";
        }
    }
    return allDataArray;
}
//获取休息日
function GetRestDays(mm, yyyy) {
    return request.GetRestDateList(`${yyyy}-${mm}`).then((res) => {
    //rest_value:2 //2法定休息//1周末休
      const offDays = [];
      for (let value of res) {
        let offDay = util.formatDate(value.rest_date).getDate();
        offDays.push(offDay);
      }
      return offDays;
    })
}

function markOffDay(day, offDays) {
    if (offDays.indexOf(day) > -1) {
        return true;
    }
}


function createMonthData(WholeMonth, mm, yyyy) {
    //确认每月天数DaysOfMonth
    let DaysOfMonth = util.checkDaysOfMonth(mm, yyyy);
    //得到休息日（周末加法定休）
    return GetRestDays(mm, yyyy).then((res) => {
        const firstOfMonth = new Date(yyyy, mm - 1, 1);
        let firstWeekday = firstOfMonth.getDay() === 0 ? 7 : firstOfMonth.getDay();
        for (let iii = 0; iii < DaysOfMonth; iii += 1) {
            //第一周占据几天
            let firstWeekAllDays = 7 - firstWeekday + 1;
            if (iii < firstWeekAllDays) {
                WholeMonth[0].weekdays[firstWeekday + iii - 1].num = iii + 1;
                WholeMonth[0].weekdays[firstWeekday + iii - 1].off = markOffDay(iii + 1, res);
            } else if (iii < firstWeekAllDays + 7 * 1 && iii >= firstWeekAllDays) {
                WholeMonth[1].weekdays[iii - firstWeekAllDays].num = iii + 1;
                WholeMonth[1].weekdays[iii - firstWeekAllDays].off = markOffDay(iii + 1, res);
            } else if (iii < firstWeekAllDays + 7 * 2 && iii >= firstWeekAllDays + 7 * 1) {
                WholeMonth[2].weekdays[iii - firstWeekAllDays - 7 * 1].num = iii + 1;
                WholeMonth[2].weekdays[iii - firstWeekAllDays - 7 * 1].off = markOffDay(iii + 1, res);
            } else if (iii < firstWeekAllDays + 7 * 3 && iii >= firstWeekAllDays + 7 * 2) {
                WholeMonth[3].weekdays[iii - firstWeekAllDays - 7 * 2].num = iii + 1;
                WholeMonth[3].weekdays[iii - firstWeekAllDays - 7 * 2].off = markOffDay(iii + 1, res);
            } else if (iii < firstWeekAllDays + 7 * 4 && iii >= firstWeekAllDays + 7 * 3) {
                WholeMonth[4].weekdays[iii - firstWeekAllDays - 7 * 3].num = iii + 1;
                WholeMonth[4].weekdays[iii - firstWeekAllDays - 7 * 3].off = markOffDay(iii + 1, res);
            } else if (iii < firstWeekAllDays + 7 * 5 && iii >= firstWeekAllDays + 7 * 4) {
                WholeMonth[5].weekdays[iii - firstWeekAllDays - 7 * 4].num = iii + 1;
                WholeMonth[5].weekdays[iii - firstWeekAllDays - 7 * 4].off = markOffDay(iii + 1, res);
            }
        }
        return WholeMonth;
    });
}

function createNewDateObj(dir, dateObj, callback) {
    if (dir == "left") {
        if (dateObj.weekIdx > 0) {
            dateObj.weekIdx -= 1;
        } else {
            if (dateObj.month == 1) {
                dateObj.month = 12;
                dateObj.year -= 1;
            } else {
                dateObj.month -= 1;
            }
            callback();
            dateObj.weekIdx = dateObj.weeks - 1;
        }
    } else {
        if (dateObj.weekIdx < dateObj.weeks - 1) {
            dateObj.weekIdx += 1;
        } else {
            dateObj.weekIdx = 0;
            if (dateObj.month == 12) {
                dateObj.month = 1;
                dateObj.year += 1;
            } else {
                dateObj.month += 1;
            }
            callback();
        }
    }
}

module.exports = {
    restrictDate,
    getMoreSpots,
    Markthem,
    chooseTheLatest,
    GetRestDays,
    createMonthData,
    createNewDateObj
}
