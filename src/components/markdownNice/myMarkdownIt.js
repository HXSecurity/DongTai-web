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

// Highlight the markdown parser code
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
  .use(markdownItSpan) // Add span to title label
  .use(markdownItTableContainer) // Add container outside table
  .use(markdownItMath) // mathematical formula
  .use(markdownItLinkfoot) // Modify footnote
  .use(markdownItXss) // Prevent XSS injection
  .use(markdownItTableOfContents, {
    transformLink: () => "",
    includeLevel: [2, 3],
    markerPattern: /^\[toc\]/im,
  }) // TOC only supports Level 2 and level 3 titles
  .use(markdownItRuby) // Phonetic symbols
  .use(markdownItImplicitFigures, { figcaption: true }) // Illustration
  .use(markdownItDeflist) // Definition list
  .use(markdownItLiReplacer) // Add P tag to Li tag
  .use(markdownItImageFlow) // Horizontal screen mobile plug-in
  .use(markdownItImsize)
