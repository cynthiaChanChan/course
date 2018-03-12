// pages/article/article.js
const WxParse = require('../../lib/wxParse/wxParse.js');
const util = require("../../utils/util");
const request = require("../../utils/request");
Page({
    data: {
        img: util.data.img,
        host: util.data.host,
        id: 0,
        title: '',
        content: '',
        iscallBoxHidden: true,
        phoneNumber: "15013320137",
        isSubmitBoxHidden: true,
        userInput: "",
        passwordInput: "",
    },
    onLoad: function(options) {
        var _this = this;
        this.registrationData = wx.getStorageSync("registrationData") || {};
        // 页面初始化 options为页面跳转所带来的参数
        request.GetCurriculumInformationInfo(options.id).then((result) => {
            let contentTitle = result.title || "";
            _this.pageTitle = util.getText(contentTitle);
            let content = "";
            _this.setData({
                header: {
                    title: options.title
                },
                id: options.id,
                content,
                nameInput: _this.registrationData.name || "",
                phoneInput: _this.registrationData.phone || "",
                numberInput: _this.registrationData.number || "",
            })
            var article = content;
            /**
             * WxParse.wxParse(bindName , type, data, target,imagePadding)
             * 1.bindName绑定的数据名(必填)
             * 2.type可以为html或者md(必填)
             * 3.data为传入的具体数据(必填)
             * 4.target为Page对象,一般为this(必填)
             * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
             */

             //0.2是因为css的padding设置了5%
             let imagePadding = wx.getSystemInfoSync().windowWidth * 0.05;
             console.log("imagePadding ", imagePadding)
            WxParse.wxParse('article', 'html', article, _this, imagePadding);
            WxParse.wxParse('title1', 'html', contentTitle, _this, imagePadding);
        })

    },
    onShareAppMessage: function(res) {
        const that = this;
        return {
           title: that.pageTitle,
           path: "/pages/article/article?id=" + that.data.id + "&title=" + that.data.header.title,
           success: function(res) {
           },
           fail: function(res) {
            // 转发失败
           }
        }
    },
    call(e) {
        const that = this;
        const phoneNumber = this.data.phoneNumber.replace(/(\w{3})(\w{4})(\w{4})/, "$1 $2 $3 ");
        this.setData({
            phoneNumber,
            iscallBoxHidden: false,
            isSubmitBoxHidden: true
        })
    },
    cancelPhoneCall() {
        this.setData({
            iscallBoxHidden: true
        })
    },
    makePhoneCall() {
        wx.makePhoneCall({
            phoneNumber: '15013320137'
        })
    },
    showSubmitBox() {
        this.setData({
            iscallBoxHidden: true,
            isSubmitBoxHidden: false
        })
    },
    hideBox() {
        this.setData({
            iscallBoxHidden: true,
            isSubmitBoxHidden: true
        })
    },
    nameInput: function(e) {
        this.registrationData.name = e.detail.value;
        wx.setStorageSync("registrationData", this.registrationData);
        this.setData({
            nameInput: e.detail.value
        })
    },
    numberInput: function(e) {
        this.registrationData.number = e.detail.value;
        wx.setStorageSync("registrationData", this.registrationData);
        this.setData({
            numberInput: e.detail.value
        })
    },
    phoneInput: function(e) {
        this.registrationData.phone = e.detail.value;
        wx.setStorageSync("registrationData", this.registrationData);
        this.setData({
            phoneInput: e.detail.value
        })
    },
    phoneBlur: function(e) {
        const phone = e.detail.value;
        this.validatePhone(phone);       
    },
    validatePhone: function(phone) {
        const phoneRe = /^[0-9]{11}$/;
        const result = phoneRe.test(phone);
        let hintText = "手机号格式错误"
        if (!result && phone) {
            util.alert(hintText);
            return true;
        }
    },
    registrate() {
        const that = this;
        const data = this.data;
        const name = this.data.nameInput.trim();
        const phone = this.data.phoneInput.trim();
        const number = this.data.numberInput.trim();
        if (this.checkEmpty(name, phone, number)) {
            return;
        } else if (this.validatePhone(this.data.phoneInput)) {
            return;
        } 
    },
    checkEmpty(name, phone, number) {
        let hintText = "";
        if (!name && !phone && !number) {
            hintText = "请填写姓名、电话与人数";
        } else if (!name) {
            hintText = "请填写姓名";
        } else if (!phone) {
            hintText = "请填写电话";
        } else if (!number) {
            hintText = "请填写人数";
        }
        if (hintText) {
            util.alert(hintText);
            return true;
        }
    },
    goBack: function () {
        util.navigateBack()
    },
    goHome: function () {
        wx.reLaunch({
            url: '../index/index'
        })
    }
})
