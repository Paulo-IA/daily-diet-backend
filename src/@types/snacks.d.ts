export interface Snack {
  snackId: string
  userId: string
  name: string
  description: string
  inDiet: boolean
  date: string
  createdAt: string
  updatedAt?: string
}

export interface BetterSequence {
  qtdOfSnacksInDiet: number
  snacksIds: string[]
  date: string
}
