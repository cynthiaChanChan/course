const WxParse = require('../../lib/wxParse/wxParse');
const util = require("../../utils/util");
const request = require("../../utils/request");

Page({
	data: {
		img: 'https://www.korjo.cn/xcx/orderImg/',
		list: []
	},
	onLoad(options) {
		const that = this;
		const list = [];
		for (let i = 0; i < 20; i +=1) {
			list.push([]);
		}
		this.setData({list})
		request.GetFansIntro(util.data.appid).then((res) => {
			if (!res.content) {
				return
			}
			const content = util.url2abs(res.content)
			WxParse.wxParse('content', 'html', content, that, 5)
		});
	},
	onShareAppMessage() {
		return { title: 'FM小程序知识普及' }
	}
})
