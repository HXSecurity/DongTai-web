// 格式化时间戳 2020.1.1 10:23:23
export const formatTimestamp = (timestamp: number | any) => {
  const addZero = (m: number) => {
    return m < 10 ? '0' + m : m
  }
  if ((`${timestamp}`).length === 10) {
    timestamp = window.parseInt(timestamp) * 1000
  } else {
    timestamp = +timestamp
  }
  const d = new Date(timestamp)
  return (`${d.getFullYear()}.${addZero(d.getMonth() + 1)}.${addZero(d.getDate())} ${addZero(d.getHours())}:${addZero(d.getMinutes())}`)
}
