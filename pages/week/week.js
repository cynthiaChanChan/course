const util = require("../../utils/util");
const calendar = require('../../utils/calendar');
const request = require('../../utils/request');

Page({
    data: {
        img: util.data.img,
        chosenIdx: ""
    },
    onLoad() {
        const that = this;
        //现在所在的具体日期信息
        this.dateObj = util.getNowObj();
        this.setWholeMonth();
        let weekObj = "";
        let weekIdx = "";
        //找到今日
        for (let i = 0; i < this.dateObj.WholeMonth.length; i += 1) {
            for (let one of this.dateObj.WholeMonth[i].weekdays) {
                if (one.num == this.dateObj.day) {
                    weekObj = this.dateObj.WholeMonth[i];
                    this.dateObj.weekIdx = i;
                }
            }
        }
        this.setThisWeek(weekObj);
    },
    setThisWeek: function(weekObj) {
        let weekList = util.templateList();
        let chosenIdx = "";
        let firstDay = "";
        for (let i = 0; i < 7; i += 1) {
            weekList[i].num = weekObj.weekdays[i].num;
            if (weekObj.weekdays[i].num == this.dateObj.day && this.dateObj.theMonth == this.dateObj.month && this.dateObj.theYear == this.year) {
                //标记今天
                weekList[i].mark = "today";
                weekList[i].chosen = 'active';
                chosenIdx = i;
            }
        }
        let date = `${this.dateObj.year}年${this.dateObj.month}月 第${weekObj.weekNum}周`;
        firstDay = weekList.find((elem) => {
            return elem.num
        })
        if (!chosenIdx) {
            firstDay.chosen = 'active';
            chosenIdx = weekList.findIndex((elem) => {
                return elem.num
            })
        }
        let isLeftHidden = this.hideLeft(firstDay);
        this.setData({weekList, date, isLeftHidden, chosenIdx});
        return firstDay;
    },
    setWholeMonth: function() {
        const chineseWeekday = ["一","二","三","四","五","六", "日"];
        //每月周数weeks
        this.dateObj.weeks = util.weeksCount(this.dateObj.year, this.dateObj.month);
        let WholeMonth = [];
        for (let i = 0; i < this.dateObj.weeks; i += 1) {
            let weekdays = [];
            for (let ii = 0; ii < 7; ii += 1) {
                weekdays.push({
                    num: ""
                })
            }
            WholeMonth.push({
                weekNum: chineseWeekday[i],
                weekdays
            })
        }
        this.dateObj.WholeMonth = calendar.createMonthData(WholeMonth, this.dateObj.month, this.dateObj.year);
    },
    hideLeft(firstDay) {
        let isLeftHidden = false;
        //无法点击去过去的时间
        const now = new Date().getTime();
        const calenderTime = util.formatDate(`${this.dateObj.year}-${this.dateObj.month}-${firstDay.num} 00:00:00`);
        if (now > calenderTime.getTime()) {
          isLeftHidden = true;
        }
        return isLeftHidden;
    }
})
