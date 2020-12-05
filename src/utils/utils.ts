// 格式化时间戳 2020.1.1 10:23:23
export const formatTimestamp = (timestamp: number | any) => {
  const addZero = (m: number) => {
    return m < 10 ? '0' + m : m
  }
  if (`${timestamp}`.length === 10) {
    timestamp = window.parseInt(timestamp) * 1000
  } else {
    timestamp = +timestamp
  }
  const d = new Date(timestamp)
  return `${d.getFullYear()}.${addZero(d.getMonth() + 1)}.${addZero(
    d.getDate()
  )} ${addZero(d.getHours())}:${addZero(d.getMinutes())}`
}

export function getToken() {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf('csrftoken' + '=')
    if (cStart !== -1) {
      cStart = cStart + 'csrftoken'.length + 1
      let cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) cEnd = document.cookie.length
      return unescape(document.cookie.substring(cStart, cEnd))
    }
  }
  return ''
}
