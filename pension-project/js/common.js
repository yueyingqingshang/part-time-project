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
				layer.load(1);
			},
			success: function (data, textStatus) {
				//若要移除loading,则移除
				fn.success(data, textStatus);
			},
			complete: function()  {	
				layer.closeAll('loading');		
			}
		});
		var _startTime = (new Date()).getTime();
		return _ajax(opt);
	};
})(jQuery);

//构建url
PensionService.buildUrl = function(url) {
	var _token = $.cookie("token") || '52349e4c-edff-45f9-ad15-524f6065820b';
	console.log(_token);

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

//登录
function login(params) {
	$.ajax({
		url: APP_ROOT + 'Login/Login',
		type: 'GET',
		data: params
	}).done(function(res) {
		$.cookie("token", res.data.loginSessionId);
		window.location.href = "../../index.html";
	});
};

//登录之后获取用户信息
function getUserInfo() {
	$.ajax({
		url: PensionService.buildUrl('home/MyInfo'),
		type: 'GET',
	}).done(function(res) {
		console.log(res);
		if(res.status) {
			$('.login-info').find('.user-name').text(res.data.zsmc);
		}
	});
};

layui.use('element',function() {
	var $lay = layui.jquery,
		element = layui.element;
	element.tabDelete('first_page');
	//触发事件
	var active = {
		tabAdd: function(opt){
		  	//新增一个Tab项
	  		element.tabAdd('pen-tab', opt);
		},
		tabChange: function(tab_id){
	  		//切换到指定Tab项
	  		element.tabChange('pen-tab', tab_id); //切换到：用户管理
		}
	};
	$lay('.pen-nav').on('click','.pen-nav-operate',function() {
		var othis = $lay(this),
			tab_id =  othis.data('title'),
			tab_title = othis.data('title'),
			tab_url = othis.data('url'),
			tab_nav = $lay('.layui-tab-title').find('li');
			if(!tab_nav.length) {
				addTab();
			} else {
				//判断是否打开过页面
				var isOpen = false;
				$.each(tab_nav,function() {
					var item_id = $(this).attr('lay-id');
					if(item_id == tab_id) {
						isOpen = true;
					};
				});
				if(!isOpen) {
					addTab();
				};
			};
			function addTab() {
				active.tabAdd({
					id: tab_title,
					title: tab_title,
					content: '<iframe data-frameid="'+ tab_title +'" scrolling="auto" frameborder="0" src="'+ tab_url +'.html" style="width:100%;height:85%;"></iframe>',
				});
			};
			active.tabChange(tab_title);
	});
	element.on('tab',function(data) {
		$lay('.pen-nav-operate').removeClass('child-this');
		var nav_list = $lay('.pen-nav-operate');
		for(var i = 0,len = nav_list.length;i<len;i++) {
			var item = nav_list.eq(i);
			if($(this).attr('lay-id') == $(item).data('title')) {
				$(item).addClass('child-this');
				break;
			};
		}
	})
});