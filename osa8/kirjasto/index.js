const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http')
const { v1: uuid } = require('uuid')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config()

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]


let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Subscription {
    bookAdded: Book!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const existingauthors = await Author.find({})
      const thatauthor = existingauthors.find(a => a.name === args.author)

      if (args.author != undefined && args.genre === undefined) {
        return await Book.find({ author: thatauthor.id })
      } else if (args.author === undefined && args.genre != undefined) {
        return await Book.find({ genres: args.genre })
      } else if (args.author != undefined && args.genre != undefined) {
        return await Book.find({ author: thatauthor.id, genres: args.genre })
      } else {
        return await Book.find({})
      }
    },
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (context.currentUser === undefined) {
        throw new GraphQLError('Invalid token', {
          extensions: {
            code: 'BAD_USER_INPUT',
        }})
      }

      const existingauthors = await Author.find({})
      const authornames = existingauthors.map(a => a.name)

      var book = null

      if (authornames.includes(args.author)) {
        const thatauthor = existingauthors.find(a => a.name === args.author)
        book = new Book({ ...args, author: thatauthor.id})
      } else {
        const newauthor = new Author({ name: args.author, born: null })
        book = new Book({ ...args, author:  newauthor.id})
        
        try {
          await newauthor.save()
        } catch (error) {
          console.log(error.message)
  
          if (error.message.includes('is shorter than')) {
            throw new GraphQLError('Author has to be at least 4 characters long', {
              extensions: {
                code: 'BAD_USER_INPUT',
                error
            }})
          } else if (error.message.includes('is required')) {
            throw new GraphQLError('Author is required', {
              extensions: {
                code: 'BAD_USER_INPUT',
                error
            }})
          }
        }
      }
      
      books = books.concat(book)

      authorsArray = authors.map(a => a.name)

      if (authorsArray.includes(args.author) === false) {
        const author = {name: args.author, id: uuid(), born: null}
        authors = authors.concat(author)
      }

      try {
        await book.save()
      } catch (error) {
        console.log(error.message)

        if (error.message.includes('to be unique')) {
          throw new GraphQLError('Title has to be unique', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error
          }})
        } else if (error.message.includes('is shorter than')) {
          throw new GraphQLError('Title has to be at least 5 characters long', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error
          }})
        } else if (error.message.includes('is required')) {
          throw new GraphQLError('Title is required', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error
          }})
        }
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, context) => {
      if (context.currentUser === undefined) {
        throw new GraphQLError('Invalid token', {
          extensions: {
            code: 'BAD_USER_INPUT',
        }})
      }

      const existingauthors = await Author.find({})
      const authornames = existingauthors.map(a => a.name)
      
      if (authornames.includes(args.name) === true) {
        const newAuthor = await Author.findOneAndUpdate({ name: args.name }, {born: args.setBornTo})

        return newAuthor
      }

      return null
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
  
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
  Author: {
    bookCount: async (root) => await Book.find({ author: root.id }).countDocuments()
  },
  Book: {
    author: async (root) => {
      const existingauthors = await Author.find({})
      const thatauthor = existingauthors.find(a => a._id.toString() === root.author.toString())

      return thatauthor
    }
  }
}

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  })
  await server.start()
  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
      },
    }),
  )
  const PORT = 4000
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}
start()