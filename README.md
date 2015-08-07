# 下拉加载更多
##使用方法	

###导入

	var modList = require('List');
	
	//一个先ajax请求再加载的类
	var LoadedDataList = modList.LoadedDataList;
	//对已存在的数组进行分次加载
	var AjaxDataList = modList.AjaxDataList;


###调用


	//LoadedDataList参数说明

	var config = {
			'tmp' : this.modTMP,//模板引擎
			'urlParam' :{'do':'getAjaxGame'},//url参数
			'data' : [] //要分次load的数据Arr
		};


	var pageEvent = new LoadedDataList(config);
				

####
	//AjaxDataList参数说明

	var config = {
			'tmp' : this.modTMP,//模板引擎
			'urlParam' :{'do':'getAjaxGame'},//url参数
			'ajaxCbFunc' : videoCbFunc//处理ajax数据的函数
		};


	funtion videoCbFunc(data){
		//处理ajax返回的数据
		return {
			list:data.arr,//该次要渲染的数据数组
			total:data.total//总数，这是整个数组的total
		}
	}

	var pageEvent = new AjaxDataList(config);
