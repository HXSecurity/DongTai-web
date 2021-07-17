// 权限按钮展示指令
export const dot = (Vue: any) => {
  Vue.directive('dot', {
    // 当被绑定的元素插入到 DOM 中时……
    bind: function (el: any, binding: any) {
      el.style.display = 'inline-block'
      el.style.width = '100%'
      el.style.overflow = 'hidden'
      el.style.whiteSpace = 'nowrap'
      el.style.textOverflow = 'ellipsis'
      let innerWidth = 0
      if (el.children) {
        for (let i = 0; i < el.children; i++) {
          innerWidth += el.children[i].offsetWidth
        }
        if (
          innerWidth > el.offsetWidth &&
          el.children[el.children.length - 1].innerText
        ) {
          el.title = el.children[el.children.length - 1].innerText
        }
      }
    },
  })
}
