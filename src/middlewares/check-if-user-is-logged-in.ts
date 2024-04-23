import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkIfUserIsLoggedIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userLoggedIn = request.cookies.userLoggedIn

  if (!userLoggedIn) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
