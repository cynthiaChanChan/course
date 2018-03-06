const util = require("../../utils/util");
const calendar = require('../../utils/calendar');
const request = require('../../utils/request');

Page({
    data: {
        img: util.data.img,
        chosenIdx: "",
        swipers: [{}, {}, {}]
    },
    onLoad() {
        const that = this;
        //现在所在的具体日期信息
        this.dateObj = util.getNowObj();
        this.setWholeMonth();
        let weekObj = "";
        let weekIdx = "";
        //找到今日
        for (let i = 0; i < this.dateObj.WholeMonth.length -1; i += 1) {
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
        this.setData({
            weekList, 
            date, 
            isLeftHidden, 
            chosenIdx,
        });
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
    chooseDate(e) {
        const dir = e.currentTarget.dataset.dir;
        let isRightHidden = false;
        const weeks = this.dateObj.weeks;
        //往左减少日期，vice versa
        if (dir == "left") {
            if (this.dateObj.weekIdx > 0) {
                this.dateObj.weekIdx -= 1;
            } else {
                if (this.dateObj.month == 1) {
                    this.dateObj.month = 12;
                    this.dateObj.year -= 1;
                } else {
                    this.dateObj.month -= 1;
                }
                this.setWholeMonth();
                this.dateObj.weekIdx = this.dateObj.weeks - 1;
            }
        } else {
            if (this.dateObj.weekIdx < this.dateObj.weeks - 1) {
                this.dateObj.weekIdx += 1;
            } else {
                this.dateObj.weekIdx = 0;
                if (this.dateObj.month == 12) {
                    this.dateObj.month = 1;
                    this.dateObj.year += 1;
                } else {
                    this.dateObj.month += 1;
                }
                this.setWholeMonth();
            }
        }
        let firstDay = this.setThisWeek(this.dateObj.WholeMonth[this.dateObj.weekIdx]);
        //const coach_id = wx.getStorageSync('golfLogin').id;
        const weekList = this.data.weekList;
        const chosenIdx = this.data.chosenIdx;
        //待获取数据
    },
    hideLeft(firstDay) {
        let isLeftHidden = false;
        //无法点击去2018以前的时间
        const now = new Date(2018, 0, 1, 0, 1).getTime();
        const calenderTime = util.formatDate(`${this.dateObj.year}-${this.dateObj.month}-${firstDay.num} 00:00:00`);
        if (now > calenderTime.getTime()) {
          isLeftHidden = true;
          this.setData({
            swiperCurrent: 0
          })
        }
        return isLeftHidden;
    },
    changeSwiper(e) {
        console.log(e)
        if (e.detail.source != "touch") {
            return;
        }
        const current = e.detail.current;
        if (current == 2) {
            e.currentTarget.dataset.dir = "right";
        } else if (current == 0){
            e.currentTarget.dataset.dir = "left";
        }
        // 保持可以滑动//因为swipers长度为3，1即可左右滑动
        this.setData({
            swiperCurrent: 1
        })     
        this.chooseDate(e);
    }
})
