define("widget/formRequest/1.0.0/formRequest-debug", [ "$-debug" ], function(require, exports, module) {
    var jQuery = require("$-debug"), $ = jQuery;
    var formRequest = function(param) {
        if (typeof param === "string" || param instanceof jQuery) {
            param = {
                form: param
            };
        }
        var form = checkJqObject(param.form), selectEle = param.selector ? form.filter(param.selector).length ? form.filter(param.selector) : form.find(param.selector) : null, // 以后组件代码中严谨点，这里于15-12-15日发现有漏洞selector的作用域应该是在form下的
        way = "way" in param ? param.way : true, formatHtml = "formatHtml" in param ? param.formatHtml : true, trim = "trim" in param ? param.trim : true, odiv = $("<div/>"), arrSelector = '[data-request="list"]', listEle = form.filter(arrSelector).add(form.find(arrSelector)), gather = "input[name],textarea[name],select[name]";
        var selector = null, resultParam = {};
        function checkJqObject(obj) {
            var newObj = obj;
            if (!(obj instanceof jQuery)) {
                newObj = $(newObj);
            }
            return newObj;
        }
        var FormatHtml = function(val) {
            return formatHtml ? odiv.text(val).html() : val;
        }, Encode = function(val) {
            return param.Encode ? param.Encode(val) : val;
        }, nested = function(key) {
            // 在这里我用到了递归算法，去查找.字符，根据.一层一层的“拨洋葱”直到没有.为止
            var newObj = arguments[1] || resultParam, idx = key.indexOf("."), oldKey = arguments[2] || key, sVal = key.substring(0, idx < 0 ? 1e3 : idx);
            if (idx < 0) {
                newObj[sVal] = resultParam[oldKey];
                delete resultParam[oldKey];
                return "ok";
            }
            nested(key.substring(idx + 1), newObj[sVal] || (newObj[sVal] = {}), oldKey);
        };
        if (selectEle) {
            var selectorName = (selectEle.prop("nodeName") + "").toLowerCase(), selectorInput = selectorName == "input" || selectorName == "textarea" || selectorName == "select";
        }
        if (selectEle && way) {
            // 正向匹配
            selector = form.find(selectorInput ? selectEle : selectEle.find(gather));
        } else if (selectEle && !way) {
            // 逆向匹配
            selector = form.find(gather).not(selectorInput ? selectEle : selectEle.find(gather));
            // 15-12-25 修改缺陷 排除list类型
            if (selectEle.filter(arrSelector).length) {
                listEle = listEle.not(selectEle.filter(arrSelector));
            }
            if (selectEle.find(arrSelector).length) {
                listEle = listEle.not(selectEle.find(arrSelector));
            }
        } else {
            // 一般匹配
            selector = form.find(gather);
        }
        // 去检查list类型数据
        if (listEle.length) {
            selector = selector.not(listEle.find(gather));
            var listParam = $.extend({}, param);
            // 去查找listEle下面是否还包含list类型的数据，如果包含就要把它删除掉,因为嵌套的list我们会让它走递归算法
            listEle = listEle.not(listEle.find(arrSelector));
            // 针对嵌套的list 特殊处理 太蛋疼了
            listParam.selector = arrSelector + " " + arrSelector;
            listParam.way = false;
            listEle.each(function(i, ele) {
                var $this = $(ele), oline = $this.find(".tsh-lineData"), Name = $this.attr("name") || "list";
                oline = oline.length ? oline : $this.find("tbody tr");
                resultParam[Name] = formRequest.getLineVals(oline.not(oline.find(oline)), listParam);
            });
        }
        selector.each(function(eid, ele) {
            var thisObj = $(ele), iName = thisObj.attr("name"), type = thisObj.attr("type") && thisObj.attr("type").toLowerCase();
            if (iName && type && type === "radio") {
                if (thisObj.is(":checked")) {
                    resultParam[iName] = FormatHtml(Encode(trim ? $.trim(thisObj.val()) : thisObj.val()));
                }
            } else if (iName && type && type === "checkbox") {
                if (thisObj.is(":checked")) {
                    if (resultParam[iName]) {
                        resultParam[iName].push(FormatHtml(Encode(trim ? $.trim(thisObj.val()) : thisObj.val())));
                    } else {
                        resultParam[iName] = selector.filter(':checkbox:checked[name="' + iName + '"]').length < 2 ? FormatHtml(Encode(trim ? $.trim(thisObj.val()) : thisObj.val())) : [ FormatHtml(Encode(trim ? $.trim(thisObj.val()) : thisObj.val())) ];
                    }
                }
            } else if (iName) {
                resultParam[iName] = FormatHtml(Encode(trim ? $.trim(thisObj.val()) : thisObj.val()));
            }
        });
        // 细节优化了一下，尽量两个条件共用一个for循环
        var isfor = false;
        if (param.split) {
            for (var i in resultParam) {
                if (resultParam[i] instanceof Array) {
                    resultParam[i] = resultParam[i].join(param.split);
                }
                //
                param.nested === true && i.indexOf(".") > -1 && (isfor = true) && nested(i);
            }
        }
        // 如果nested为true时，我们需要将一级json按格式拆分成多层次可嵌套的json格式传给后端
        if (param.nested === true && isfor === false) {
            for (var i in resultParam) {
                i.indexOf(".") > -1 && nested(i);
            }
        }
        return resultParam;
    };
    // 对form表单获取数据的扩展，主要是对tr行获取数据的扩展   注意第二个参数param与formRequest是一致的。
    formRequest.getLineVals = function(trs, param) {
        trs = $(trs);
        param = $.extend({}, param);
        var This = this, result = [];
        trs.each(function() {
            param.form = this;
            result.push(This(param));
        });
        return result;
    };
    module.exports = formRequest;
});
