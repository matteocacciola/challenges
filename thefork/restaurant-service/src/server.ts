import {ApolloServer} from 'apollo-server-express'
import express from 'express'
import config from 'config'
import {typeDefs} from './graphql/schema'
import {resolvers} from './graphql/resolvers'
import {loaders} from './dataloader'
import {configuration} from './config'
import {ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled} from 'apollo-server-core'

const environment = configuration.env

const main = async () => {
    const app = express()

    const server = new ApolloServer({
        plugins: [
            environment === 'production'
                ? ApolloServerPluginLandingPageDisabled()
                : ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
        introspection: environment !== 'production',
        typeDefs,
        resolvers,
        context: () => {
            return {
                loaders: loaders()
            }
        }
    })

    await server.start()

    server.applyMiddleware({app, path: '/restaurants'})

    app.listen({port: config.get('server.port')}, () =>
        console.info(
            `🚀 Server ready and listening at ==> http://localhost:${config.get('server.port')}${
                server.graphqlPath
            }`
        )
    )
}

main().catch((error) => {
    console.error('Server failed to start', error)
})
