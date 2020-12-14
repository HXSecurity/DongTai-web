// 格式化时间戳 2020.1.1 10:23:23
export const formatTimestamp = (timestamp: number | any): string => {
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
  )} ${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(
    d.getSeconds()
  )}`
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

export const getPassedTime = (timestamp: number | any): string => {
  const time = new Date(parseInt(timestamp) * 1000)
  const curDate = new Date()
  let timeGap = curDate.getTime() - time.getTime()
  const ms = timeGap % 1000
  timeGap = (timeGap - ms) / 1000
  const second = timeGap % 60
  timeGap = (timeGap - second) / 60
  const minute = timeGap % 60
  timeGap = (timeGap - minute) / 60
  const hour = timeGap % 24
  timeGap = (timeGap - hour) / 24
  const day = timeGap % 30
  timeGap = (timeGap - day) / 30
  const month = timeGap % 12
  const year = (timeGap - month) / 12
  if (year > 0) {
    return `${year}年前`
  } else if (month > 0) {
    return `${month}月前`
  } else if (day > 0) {
    return `${day}天前`
  } else if (hour > 0) {
    return `${hour}小时前`
  } else if (minute > 0) {
    return `${minute}分钟前`
  } else if (second > 0) {
    return `${second}秒前`
  } else {
    return ''
  }
}
