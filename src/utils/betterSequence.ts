import { Snack } from '../@types/snacks'
import { separateDateFromTime } from './time-functions'

// Find with more snacks in diet of the day

export function getBetterSequence(snacks: Snack[], sortedDates: string[]) {
  const betterSequence = sortedDates.map((date) => {
    const { snacksInDate, quantityOfSnacksInThisDayInDiet } = getSnacksInDate(
      date,
      snacks,
    )
    const snack =
      quantityOfSnacksInThisDayInDiet <= 0
        ? null
        : {
            date,
            quantityOfSnacksInThisDayInDiet,
            snacksInDate,
          }

    return snack
  })

  return betterSequence.filter((sequence) => sequence != null)
}

function getSnacksInDate(date: string, snacks: Snack[]) {
  const snacksInDate: string[] = []

  snacks.map((snack: Snack) => {
    if (separateDateFromTime(snack.date) === date && snack.inDiet) {
      snacksInDate.push(snack.snackId)
    }

    return snack
  })

  const quantityOfSnacksInThisDayInDiet: number = snacksInDate.length

  return { snacksInDate, quantityOfSnacksInThisDayInDiet }
}

export function getSortedDatesFromSnacks(snacks: Snack[]) {
  const uniqueSnacksDate: string[] = []
  snacks.map((snack) => {
    const dateWithoutTime = separateDateFromTime(snack.date)

    if (uniqueSnacksDate.indexOf(dateWithoutTime) < 0) {
      uniqueSnacksDate.push(dateWithoutTime)
    }

    return uniqueSnacksDate.sort()
  })

  return uniqueSnacksDate
}
