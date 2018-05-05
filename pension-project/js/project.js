
// //异步请求全局变量
// $(function () {
//     try {
//         $(function () {
//             try {
//                 $(document).ajaxSend(function () {
//                     layer.load(1);
//                 }).ajaxComplete(function (e) {
//                     layer.closeAll('loading');
//                 }).ajaxError(function (XMLHttpRequest, textStatus, errorThrown) {
//                     layer.msg("获取数据异常,请联系管理员", { icon: 1 });
//                     return;
//                 });
//             } catch (e) {
//             }

//         });
//     } catch (e) {

//     }
// });

try {
    //初始化jqgrid参数
    $.jgrid.defaults = {
        styleUI: "Bootstrap",
        toolbar: [true, "top"],
        datatype: "json",
        autowidth: true,
        multiselect: true,
        multiboxonly: true,
        height: (window.innerHeight - 200), //jgGird高度
        //emptyrecords: true,                 //未查询到数据的情况下展示这个属性的值
        pager: "#jqGridPager",              //分页展示位置
        viewrecords: true,                  //定义是否要显示总记录数
        caption: "数据列表",               //表标题
        rowNum: 20,
        //双击事件
        ondblClickRow: function () {
        }
    };


} catch (e) {

}



