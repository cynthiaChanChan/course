const util = require("../../utils/util");
Page({
    data: {
        img: util.data.img
    },
    onLoad() {
        wx.navigateTo({
            url: "../calendar/calendar?mm=" + 3 + "&yy=" + 2018
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
