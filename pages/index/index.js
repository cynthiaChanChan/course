const util = require("../../utils/util");
Page({
    data: {
        img: util.data.img
    },
    onLoad() {
        wx.navigateTo({
            url: "../week/week"
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
    },
    goTeacherlogin() {
        // 如已登录过，直接到管理页，否则到登录页
        const loginData = wx.getStorageSync('golfLogin');
        if (loginData.name) {
            wx.navigateTo({
                url: "../cms/cms"
            })
            return;
        }
        wx.navigateTo({
            url: "../teacherlogin/teacherlogin"
        })
    }
})
