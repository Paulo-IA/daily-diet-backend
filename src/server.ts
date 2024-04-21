import fastify from 'fastify'

const app = fastify()

app.get('/', (request) => {
  console.log(`[${request.method}] [${request.url}]`)
  return 'Hello World!'
})

app
  .listen({
    port: 3333,
  })

  .then(() => {
    console.log('HTTP server running')
  })
