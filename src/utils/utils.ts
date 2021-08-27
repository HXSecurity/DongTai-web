import { i18n } from '@/config/lang'

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
    return `${year} ${i18n.t('base.yearAgo')}`
  } else if (month > 0) {
    return `${month} ${i18n.t('base.monthAgo')}`
  } else if (day > 0) {
    return `${day} ${i18n.t('base.dayAgo')}`
  } else if (hour > 0) {
    return `${hour} ${i18n.t('base.hourAgo')}`
  } else if (minute > 0) {
    return `${minute} ${i18n.t('base.minuteAgo')}`
  } else if (second > 0) {
    return `${second} ${i18n.t('base.secondAgo')}`
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
