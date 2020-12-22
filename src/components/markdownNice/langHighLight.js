// 缩小highlight包大小，按需引入，900kb->90kb
import highLightJs from "highlight.js/lib/highlight"

import bash from "highlight.js/lib/languages/bash"
import clojure from "highlight.js/lib/languages/clojure"
import cpp from "highlight.js/lib/languages/cpp"
import cs from "highlight.js/lib/languages/cs"
import css from "highlight.js/lib/languages/css"
import dart from "highlight.js/lib/languages/dart"
import dockerfile from "highlight.js/lib/languages/dockerfile"
import erlang from "highlight.js/lib/languages/erlang"
import go from "highlight.js/lib/languages/go"
import gradle from "highlight.js/lib/languages/gradle"
import groovy from "highlight.js/lib/languages/groovy"
import haskell from "highlight.js/lib/languages/haskell"
import java from "highlight.js/lib/languages/java"
import javascript from "highlight.js/lib/languages/javascript"
import json from "highlight.js/lib/languages/json"
import julia from "highlight.js/lib/languages/julia"
import kotlin from "highlight.js/lib/languages/kotlin"
import lisp from "highlight.js/lib/languages/lisp"
import lua from "highlight.js/lib/languages/lua"
import makefile from "highlight.js/lib/languages/makefile"
import markdown from "highlight.js/lib/languages/markdown"
import matlab from "highlight.js/lib/languages/matlab"
import objectivec from "highlight.js/lib/languages/objectivec"
import perl from "highlight.js/lib/languages/perl"
import php from "highlight.js/lib/languages/php"
import python from "highlight.js/lib/languages/python"
import r from "highlight.js/lib/languages/r"
import ruby from "highlight.js/lib/languages/ruby"
import rust from "highlight.js/lib/languages/rust"
import scala from "highlight.js/lib/languages/scala"
import shell from "highlight.js/lib/languages/shell"
import sql from "highlight.js/lib/languages/sql"
import swift from "highlight.js/lib/languages/swift"
import tex from "highlight.js/lib/languages/tex"
import typescript from "highlight.js/lib/languages/typescript"
import verilog from "highlight.js/lib/languages/verilog"
import vhdl from "highlight.js/lib/languages/vhdl"
import xml from "highlight.js/lib/languages/xml"
import yaml from "highlight.js/lib/languages/yaml"
import diff from "highlight.js/lib/languages/diff"

highLightJs.registerLanguage("bash", bash)
highLightJs.registerLanguage("clojure", clojure)
highLightJs.registerLanguage("cpp", cpp)
highLightJs.registerLanguage("cs", cs)
highLightJs.registerLanguage("css", css)
highLightJs.registerLanguage("dart", dart)
highLightJs.registerLanguage("dockerfile", dockerfile)
highLightJs.registerLanguage("erlang", erlang)
highLightJs.registerLanguage("go", go)
highLightJs.registerLanguage("gradle", gradle)
highLightJs.registerLanguage("groovy", groovy)
highLightJs.registerLanguage("haskell", haskell)
highLightJs.registerLanguage("java", java)
highLightJs.registerLanguage("javascript", javascript)
highLightJs.registerLanguage("json", json)
highLightJs.registerLanguage("julia", julia)
highLightJs.registerLanguage("kotlin", kotlin)
highLightJs.registerLanguage("lisp", lisp)
highLightJs.registerLanguage("lua", lua)
highLightJs.registerLanguage("makefile", makefile)
highLightJs.registerLanguage("markdown", markdown)
highLightJs.registerLanguage("matlab", matlab)
highLightJs.registerLanguage("objectivec", objectivec)
highLightJs.registerLanguage("perl", perl)
highLightJs.registerLanguage("php", php)
highLightJs.registerLanguage("python", python)
highLightJs.registerLanguage("r", r)
highLightJs.registerLanguage("ruby", ruby)
highLightJs.registerLanguage("rust", rust)
highLightJs.registerLanguage("scala", scala)
highLightJs.registerLanguage("shell", shell)
highLightJs.registerLanguage("sql", sql)
highLightJs.registerLanguage("swift", swift)
highLightJs.registerLanguage("tex", tex)
highLightJs.registerLanguage("typescript", typescript)
highLightJs.registerLanguage("verilog", verilog)
highLightJs.registerLanguage("vhdl", vhdl)
highLightJs.registerLanguage("xml", xml)
highLightJs.registerLanguage("yaml", yaml)
highLightJs.registerLanguage("diff", diff)

export default highLightJs
