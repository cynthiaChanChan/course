const util = require("../../utils/util");
Page({
    data: {
        img: util.data.img
    },
    onLoad() {
        // wx.navigateTo({
        //     url: "../calendar/calendar?mm=" + 3 + "&yy=" + 2018
        // })
        // wx.navigateTo({
        //     url: "../event/event?yy=2018&mm=03&dd=08"
        // })
        wx.navigateTo({
            url: "../article/article"
        })
    },
    goIntro() {
        wx.navigateTo({
            url: "../faq/faq"
        })
    },
    goWeek() {
        wx.navigateTo({
            url: "../week/week"
        })
    }
})
