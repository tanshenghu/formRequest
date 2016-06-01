## `formRequest` By TanShenghu

<br>

**formRequest方法主要用于ajax表单提交数据，它能将form表单下所有拥有name属性的文本域内容获取到并以json对象返回出来。**

<br>

---

> - 该方法是我在支付宝做外包时所写的，因支付宝项目采用的是seajs模块化开发，js需要spm build打包压缩，<br>
> - 如果后端哪天需要修改提交参数接收的字段名，改js代码显得比较麻烦。有了该方法后端开发同学只需要<br>
> - 在VM(视图模板)修改对应文本域name属性就行了，前端无需做任何改动！

---

[demo](http://www.tanshenghu.com/widget/formRequest/examples/formRequest.html)

## html


````html
<form id="myform">
	<div>
		<label>用户名：</label>
		<input type="text" name="username">
	</div>
	<div>
		<label>性别：</label>
		<input type="radio" name="sex" value="男">男
		<input type="radio" name="sex" value="女">女
	</div>
	<div>
		<label>您是否喜欢国术：</label>
		<select name="kung_fu">
			<option value="yes">yes</option>
			<option value="no">no</option>
		</select>
	</div>
	<div class="hobby">
		<label>兴趣好爱：</label>
		<label><input type="checkbox" name="hobby" value="咏春拳">咏春拳</label> 
		<label><input type="checkbox" name="hobby" value="陈式太极">陈式太极</label> 
		<label><input type="checkbox" name="hobby" value="八卦掌">八卦掌</label> 
		<label><input type="checkbox" name="hobby" value="形意拳">形意拳</label> 
		<label><input type="checkbox" name="hobby" value="洪拳">洪拳</label> 
		<label><input type="checkbox" name="hobby" value="铁线拳">铁线拳</label> 
		<label><input type="checkbox" name="hobby" value="蔡李佛">蔡李佛</label> 
		<label><input type="checkbox" name="hobby" value="自然门">自然门</label> 
		<label><input type="checkbox" name="hobby" value="截拳道">截拳道</label> 
	</div>
	<div>
		<label>备注：</label>
		<textarea name="remark"></textarea>
	</div>
	<p align="center"><input type="button" value="提 交"></p>
</form>
````


## javascript


```javascript
seajs.use(['$','formRequest'], function($, formRequest) {
	
	$(':button').on('click', function(){
		
		var param = formRequest({
			form: '#myform'
		});
		
		// 准备ajax提交后端...
		
	});
	
});
```

## 参数说明

formRequest({ <br>
	form: '#myform', // 必选参数，指定form表单节点，并非只能form标签，div也行。下面其它参数可选 <br>
	selector: '[name="remark"]', <br>
	way: true, <br>
	Encode: escape <br>
});


## `getCheckboxVal`

```javascript

seajs.use(['$','formRequest'], function($, formRequest) {
/*
	getCheckboxVal方法属于formRequest的子方法，它主要是获取同name的属性的值(比如：兴趣爱好，多个同name的checkbox就可以用该方法)，最终以数组或者按定义的字符串形式返回
	
	该方法是我在聚划算部门做淘宝电影时所写。
	
	该方法前两个参数属必选参数，最后一个可选。该方法不仅限于checkbox，radio，就其它文本域同name也行！
	
	参数说明：
			第一个参数即多个同name属性框的父元素
			第二个参数是name名称
			第三个参数如果不填写最终Array类型，填写返回string(数组以你传进的字符分隔)
*/	
	$(':button').on('click', function(){
		
		var param = formRequest.getCheckboxVal('#form hobby', 'hobby', ',');
		
	});
	
});

```


## `getLineVals`

```javascript

seajs.use(['$','formRequest'], function($, formRequest) {
/*
	getLineVals方法属于formRequest的子方法，它的作用主要是获取行数据，主要针对表格的tr行数据
	
	该方法是我在聚划算部门做淘宝电影时所写。
	
	参数说明：
	        只有一个参数，同时也是必选参数，即tr行。它不局限于文本域，任何带name属性的节点都可以获取到值
	        最终以数组嵌json的形式返回
	
*/

	$(':button').on('click', function(){
		
		var param = formRequest.getLineVals('table tbody tr');
		
	});

});

```

### 完 End
