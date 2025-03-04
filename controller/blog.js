const xss = require('xss');
const {exec} = require('../db/mysql');

const getList = async (author, keyword) => {
    let sql = `select * from blogs where 1=1 `;
    if(author){
        sql += `and author='${author}' `
    }
    if(keyword){
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`

    return await exec(sql);
}

// create new blog
const newBlog = async (blogData = {}) => {
    let {content, title, author} = blogData;
    content = xss(content);
    title = xss(title);
    let createTime = Date.now();

    let sql = `insert into blogs (title, content, createtime, author) values ('${title}', '${content}', '${createTime}', '${author}')`;
    let resData = await exec(sql);
    return {
        id: resData.insertId
    }
}

const getDetail = async (id) => {
    const sql = `select * from blogs where id='${id}'`;
    let resData = await exec(sql);
    return resData[0];
}


// update a blog
const updateBlog = async (id, blogData = {}) => {
    let {content, title} = blogData;
    content = xss(content);
    title = xss(title);

    let sql = `update blogs set content='${content}', title='${title}' where id=${id}`;
    let resData = await exec(sql);
    if(resData.affectedRows > 0){
        return true;
    }else{
        return false;
    }
}

// delete a blog
const deleteBlog = async (id, author) => {
    let sql = `delete from blogs where id=${id} and author='${author}'`;
    let resData = await exec(sql);
    if(resData.affectedRows > 0){
        return true;
    }else{
        return false;
    }
}

module.exports = {
    getList,
    newBlog,
    updateBlog,
    deleteBlog,
    getDetail
}