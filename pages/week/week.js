const util = require("../../utils/util");
const calendar = require('../../utils/calendar');
const request = require('../../utils/request');

Page({
    data: {
        img: util.data.img,
        chosenIdx: "",
        swipers: [{}, {}, {}],
        swiperCurrent: 1
    },
    onLoad() {
        const that = this;
        //现在所在的具体日期信息
        this.dateObj = util.getNowObj();
        this.setWholeMonth();
    },
    setThisWeek: function(weekObj, isChoosen) {
        const dateObj = this.dateObj;
        let weekList = util.templateList();
        let chosenIdx = "";
        let firstDay = "";
        for (let i = 0; i < 7; i += 1) {
            weekList[i].num = weekObj.weekdays[i].num;
            weekList[i].off = weekObj.weekdays[i].off;
            if (weekObj.weekdays[i].num == dateObj.day && dateObj.theMonth == dateObj.month && dateObj.theYear == dateObj.year) {
                //标记今天
                weekList[i].mark = "today";
                weekList[i].chosen = 'active';
                chosenIdx = i;
            } else if (isChoosen) {
                //from choose date, then the firstDay can't be the active day
                if (weekObj.weekdays[i].num == dateObj.day) {
                    weekList[i].chosen = 'active';
                    chosenIdx = i;
                }
            }
        }
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
        const beDate = [dateObj.year, util.formatNumber(dateObj.month), util.formatNumber(weekList[chosenIdx].num)];
        this.setData({
            weekList,  
            isLeftHidden, 
            chosenIdx,
            beStart: `${dateObj.year}-01-01`,
            beDate,
            beEnd: `${dateObj.year + 1}-12-31`
        });
        this.getBgByDate();
        return firstDay;
    },
    setWholeMonth: function(isChoosen) {
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
        calendar.createMonthData(WholeMonth, this.dateObj.month, this.dateObj.year).then(res => {
            this.dateObj.WholeMonth = res;
            this.findTheWeek();
            //找到今天所在的周
            this.setThisWeek(this.dateObj.WholeMonth[this.dateObj.weekIdx], isChoosen);
        });
    },
    chooseDate(e) {
        const dir = e.currentTarget.dataset.dir;
        let isRightHidden = false;
        const weeks = this.dateObj.weeks;
        //往左减少日期，vice versa
        calendar.createNewDateObj(dir, this.dateObj, this.setWholeMonth);
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
    },
    chooseBeDate: function(e) {
        const date = e.detail.value;
        const beDate = date.split("-");
        this.setData({beDate});
        const that = this;
        const now = util.formatDate(`${date.replace(/-0/gi, '-')}T01:00:00`);
        this.dateObj.year = now.getFullYear();
        this.dateObj.month = now.getMonth() + 1;
        this.dateObj.day = now.getDate();
        this.dateObj.weekday = now.getDay();
        this.setWholeMonth(true);
    },
    goEvent() {
        const beDate = this.data.beDate;
        wx.navigateTo({
            url: "../event/event?yy=" + beDate[0] + "&mm=" + beDate[1] + "&dd=" + beDate[2]
        })
    },
    goCalendar() {
        wx.navigateTo({
            url: "../calendar/calendar?mm=" + this.dateObj.month + "&yy=" + this.dateObj.year
        })
    },
    goToday() {
        this.onLoad();
    },
    goBaike() {
        wx.navigateTo({
            url: "../baike/baike"
        })
    },
    checkCourses(e) {
        const index = e.currentTarget.dataset.index;
        const weekList = this.data.weekList;
        const beDate = this.data.beDate;
        //const coach_id = "";
        let chosenIdx = this.data.chosenIdx;
        if (!weekList[index].num) {
            return;
        }
        weekList[chosenIdx].chosen = "";
        weekList[index].chosen = "active";
        chosenIdx = index;
        //同步更新日期选择器的显示天
        beDate[2] = util.formatNumber(weekList[index].num);
        this.setData({weekList, chosenIdx, beDate});
        this.getBgByDate();
        const now = util.formatDate(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 00:00:00`);
        //this.GetGolfCurriculumByCoachID(coach_id, `${this.year}-${util.formatNumber(this.month)}-${util.formatNumber(weekList[index].num)}`);
    },
    getBgByDate() {
        const beDate = this.data.beDate;
        const date = `${beDate[0]}-${beDate[1]}-${beDate[2]}`
        request.GetCurriculumBgimageInfo(date).then(res => {
            const bgImg = util.addHost(res.bgimage);
            request.GetIndexBgImageInfo(date).then(response => {
                const constellation = response.gongli.slice(-3);;
                const nongli = response.nongli.replace(/属/, ",").split(",");
                const runarDay = nongli[0].slice(-3, -1);
                const suici = response.suici.replace(/\s/g, "").replace(/[年月日]/g, ",").split(",");
                const runar = `农历 ${suici[0]}【${nongli[1]}】年  ${suici[1]}月  ${runarDay}  ${constellation}`;   
                this.setData({bgImg, runar})
            })
        })
    },
    findTheWeek() {
        for (let i = 0; i < this.dateObj.WholeMonth.length -1; i += 1) {
            for (let one of this.dateObj.WholeMonth[i].weekdays) {
                if (one.num == this.dateObj.day) {
                    this.dateObj.weekIdx = i;
                }
            }
        }
    }
})
