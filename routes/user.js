const router = require('koa-router')()
var {login} = require('../controller/user');
var {SuccessModel, ErrorModel} = require('../model/resModel')
router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
    const {username, password} = ctx.request.body;
    let result = await login(username, password);
    if(result.username){
        // set session
        ctx.session.username = result.username;
        ctx.session.realname = result.realname;
        return ctx.body = new SuccessModel();
    }
    return ctx.body = new ErrorModel('login failure');
})

module.exports = router