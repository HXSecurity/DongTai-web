import MarkdownIt from 'markdown-it'
import markdownItDeflist from "markdown-it-deflist"
import markdownItImplicitFigures from "markdown-it-implicit-figures"
import markdownItTableOfContents from "markdown-it-table-of-contents"
import markdownItRuby from "markdown-it-ruby"
import markdownItImsize from "markdown-it-imsize"

import markdownItMath from "./markdown-it-math"
import markdownItSpan from "./markdown-it-span"
import markdownItTableContainer from "./markdown-it-table-container"
import markdownItLinkfoot from "./markdown-it-linkfoot"
import markdownItImageFlow from "./markdown-it-imageflow"
import markdownItLiReplacer from "./markdown-it-li"
import markdownItXss from "markdown-it-xss"
import highLightJs from './langHighLight'

// markdown解析器 代码高亮用highlight
export const markdownParser = new MarkdownIt({
  html: true,
  highlight: (str, lang) => {
    if (lang === undefined || lang === '') {
      lang = 'bash'
    }
    if (lang && highLightJs.getLanguage(lang)) {
      try {
        const formatted = highLightJs
          .highlight(lang, str, true)
          .value
          .replace(/\n/g, "<br/>")
          .replace(/\s/g, "&nbsp;")
          .replace(/span&nbsp;/g, "span ")
        return '<pre class="code-snippet__js"><code class="hljs">' + formatted + '</code></pre>'
      } catch (e) {
        console.error(e)
      }
    }
    return '<pre class="code-snippet__js"><code class="hljs">' + markdownParser.utils.escapeHtml(str) + '</code></pre>'
  }
})

markdownParser
  .use(markdownItSpan) // 在标题标签中添加span
  .use(markdownItTableContainer) // 在表格外部添加容器
  .use(markdownItMath) // 数学公式
  .use(markdownItLinkfoot) // 修改脚注
  .use(markdownItXss) // 防止xss注入
  .use(markdownItTableOfContents, {
    transformLink: () => "",
    includeLevel: [2, 3],
    markerPattern: /^\[toc\]/im,
  }) // TOC仅支持二级和三级标题
  .use(markdownItRuby) // 注音符号
  .use(markdownItImplicitFigures, { figcaption: true }) // 图示
  .use(markdownItDeflist) // 定义列表
  .use(markdownItLiReplacer) // li 标签中加入 p 标签
  .use(markdownItImageFlow) // 横屏移动插件
  .use(markdownItImsize)
