const path = require('path')
const Koa = require('koa')
const fs = require('fs')
const db = require('../data')
const {
  GET_ARTICLES,
  GET_ARTICLE_DETAIL,
  SAVE_ARTICLE,
  DELETE_ARTICLE,
  LIKE_ARTICLE,
  CANCEL_LIKE_ARTICLE,
  GET_COMMENTS,
  ADD_COMMENT,
  DELETE_COMMENT,
  UPLOAD_PIC,
  GET_REPOS,
  GET_RESUME,
  LOGIN,
  LOGOUT,
  GET_GITHUB_REPOS,
} = require('../api')

const {
  isValidString,
  generateId,
  set200,
  getExt,
} = require('../utils')

const locate = location => {
  return path.resolve(__dirname, location)
}
const getFileSync = location => {
  return fs.readFileSync(locate(location), 'utf8')
}

const logger = require('koa-logger')
const router = require('koa-router')()
const koaBody = require('koa-body')
const serve = require('koa-static')

const app = new Koa()

// 初始化数据库
db.init()

// middleware
app.use(logger())
app.use(koaBody({
  multipart: true
}))

app.use(serve(
  path.resolve( __dirname,  '../static')
))

// 路由
router
  .post(SAVE_ARTICLE, async function saveArticle(ctx, next) {
    const params = ctx.request.body
    try {
      const result = await db.saveArticle(params)
      set200(ctx, {
        article: result
      })
    } catch (err) {
      ctx.response.type = 'json'
      ctx.status = 400
      ctx.body = {
        message: err.message
      }
    }
  })
  .get(GET_ARTICLES, async function getArticles(ctx) {
    const articles = await db.getArticles()
    ctx.body = {
      articles
    }
  })
  .get(GET_ARTICLE_DETAIL, async function getArticles(ctx) {
    const {id} = ctx.query
    try {
      const article = await db.getArticle(id)
      set200(ctx, {
        article
      })
    } catch (err) {
      ctx.response.type = 'json'
      ctx.status = 400
      ctx.body = {
        message: err.message
      }
    }
  })
  .get(GET_REPOS, async function getRepos(ctx) {
    const repoList = await db.getGithubRepos()
    ctx.body = {
      data: {
        repoList: JSON.parse(repoList)
      }
    }
  })
  // 图片
  .post(UPLOAD_PIC, async function uploadPic(ctx) {
    let {articleId} = ctx.request.body
    const file = ctx.request.files.file
    if (file) {
      if (!isValidString(articleId)) {
        articleId = 'TEMP_ARTICLE'
      }
      const fileName = `${articleId}_${generateId(6)}${getExt(file.name)}`
      fs.writeFileSync(
        path.resolve(__dirname, '../files/', fileName),
        fs.readFileSync(file.path)
      )
      set200(ctx, {
        fileName
      })
    }
  })
  // .get('\/files', async function getResume(ctx) {
  //   console.log('...',ctx.request.url)
  // })
  .get(GET_RESUME, async function getResume(ctx) {
    ctx.body = {
      data: {
        resume: getFileSync('../data/resume.md')
      }
    }
  })
  // .get('/post/new', add)
  // .get('/post/:id', show)
  // .post('/post', create)


app.use(router.routes())

app.use(async (ctx,next) => {
  const {url} = ctx.request
  if (/^\/files/.test(url)) {
    ctx.type = getExt(url)
    ctx.body = fs.createReadStream(locate(`../${url}`))
  } else {
    await next()
  }
})


// 未匹配任何路由时, 返回 index.html, 以适配 browserHistory
app.use(async (ctx,next) => {
  console.log('未匹配', ctx.request.url)
  ctx.type = 'html'
  ctx.response.body = getFileSync('../static/index.html')
  await next()
})

app.listen(4000)