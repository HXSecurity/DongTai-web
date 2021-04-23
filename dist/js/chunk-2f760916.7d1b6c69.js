(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2f760916"],{"0e71":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content-warp"},[a("el-table",{staticClass:"agentManageTable",attrs:{data:e.tableData,"header-align":"center"}},[a("el-table-column",{attrs:{label:e.$t("views.agentManage.projectName"),prop:"project_name",width:"120px"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[a("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:n.project_name,placement:"top-start",disabled:n.project_name.length<14}},[a("div",{staticClass:"dot"},[a("span",[e._v(e._s(n.project_name))])])])]}}])}),a("el-table-column",{attrs:{label:e.$t("views.agentManage.address"),prop:"server",width:"180px"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[a("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:n.server,placement:"top-start",disabled:n.server.length<20}},[a("div",{staticClass:"dot"},[a("span",[e._v(e._s(n.server))])])])]}}])}),a("el-table-column",{attrs:{width:"400",label:e.$t("views.agentManage.payload"),prop:"system_load"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[a("div",{staticClass:"dot"},[e._v(" "+e._s(n.system_load)+" ")])]}}])}),a("el-table-column",{attrs:{label:e.$t("views.agentManage.status"),prop:"running_status",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[a("div",[e._v(" "+e._s(n.running_status)+" ")])]}}])}),a("el-table-column",{attrs:{width:"160px",label:e.$t("views.agentManage.timestapm")},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(e._f("formatTimestamp")(t.row.latest_time))+" ")]}}])}),e.rolesCheck(["system_admin","talent_admin"],!0)?a("el-table-column",{attrs:{label:e.$t("views.agentManage.owner"),prop:"owner",width:"120px"}}):e._e(),a("el-table-column",{attrs:{label:e.$t("views.agentManage.manage"),width:"140px",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[a("div",{staticClass:"icon-box"},["未运行"==n.running_status?a("i",{staticClass:"icon el-icon-video-play",on:{click:function(t){return e.agentInstall(n.id)}}}):a("i",{staticClass:"icon el-icon-video-pause",on:{click:function(t){return e.agentUninstall(n.id)}}}),a("i",{staticClass:"icon el-icon-delete",on:{click:function(t){return e.doDelete(n.id)}}})])]}}])}),a("el-table-column",{attrs:{label:"Agent",width:"320",prop:"token"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[a("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:n.token,placement:"top-start",disabled:n.token.length<45}},[a("div",{staticClass:"dot"},[a("span",[e._v(e._s(n.token))])])])]}}])})],1),a("el-pagination",{staticStyle:{float:"right"},attrs:{total:e.total,"current-page":e.page,"page-size":e.pageSize,layout:"total, prev, pager, next, jumper"},on:{"current-change":e.currentChange}}),a("el-dialog",{attrs:{visible:e.deleteDialogOpen,title:"删除引擎",width:"25%"},on:{"update:visible":function(t){e.deleteDialogOpen=t}}},[a("div",{staticStyle:{"text-align":"center"}},[a("p",{staticStyle:{color:"#959fb4"}},[e._v("引擎删除后，相关的数据将一并删除，不可恢复")]),a("p",{staticStyle:{color:"#959fb4","margin-top":"14px"}},[e._v("请确认是否删除？")])]),a("div",{staticStyle:{"text-align":"center"},attrs:{slot:"footer"},slot:"footer"},[a("el-button",{staticClass:"confirmDel",on:{click:e.agentDelete}},[e._v(" 确认删除 ")]),a("el-button",{staticClass:"cancelDel",on:{click:function(t){e.deleteDialogOpen=!1}}},[e._v(" 取消 ")])],1)])],1)},r=[],s=a("60b5"),i=a("303e"),l=a("acf6"),c=a("e378"),o=a("a8e5"),u=(a("6a61"),a("21c9")),p=a("8c73"),g=a("e4a1"),d=a("73ec"),h=function(e){Object(c["a"])(a,e);var t=Object(o["a"])(a);function a(){var e;return Object(i["a"])(this,a),e=t.apply(this,arguments),e.tableData=[],e.total=0,e.page=1,e.pageSize=10,e.currentPageSize=0,e.currentPageDelete=0,e.deleteDialogOpen=!1,e.deleteSelectId=0,e}return Object(l["a"])(a,[{key:"created",value:function(){this.getTableData()}},{key:"currentChange",value:function(e){this.page=parseInt("".concat(e)),this.getTableData()}},{key:"getTableData",value:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){var t,a,n,r,s,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t={page:this.page,pageSize:this.pageSize},this.loadingStart(),e.next=4,this.services.setting.agentList(t);case 4:if(a=e.sent,n=a.status,r=a.msg,s=a.data,i=a.page,this.loadingDone(),201===n){e.next=13;break}return this.$message.error(r),e.abrupt("return");case 13:this.tableData=s,this.currentPageSize=s.length,this.total=i.alltotal,this.currentPageDelete=0,console.log(this.currentPageSize);case 18:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"agentInstall",value:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(t){var a,n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.loadingStart(),e.next=3,this.services.setting.agentInstall({id:parseInt("".concat(t))});case 3:if(a=e.sent,n=a.status,r=a.msg,this.loadingDone(),201===n){e.next=10;break}return this.$message.error(r),e.abrupt("return");case 10:return e.next=12,this.getTableData();case 12:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"agentUninstall",value:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(t){var a,n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.loadingStart(),e.next=3,this.services.setting.agentUninstall({id:parseInt("".concat(t))});case 3:if(a=e.sent,n=a.status,r=a.msg,this.loadingDone(),201===n){e.next=10;break}return this.$message.error(r),e.abrupt("return");case 10:return e.next=12,this.getTableData();case 12:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"doDelete",value:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.deleteDialogOpen=!0,this.deleteSelectId=parseInt("".concat(t));case 2:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"agentDelete",value:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){var t,a,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.deleteDialogOpen=!1,this.loadingStart(),e.next=4,this.services.setting.agentDelete({id:this.deleteSelectId});case 4:if(t=e.sent,a=t.status,n=t.msg,this.loadingDone(),201===a){e.next=11;break}return this.$message.error(n),e.abrupt("return");case 11:return this.currentPageDelete=this.currentPageDelete+1,this.currentPageDelete===this.currentPageSize&&(this.page=this.page-1),e.next=15,this.getTableData();case 15:this.deleteSelectId=0;case 16:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()}]),a}(p["a"]);h=Object(u["c"])([Object(g["a"])({name:"AgentManage",filters:{formatTimestamp:function(e){return Object(d["b"])(e)}}})],h);var f=h,v=f,b=(a("68c9"),a("5d22")),m=Object(b["a"])(v,n,r,!1,null,"5272e4fb",null);t["default"]=m.exports},"68c9":function(e,t,a){"use strict";a("e7df")},e7df:function(e,t,a){}}]);
//# sourceMappingURL=chunk-2f760916.7d1b6c69.js.map