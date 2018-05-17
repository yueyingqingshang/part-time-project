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