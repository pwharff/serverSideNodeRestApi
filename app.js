const Koa = require('koa');
const Router = require('koa-router');
const moment = require('moment')

const app = new Koa();
const router = new Router();

router.get('/', function (ctx, next) {
  // ctx.router available
  ctx.body = 'Hello World'
});

router.get('/:time', ctx => {
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

app
.use(router.routes())
.use(router.allowedMethods());

app.listen(3000)

