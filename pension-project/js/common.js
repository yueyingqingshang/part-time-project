'use strict';
var PensionService = {};
var APP_ROOT = 'http://101.37.80.171/';
var globalLoadingLayer;

//一些请求错误提示
var _statusText = {
	_401: '无权访问:未登录或者会话已过期',
	_403: '服务器拒绝访问',
	_404: '没有找到所请求的服务',
	_413: '请求内容过大',
	_500: '服务器内部错误',
	_501: '服务器未实现该服务',
	_502: '线路不通，无法到达',
	_503: '所请求的服务不可用',
	_504: '网关超时',
	_505: '服务器不支持请求所使用的HTTP版本',
};

/**
 * 根据请求结果获取状态信息
 * @param  {[type]} XMLHttpRequest [description]
 * @return {[type]}                [description]
 */
function getAjaxErrorInfo (XMLHttpRequest)  {
	var status = XMLHttpRequest.status;

	try {
		var fixedResponse = XMLHttpRequest.responseText.replace(/\\'/g, "'");
		var jsonObj = JSON.parse(fixedResponse);
		return jsonObj.message;
	} catch (e) {
		if (status > 200) {
			switch (status) {
				case 401:
					return _statusText._401;
				case 403:
					return _statusText._403;
				case 404:
					return _statusText._404;
				case 413:
					return _statusText._413;
				case 500:
					return _statusText._500;
				case 501:
					return _statusText._501;
				case 502:
					return _statusText._502;
				case 503:
					return _statusText._503;
				case 504:
					return _statusText._504;
				case 505:
					return _statusText._505;
				default:
					break;
			}
		}
	}

	return _statusText._unused + ':' + status;
}
/**
 * [handelAjax description]
 * @param  {[type]} opt [请求配置]
 * @return {[type]}     [返回一个新的ajax请求]
 */
(function  handelAjax($) {
	var _ajax = $.ajax;
	
	$.ajax = function (opt) {
		//备份opt中error和success方法
		var fn = {
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			},
			success: function (data, textStatus) {
			}
		};
		if (opt.error) {
			fn.error = opt.error;
		}
		if (opt.success) {
			fn.success = opt.success;
		}

		//扩展增强处理
		opt = $.extend({}, {
			timeout: 60000,
			cache: false,
			dataType: 'json'
		}, opt);
		$.extend(opt, opt,{
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			},
			beforeSend:function(){
			},
			success: function (data, textStatus) {
				//若要移除loading,则移除
				fn.success(data, textStatus);
			},
			complete: function()  {			
			}
		});
		var _startTime = (new Date()).getTime();
		return _ajax(opt);
	};
})(jQuery);

//构建url
PensionService.buildUrl = function(url) {
	var _token = $.cookie("token");
	return APP_ROOT + url + '?token=' + _token;
};

//重新登录
//左侧菜单栏展开收起
$('.pen-side-menu').off('click').on('click','.nav-a',function() {
	var menu_list = $(this).closest('.pen-nav'),
		this_li = $(this).closest(".pen-nav-item"),
		this_child = this_li.find('.pen-nav-child'),
		this_more_i = $(this).find('.pen-nav-more').find('i');

	//加上选中模块标志
	menu_list.find(".nav-a").css("border-left-color",'transparent');
	$(this).css("border-left-color",'#009688');

	//判断是展开图标还是收起图标
	if(this_more_i.hasClass('fa-caret-up')) {
		this_more_i.removeClass("fa-caret-up").addClass('fa-caret-down');
	} else {
		menu_list.find(".pen-nav-more").find('i').removeClass("fa-caret-up").addClass('fa-caret-down');
		this_more_i.removeClass("fa-caret-down").addClass('fa-caret-up');
	};

	//判断子菜单是否打开
	if(this_child.length && this_child.hasClass('hide')) {
		menu_list.find('.pen-nav-child').removeClass('show').addClass('hide');
		this_child.removeClass('hide').addClass('show');
	} else {
		this_child.removeClass('show').addClass('hide');
		$(this).css("border-left-color",'transparent');
	};
});