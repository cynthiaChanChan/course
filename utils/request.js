const util = require('./util');
// 获取用户openid
function GetSessionKey(dataObj) {
	return util.get('/KorjoApi/GetSessionKey', dataObj)
}

//上传图片
function upload(filePath) {
	// util.loading();
	return new Promise((resolve, reject) => {
		wx.uploadFile({
			url: `${util.data.host}/KorjoApi/AdminUpload`,
			name: 'file',
			formData: { "path": "golf", "type": "image" },
			filePath,
			success: (res) => {
				util.hideLoading();
				resolve(res.data);
			},
			fail: (error) => {
				reject(error);
			}
		})
	});
}

function GetGolfIntroList() {
	return util.get('/GolfApi/GetGolfIntroList');
}

function GetGolfMatchByDate(match_date, typename) {
	return util.get('/GolfApi/GetGolfMatchByDate', {
		match_date, typename
	});
}

function GetLatelyMatchByTypeName(typename) {
	return util.get('/GolfApi/GetLatelyMatchByTypeName', {typename});
}

function GetRestDateList(yearmonth) {
	//2018-01
	return util.get('/KorjoApi/GetRestDateList', {yearmonth});
	//rest_value:2 //2法定休息//1周末休
}

function GetGolfCurriculumInfo(id) {
	//https://www.korjo.cn/Admin/GolfCurriculum/Index
	return util.get('/GolfApi/GetGolfCurriculumInfo', {id});
}

function GetGolfCurriculumByDate(userid, date) {
	//2018-1-25
	return util.get('/GolfApi/GetGolfCurriculumByDate', {userid, date});
}

function SaveUserInfoCommon(data) {
	return util.post('/GolfApi/SaveUserInfoCommon',{dataJson: JSON.stringify(data)});
}

function GetUserInfoCommon(id) {
	return util.get('/GolfApi/GetUserInfoCommon', {id});
}

function PayCommon(order_pay_id) {
	return util.post('/PayApi/PayCommon', {order_pay_id});
}

function SaveLeaveMessageCommon(data) {
	return util.post('/GolfApi/SaveLeaveMessageCommon', {dataJson: JSON.stringify(data)});
}


//定时消息推送
function SaveSendMsg(sendtime, param, sendtype, openid) {
	const jsonData = JSON.stringify({
		messagejson: JSON.stringify(param),
		sendtime,
		wxpublic_id: util.data.appid,
		sendtype,
		openid
	});
	console.log("SaveSendMsg: ", jsonData);
	return util.post('/KorjoApi/SaveSendMsg', {jsonData});
}

//实时消息推送
function WxMessageSend(param) {
	return util.post('/KorjoApi/WxMessageSend', {id: util.data.appid, param: JSON.stringify(param)});
}

//粉我吧科技介绍页
function GetFansIntro(wxpublic_id) {
	return util.get('/KorjoApi/GetFansIntro', {wxpublic_id});
}

//黄历
function GetIndexBgImageInfo(date) {
	//2018-03-12
	return util.get('/KorjoApi/GetIndexBgImageInfo', {date});
}

function GetCurriculumBgimageInfo(date) {
	return util.get('/GspaceApi/GetCurriculumBgimageInfo', {date});
}

function GetCurriculumInformationList() {
	return util.get('/GspaceApi/GetCurriculumInformationList');
}

function GetCurriculumInformationInfo(id) {
	return util.get('/GspaceApi/GetCurriculumInformationInfo', {id});
}

module.exports = {
    GetSessionKey,
	upload,
	GetGolfIntroList,
	GetGolfMatchByDate,
	GetLatelyMatchByTypeName,
	GetRestDateList,
	GetGolfCurriculumInfo,
	GetGolfCurriculumByDate,
	SaveUserInfoCommon,
	GetUserInfoCommon,
	SaveLeaveMessageCommon,
	SaveSendMsg,
	GetFansIntro,
	WxMessageSend,
	GetIndexBgImageInfo,
	GetCurriculumBgimageInfo,
	GetCurriculumInformationList,
	GetCurriculumInformationInfo
}
