const Koa = require('koa');
const Router = require('koa-router');
const moment = require('moment')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const bodyParser = require('koa-bodyparser')

const app = new Koa();
const router = new Router();
app.use(bodyParser())

router.get('/', function (ctx, next) {
  // ctx.router available
  ctx.body = 'Hello World'
});

router.get('/time/:time', ctx => {
  const time = ctx.params.time

  if (isNaN(time))
  {
    const mtime = moment(time, 'MMMM DD, YYYY')
    ctx.body = {
      unixTime: mtime.isValid() ? parseInt(mtime.format('X')) : null,
      naturalTime: mtime.isValid() ? time : null
    }
  } else {
    const parsedTime = moment.unix(time)

    ctx.body = {
      unixTime: parseInt(time),
      naturalTime : parsedTime.format('MMMM DD, YYYY')
    }
  }
})

router.get('/user', ctx => {
  ctx.body = db.get('user')
})

router.post('/user/:hello', ctx => {
  db.set('user.format', ctx.params.hello).write()
  ctx.body = {status: 'ok'}
  return ctx.body
})

router.patch('/user', ctx => {
  db.set('user.format', ctx.request.body.format).write()
  console.log(ctx.request.body)
  ctx.body = {status: 'ok'}
  return ctx.body
})

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults
db.defaults({ user: {} }).write()

// Set a user using Lodash shorthand syntax
db.set('user.name', 'Bab the Bob').write()

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000)

