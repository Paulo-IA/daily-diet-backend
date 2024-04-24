import { randomUUID } from 'crypto'

export function randomEmail() {
  return `test${randomUUID()}@a.com`
}
