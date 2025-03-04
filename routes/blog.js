const router = require('koa-router')();
const {getList, newBlog, updateBlog, deleteBlog, getDetail} = require('../controller/blog');
const {SuccessModel, ErrorModel} = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog');

router.get('/list', async (ctx, next) => {
    let author = ctx.query.author || '';
    let keyword = ctx.query.keyword || '';

    if(ctx.query.isadmin){
        if(ctx.session.username == null){
            // not login
            ctx.body = new ErrorModel('not login');
            return 
        }
        // force to search self blog
        author = ctx.session.username;
    }

    let listData = await getList(author, keyword);
    return ctx.body = new SuccessModel(listData);
});

router.get('/detail', async (ctx, next) => {
    const result = await getDetail(ctx.query.id);
    return ctx.body = new SuccessModel(result);
});

router.post('/new', loginCheck, async (ctx, next) => {
    ctx.request.body.author = ctx.session.username;
    const result = await newBlog(ctx.request.body);
    return ctx.body = new SuccessModel(result);
});

router.post('/update', loginCheck, async (ctx, next) => {
    const result = await updateBlog(ctx.query.id, ctx.request.body);
    if(result){
        return ctx.body = new SuccessModel();
    }else{
        return ctx.body = new ErrorModel('update failure');
    }
});

router.post('/del', loginCheck, async (ctx, next) => {
    const author = ctx.session.username;
    const result = await deleteBlog(ctx.query.id, author);
    if(result){
        return ctx.body = new SuccessModel();
    }else{
        return ctx.body = new ErrorModel('delete failure');
    }
})


module.exports = router;
