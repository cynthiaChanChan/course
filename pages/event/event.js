const util = require("../../utils/util");
Page({
    data: {
        img: util.data.img,
        ampm: ["上午", "下午"],
        timeArray: [{
            timeStart: "00:00",
            timeEnd: "11:59"
        }, {
            timeStart: "12:00",
            timeEnd: "23:59"
        }],
        switchStatus: ""
    },
    onLoad(options) {
        //如果是修改事件，需要另外去事件的日期，时间，上下午
        //从week page进来
        const beDate = [options.yy, options.mm, options.dd];
        const today = new Date();
        let ampmIndex = 0;
        let time = util.formatNumber(today.getHours()) + ":" + util.formatNumber(today.getMinutes());
        if (today.getHours() > 11) {
            ampmIndex = 1;
        }
        const deniedUserEventMessages = wx.getStorageSync("deniedUserEventMessages");
        this.setData({
            time,
            beDate,
            ampmIndex,
            switchStatus: deniedUserEventMessages ? "" : "on"
        })
        
    },
    chooseBeDate: function(e) {
        const date = e.detail.value;
        const beDate = date.split("-");
        const thisYear = new Date().getFullYear();
        this.setData({
            beStart: `${thisYear}-01-01`,
            beDate,
            beEnd: `${thisYear + 1}-12-31`
        });
    },
    chooseAMPM: function(e) {
        let ampmIndex = e.detail.value;
        let time = this.data.time;
        const hour = time.split(":")[0];
        if (ampmIndex == 0 && hour > 11) {
            time = `${util.formatNumber(Number(time.split(":")[0]) - 12)}:${time.split(":")[1]}`
        } else if (ampmIndex == 1 && hour <= 11) {
            time = `${util.formatNumber(Number(time.split(":")[0]) + 12)}:${time.split(":")[1]}`
        }
        this.setData({
            ampmIndex,
            time
        })
    },
    chooseTime(e) {
        this.setData({
            time: e.detail.value
        })
    },
    eventInput: function(e) {
        if (e.detail.value.trim()) {
          this.eventValue = e.detail.value;
        } else {
          this.eventValue = "";
        }
        this.setData({
          eventValue: this.eventValue
        })
    },
    goWeek() {
        wx.navigateTo({
            url: "../week/week"
        })
    },
    goBack() {
        util.navigateBack();
    },
    send(e) {
        if (!this.eventValue) {
            util.alert("请填写事件内容");
            return
        }
        console.log("send it.");
        const switchStatus = this.data.switchStatus;
        if (!switchStatus) {
            //不推送
            return;
        } else {
            this.sendMessage()
        }
    },
    turnOnMessage(e) {
        let switchStatus = this.data.switchStatus;
        if (switchStatus == "on") {
            switchStatus = "";
        } else {
            switchStatus = "on";
        }
        //用户是否接受推送的接口---保存到本地
        wx.setStorageSync("deniedUserEventMessages", switchStatus == "on" ? "" : true);
        this.setData({
            switchStatus
        })
    },
    sendMessage(e) {
        console.log("call sendMessage.");
    }
})
