(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1e006c9c"],{3724:function(e,t,r){"use strict";r("48ce")},"48ce":function(e,t,r){},c1da:function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("main",[r("div",{staticClass:"change-pwd"},[e._l(e.Hooks,(function(t,s){return r("el-card",{key:s,staticStyle:{"margin-bottom":"20px"},attrs:{shandow:"never"}},[r("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[r("span",[e._v("WebHook")]),r("span",[r("el-button",{staticStyle:{float:"right",padding:"3px 0","margin-left":"12px"},attrs:{type:"text"},on:{click:function(t){return e.save(s)}}},[e._v(" 保存")]),r("el-button",{staticStyle:{float:"right",padding:"3px 0","margin-left":"12px"},attrs:{type:"text"},on:{click:function(t){return e.minus(s)}}},[e._v(" 删除")])],1)]),r("el-form",{ref:"ruleForm",refInFor:!0,staticClass:"ruleForm",attrs:{model:t,"label-width":"en"==e.$i18n.locale?"160px":"80px","status-icon":""}},[r("el-form-item",{attrs:{label:"url",prop:"url"}},[r("el-input",{staticStyle:{width:"100%"},attrs:{size:"mini"},model:{value:t.url,callback:function(r){e.$set(t,"url",r)},expression:"submitForm.url"}})],1),r("el-form-item",{attrs:{label:"type",prop:"type"}},[r("el-select",{staticStyle:{width:"100%"},attrs:{size:"mini","show-password":""},model:{value:t.type_id,callback:function(r){e.$set(t,"type_id",r)},expression:"submitForm.type_id"}},e._l(e.hookTypes,(function(e){return r("el-option",{key:e.value,attrs:{label:e.key,value:e.value}})})),1)],1),r("el-form-item",{attrs:{label:"Headers",prop:"Headers"}},[r("el-input",{staticStyle:{width:"100%"},attrs:{type:"textarea",size:"mini"},model:{value:t.headers,callback:function(r){e.$set(t,"headers",r)},expression:"submitForm.headers"}})],1)],1)],1)})),r("div",{staticStyle:{float:"right",height:"42px"}},[r("el-button",{staticClass:"btn",attrs:{size:"mini",type:"primary"},on:{click:e.add}},[e._v(" 新增 ")])],1)],2)])},n=[],a=r("1da1"),i=r("d4ec"),o=r("bee2"),u=r("262e"),c=r("2caf"),l=(r("96cf"),r("a434"),r("d3b7"),r("159b"),r("e9c4"),r("9ab4")),p=r("8c73"),h=r("60a3"),d=function(e){Object(u["a"])(r,e);var t=Object(c["a"])(r);function r(){var e;return Object(i["a"])(this,r),e=t.apply(this,arguments),e.Hooks=[{url:"",type_id:"",headers:""}],e.hookTypes=[],e}return Object(o["a"])(r,[{key:"add",value:function(){this.Hooks.push({url:"",type_id:"",headers:""})}},{key:"minus",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){var r=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(this.Hooks[t].id){e.next=3;break}return this.Hooks.splice(t,1),e.abrupt("return");case 3:this.$confirm(this.$t("views.webhook.deleteConfirm"),this.$t("views.webhook.deleteConfirmPop"),{confirmButtonText:this.$t("views.userList.submit"),cancelButtonText:this.$t("views.userList.cancel"),type:"warning"}).then(function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(s){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,r.services.setting.webhook_delete({id:r.Hooks[t].id});case 2:if(n=e.sent,201!==n.status){e.next=7;break}return r.$message.success(n.msg),r.Hooks.splice(t,1),e.abrupt("return");case 7:r.$message.error(n.msg);case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 4:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"getTypeList",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.services.setting.webhook_type();case 2:t=e.sent,this.hookTypes=t.data.result;case 4:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"getWebhook",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.services.setting.webhook_get();case 2:t=e.sent,t.data.result&&t.data.result.forEach((function(e){e.headers?e.headers=JSON.stringify(e.headers):e.headers=""})),this.Hooks=t.data.result;case 5:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"save",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){var r,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r=JSON.parse(JSON.stringify(this.Hooks[t])),r.headers&&(r.headers=JSON.parse(r.headers)),e.next=4,this.services.setting.webhook_set(r);case 4:if(s=e.sent,201!==s.status){e.next=9;break}return this.$message.success(s.msg),this.Hooks[t].id=s.data.id,e.abrupt("return");case 9:this.$message.error(s.msg);case 10:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"created",value:function(){this.getTypeList(),this.getWebhook()}}]),r}(p["a"]);d=Object(l["b"])([Object(h["a"])({name:"Webhook"})],d);var f=d,m=f,v=(r("3724"),r("2877")),b=Object(v["a"])(m,s,n,!1,null,"64501a46",null);t["default"]=b.exports},e9c4:function(e,t,r){var s=r("23e7"),n=r("da84"),a=r("d066"),i=r("2ba4"),o=r("e330"),u=r("d039"),c=n.Array,l=a("JSON","stringify"),p=o(/./.exec),h=o("".charAt),d=o("".charCodeAt),f=o("".replace),m=o(1..toString),v=/[\uD800-\uDFFF]/g,b=/^[\uD800-\uDBFF]$/,k=/^[\uDC00-\uDFFF]$/,g=function(e,t,r){var s=h(r,t-1),n=h(r,t+1);return p(b,e)&&!p(k,n)||p(k,e)&&!p(b,s)?"\\u"+m(d(e,0),16):e},y=u((function(){return'"\\udf06\\ud834"'!==l("\udf06\ud834")||'"\\udead"'!==l("\udead")}));l&&s({target:"JSON",stat:!0,forced:y},{stringify:function(e,t,r){for(var s=0,n=arguments.length,a=c(n);s<n;s++)a[s]=arguments[s];var o=i(l,null,a);return"string"==typeof o?f(o,v,g):o}})}}]);
//# sourceMappingURL=chunk-1e006c9c.bacbd8af.js.map