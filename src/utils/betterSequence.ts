import { Snack, BetterSequence } from '../@types/snacks'
import { separateDateFromTime } from './time-functions'

export function getBetterSequence(snacks: Snack[]) {
  const sortedDates = getSortedDatesFromSnacks(snacks)

  const snacksInDietByDate: BetterSequence[] = getQtdOfSnacksInDietByDate(
    sortedDates,
    snacks,
  )

  const betterSequence = sortSnacks(snacksInDietByDate, snacks)

  return betterSequence
}

function getQtdOfSnacksInDietByDate(sortedDates: string[], snacks: Snack[]) {
  const snacksAndDatesRelated = sortedDates.map((date) => {
    const { snacksIds, qtdOfSnacksInDiet } = getSnacksInDate(date, snacks)
    const snack: BetterSequence = {
      date,
      qtdOfSnacksInDiet,
      snacksIds,
    }

    return snack
  })
  const snacksInDietByDate = takeOutDatesWithoutInDietSnacks(
    snacksAndDatesRelated,
  )

  return snacksInDietByDate
}

function takeOutDatesWithoutInDietSnacks(
  snacksAndDatesRelated: BetterSequence[],
) {
  return snacksAndDatesRelated.filter(
    (sequence) => sequence.qtdOfSnacksInDiet !== 0,
  )
}

function sortSnacks(snacksUnsorted: BetterSequence[], snacks: Snack[]) {
  let sortedSnacks: BetterSequence[] = []
  sortedSnacks = sortAndPushToArray(snacksUnsorted, sortedSnacks)

  const dates = sortedSnacks.map((snack) => {
    return snack.date
  })

  const dateWithTheBetterSequence = dates.sort()[dates.length - 1]
  const betterSeq = getSnacksInDate(dateWithTheBetterSequence, snacks)

  return betterSeq
}

function sortAndPushToArray(
  unsortedArray: BetterSequence[],
  sortedArray: BetterSequence[],
) {
  let maior: number = -1
  for (let i = 0; i < unsortedArray.length; i++) {
    if (i === 0) {
      maior = unsortedArray[0].qtdOfSnacksInDiet
      sortedArray.push(unsortedArray[i])
    } else {
      if (maior < unsortedArray[i].qtdOfSnacksInDiet) {
        maior = unsortedArray[i].qtdOfSnacksInDiet
        sortedArray.push(unsortedArray[i])
      }

      if (maior === unsortedArray[i].qtdOfSnacksInDiet) {
        sortedArray.push(unsortedArray[i])
      }
    }
  }

  return sortedArray
}

function getSnacksInDate(date: string, snacks: Snack[]) {
  const snacksIds: string[] = []

  snacks.map((snack: Snack) => {
    if (separateDateFromTime(snack.date) === date && snack.inDiet) {
      snacksIds.push(snack.snackId)
    }

    return snack
  })

  const qtdOfSnacksInDiet: number = snacksIds.length

  const snacksInDate: BetterSequence = { snacksIds, qtdOfSnacksInDiet, date }

  return snacksInDate
}

function getSortedDatesFromSnacks(snacks: Snack[]) {
  const uniqueDatesOfSnacks: string[] = []
  snacks.forEach((snack) => {
    const dateWithoutTime = separateDateFromTime(snack.date)
    const dateAlreadyInArray = uniqueDatesOfSnacks.indexOf(dateWithoutTime) < 0

    if (dateAlreadyInArray) {
      uniqueDatesOfSnacks.push(dateWithoutTime)
    }
  })

  return uniqueDatesOfSnacks.sort()
}
