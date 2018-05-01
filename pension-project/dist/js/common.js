'use strict';
var PensionService = {};
var APP_ROOT = 'http://101.37.80.171/';
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
	return APP_ROOT + url;
};