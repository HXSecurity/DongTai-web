(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4648357e"],{"0e71":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content-warp"},[a("el-table",{staticClass:"agentManageTable",attrs:{data:e.tableData,"header-align":"center"}},[a("el-table-column",{attrs:{label:"Agent",prop:"token"}}),a("el-table-column",{attrs:{label:e.$t("views.agentManage.address"),prop:"server","min-width":"50px"}}),a("el-table-column",{attrs:{label:e.$t("views.agentManage.payload"),prop:"system_load"}}),a("el-table-column",{attrs:{label:e.$t("views.agentManage.status"),prop:"running_status",width:"90px"}}),a("el-table-column",{attrs:{label:e.$t("views.agentManage.owner"),prop:"owner",width:"120px"}}),a("el-table-column",{attrs:{label:e.$t("views.agentManage.timestapm")},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(e._f("formatTimestamp")(t.row.latest_time))+" ")]}}])}),a("el-table-column",{attrs:{label:e.$t("views.agentManage.manage"),width:"100px"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[a("i",{staticClass:"iconfont iconshengji install",on:{click:function(t){return e.agentInstall(n.id)}}}),a("i",{staticClass:"iconfont iconshanchu-4 uninstall",on:{click:function(t){return e.agentUninstall(n.id)}}}),a("i",{staticClass:"iconfont iconshanchu-4 uninstall",on:{click:function(t){return e.doDelete(n.id)}}})]}}])})],1),a("el-pagination",{staticStyle:{float:"right"},attrs:{total:e.total,"current-page":e.page,"page-size":e.pageSize,layout:"total, prev, pager, next, jumper"},on:{"current-change":e.currentChange}}),a("el-dialog",{attrs:{visible:e.deleteDialogOpen,title:"删除引擎",width:"25%"},on:{"update:visible":function(t){e.deleteDialogOpen=t}}},[a("div",{staticStyle:{"text-align":"center"}},[a("p",{staticStyle:{color:"#959fb4"}},[e._v("引擎删除后，相关的数据将一并删除，不可恢复")]),a("p",{staticStyle:{color:"#959fb4","margin-top":"14px"}},[e._v("请确认是否删除？")])]),a("div",{staticStyle:{"text-align":"center"},attrs:{slot:"footer"},slot:"footer"},[a("el-button",{staticClass:"confirmDel",attrs:{type:"text"},on:{click:e.agentDelete}},[e._v(" 确认删除 ")]),a("el-button",{staticClass:"cancelDel",attrs:{type:"text"},on:{click:function(t){e.deleteDialogOpen=!1}}},[e._v(" 取消 ")])],1)])],1)},r=[],i=(a("96cf"),a("1da1")),s=a("d4ec"),l=a("bee2"),c=a("262e"),o=a("2caf"),u=a("9ab4"),g=a("8c73"),p=a("60a3"),h=a("73ec"),d=function(e){Object(c["a"])(a,e);var t=Object(o["a"])(a);function a(){var e;return Object(s["a"])(this,a),e=t.apply(this,arguments),e.tableData=[],e.total=0,e.page=1,e.pageSize=10,e.currentPageSize=0,e.currentPageDelete=0,e.deleteDialogOpen=!1,e.deleteSelectId=0,e}return Object(l["a"])(a,[{key:"created",value:function(){this.getTableData()}},{key:"currentChange",value:function(e){this.page=parseInt("".concat(e)),this.getTableData()}},{key:"getTableData",value:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t,a,n,r,i,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t={page:this.page,pageSize:this.pageSize},this.loadingStart(),e.next=4,this.services.setting.agentList(t);case 4:if(a=e.sent,n=a.status,r=a.msg,i=a.data,s=a.page,this.loadingDone(),201===n){e.next=13;break}return this.$message.error(r),e.abrupt("return");case 13:this.tableData=i,this.currentPageSize=i.length,this.total=s.alltotal,this.currentPageDelete=0,console.log(this.currentPageSize);case 18:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"agentInstall",value:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){var a,n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.loadingStart(),e.next=3,this.services.setting.agentInstall({id:parseInt("".concat(t))});case 3:if(a=e.sent,n=a.status,r=a.msg,this.loadingDone(),201===n){e.next=10;break}return this.$message.error(r),e.abrupt("return");case 10:return e.next=12,this.getTableData();case 12:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"agentUninstall",value:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){var a,n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.loadingStart(),e.next=3,this.services.setting.agentUninstall({id:parseInt("".concat(t))});case 3:if(a=e.sent,n=a.status,r=a.msg,this.loadingDone(),201===n){e.next=10;break}return this.$message.error(r),e.abrupt("return");case 10:return e.next=12,this.getTableData();case 12:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"doDelete",value:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.deleteDialogOpen=!0,this.deleteSelectId=parseInt("".concat(t));case 2:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"agentDelete",value:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t,a,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.deleteDialogOpen=!1,this.loadingStart(),e.next=4,this.services.setting.agentDelete({id:this.deleteSelectId});case 4:if(t=e.sent,a=t.status,n=t.msg,this.loadingDone(),201===a){e.next=11;break}return this.$message.error(n),e.abrupt("return");case 11:return this.currentPageDelete=this.currentPageDelete+1,this.currentPageDelete===this.currentPageSize&&(this.page=this.page-1),e.next=15,this.getTableData();case 15:this.deleteSelectId=0;case 16:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()}]),a}(g["a"]);d=Object(u["b"])([Object(p["a"])({name:"AgentManage",filters:{formatTimestamp:function(e){return Object(h["b"])(e)}}})],d);var f=d,b=f,v=(a("5130"),a("2877")),m=Object(v["a"])(b,n,r,!1,null,"bad67ba8",null);t["default"]=m.exports},5130:function(e,t,a){"use strict";a("9578")},9578:function(e,t,a){}}]);
//# sourceMappingURL=chunk-4648357e.b1c75402.js.map