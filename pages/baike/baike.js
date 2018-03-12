const util = require("../../utils/util");
const request = require("../../utils/request");
Page({
    data: {
        img: util.data.img,
        host: util.data.host
    },
    onLoad() {
        this.getTypeList();
    },
    getTypeList() {
        request.GetCurriculumInformationList().then((res) => {
            const question_list = res;
            this.setData({question_list});
        })
    },
    goNews: function (e) {
        // 跳到下一页
        var dataset = e.currentTarget.dataset;
        wx.navigateTo({
            url: "../article/article?id=" + dataset.id
        })
    },
})
