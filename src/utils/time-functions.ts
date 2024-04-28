export function formatDateAndHour(date: string, hour: string) {
  const result = `${date.split('/').reverse().join('-')} ${hour}:00`

  return result
}

export function getDateInString() {
  const nowString = new Date().toLocaleString('pt-br')
  const now = nowString.split(',')

  let nowDate = now[0]
  nowDate = nowDate.split('/').reverse().join('-')

  const nowHour = now[1]

  return `${nowDate}${nowHour}`
}

export function separateDateFromTime(date: string) {
  return date.split(' ')[0]
}
