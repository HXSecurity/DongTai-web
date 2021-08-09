// Format timestamp 2020.1.1 10:23:23
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
    let cStart = document.cookie.indexOf('DTCsrfToken' + '=')
    if (cStart !== -1) {
      cStart = cStart + 'DTCsrfToken'.length + 1
      let cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) cEnd = document.cookie.length
      return unescape(document.cookie.substring(cStart, cEnd))
    }
  }
  return ''
}

export function setCookie(name: string, value: string, seconds: number) {
  seconds = seconds || 0 //seconds有值就直接赋值，没有为0
  let expires = ''
  if (seconds != 0) {
    const date = new Date()
    date.setTime(date.getTime() + seconds * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + escape(value) + expires + '; path=/' //转码并赋值
}

export function getCookie(c_name: string | any[]) {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + '=')
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1
      let c_end = document.cookie.indexOf(';', c_start)
      if (c_end == -1) c_end = document.cookie.length
      return unescape(document.cookie.substring(c_start, c_end)).replace(
        /\"/g,
        ''
      )
    }
  }
  return null
}

export function clearCookie(name: string) {
  setCookie(name, '', -1)
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

// Anti shake
export const debounce = (fn: any, wait: number) => {
  let timeout: any = null
  return () => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(fn, wait)
  }
}
