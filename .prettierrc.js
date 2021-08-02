module.exports = {
  // Tab indent size, the default is 2
  tabWidth: 2,
// Indent with tab. The default is false
// useTabs: true,
// Use semicolon. The default is true
  semi: false,
// Use single quotation marks, and the default is false (the configuration in JSX is invalid, and the default is double quotation marks)
  singleQuote: true,
//Comma at the end of the line, default to none, optional none | Es5 | all
//Es5 includes arrays and objects in Es5
//All includes all optional functions such as function objects
  TrailingCooma: "none",
// The default value for spaces in objects is true
// true: { foo: bar }
// false: {foo: bar}
  bracketSpacing: true,
// The JSX tag closing position defaults to false
// false: <div
//          className=""
//          style={{}}
//       >
// true: <div
//          className=""
//          style={{}} >
  jsxBracketSameLine: false,
//Arrow function parameter bracket default avoid optional avoid| always
//When avoid can omit parentheses, for example, x = > X
//Always has parentheses
  arrowParens: 'always',
  endOfLine: "auto"
};
