new Vue({
	el:'#app',
	data:{
		productList:[],
        checkAllFlag:false,
        totalMoney:0,
		delFlag:false,
        curProduct:""
	},
	/*局部过滤器*/
	filters:{
        formatMoney:function(value){
        	return "￥"+value.toFixed(2);
		}
	},
	/*生命周期：创建完成以后执行*/
	mounted:function(){
		this.$nextTick(function(){
            this.cartView();
		});
	},
	methods:{
		cartView:function () {
			var _this=this;
			this.$http.get("data/cartData.json").then(function(res){
				_this.productList=res.body.result.list;
			});
			/*ES6语法
			let _this=this;
			this.$http.get("data/cartData.json").then(res=>{
				this.productList=res.body.result.list;箭头函数：改变对象的作用域
			});*/
        },
		changeQuantity:function(product,way){
			product.productQuantity+=way;
			if(product.productQuantity<1){
                product.productQuantity=1;
			}
            this.calcTotalMoney();
		},
        selectProduct:function(item){
			if(typeof item.checked=="undefined"){
				Vue.set(item,"checked",true);
			}else{
				item.checked=!item.checked;
                if(item.checked==false){
                    this.checkAllFlag=false;
                }
			}
			this.calcTotalMoney();
		},
		checkAll:function () {
            this.checkAllFlag=!this.checkAllFlag;
            var _this=this;
            this.productList.forEach(function(item,index){
            	if(typeof item.checked=="undefined"){
            		Vue.set(item,"checked",true);
				}else {
                    item.checked = _this.checkAllFlag;
                }
			});
            this.calcTotalMoney();
        },
		calcTotalMoney:function(){
        	var _this=this;
        	this.totalMoney=0;
        	this.productList.forEach(function(item,index){
        		if(item.checked){
        			_this.totalMoney+=item.productPrice*item.productQuantity;
				}
			});
		},
        delConfirm:function (item) {
			this.delFlag=true;
			this.curProduct=item;
        },
		delProduct:function(){
			var index=this.productList.indexOf(this.curProduct);
			this.productList.splice(index,1);/*splice从当前索引开始删除相应个数的元素*/
			this.delFlag=false;
		}
	}
});
/*全局过滤器*/
Vue.filter("money",function(value,type){
	return value.toFixed(2)+type;
});
