/**
*
*author:@nsm 2015-7-30
*/
//列表

(function(){

util = require('util');
var ScrollLoad=require('scroll');




/**
 *一个最基本的List类
 */
function List(config){

	config=config||{};

	this.totalNum = 0;//拥有的item总数
	this.loadedNum = 0;//已加载的个数
	this.pageIndex = 0;//初始加载三页
	this.pageSize = 20;//适用于首次已获得全部数据然后分次显示的情况
	this.listId = config.listId||'#listWrap';//列表容器ID
	

}

List.prototype.renderData = function(data){

	this.loadedNum+=data.length;

	$(this.listId).append(this.modTMP({data:data}));

	if(this.totalNum==0){
		this.listScroll.empty();//列表为空

	}else if(this.loadedNum<this.totalNum){

			this.listScroll.listen();//还可以再load,就listen

	}else{

		this.listScroll.done();//全部load完了，不能再load了
		
	}

}

/**
 *一个先ajax请求再加载的类，继承于List
 */
function AjaxDataList(config){
	List.apply(this,arguments);
	this.urlParam=$.extend({},config.urlParam);
	this.ajaxCbFunc=config.ajaxCbFunc||function(){};
	this.init(config);
}

AjaxDataList.prototype=new List();
AjaxDataList.prototype.constructor = AjaxDataList;

AjaxDataList.prototype.init = function(config){		

	this.modTMP = config.tmp;

	if(!this.listScroll){//创建一个scroll事件

    	this.listScroll=new ScrollLoad({
    		listId : this.listId,
			cbFunc : _.bind(this.getAjaxNextPage,this)
		});
    }
	this.getAjaxNextPage();

};

AjaxDataList.prototype.getAjaxNextPage = function(){//获取下一下ajax数据
	var _this = this;

	_this.urlParam.page=++this.pageIndex;

	util.getData(util.url,_this.urlParam,function(data){
		
		var result=_this.ajaxCbFunc.call(this,data);

		if(!_this.totalNum)_this.totalNum=result.total||0;

		_this.renderData(result.list||[]);

	})
};





/**
 *继承于List
 *适用于数据已全部获取到,只不过分次展示
 */
function LoadedDataList(config){
	List.apply(this,arguments);
	this.data = config.data;
	this.init(config);
}

LoadedDataList.prototype=new List();
LoadedDataList.prototype.constructor = LoadedDataList;

LoadedDataList.prototype.init = function(config){		

	this.modTMP = config.tmp;
	if(!this.listScroll){//创建一个scroll事件

    	this.listScroll=new ScrollLoad({
    		listId : this.listId,
			cbFunc : _.bind(this.getNextPage,this)
		});
    }
    this.totalNum=this.data.length;
    this.renderData(this.data.slice(0,this.pageSize-1));

};

LoadedDataList.prototype.getNextPage = function(){//获取下一页

		this.renderData(this.data.slice(this.loadedNum,this.loadedNum+this.pageSize));
}

module.exports = {
	'LoadedDataList' : LoadedDataList,
	'AjaxDataList' : AjaxDataList
}

}())

