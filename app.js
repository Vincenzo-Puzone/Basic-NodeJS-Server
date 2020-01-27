const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');  
let todos=[];
let id=0;
app = express();
app.set('views',path.join(__dirname,"views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.get('/',(req,res)=>{
    res.render('todos',{todos});
});
function create(text){
    id++;
    const todo = {id:id,text:text,done:false};
    todos.push(todo);
}
function readById(id){
    const todo = todos.find(todo => todo.id===id);
    return todo;
}
function readByStatus(done){
    const f_todos = todos.filter(todo=>todo.done===done);
    return f_todos;
}
function toggleDone(id){
    const todo = readById(id);
    todo.done = !todo.done;
}
function deleteDone(){
    todos = readByStatus(false);
}
function deleteById(id){
    var f_id = todos.findIndex(todo => todo.id === id);
    todos.splice(f_id,1);
}
for(let i=1;i<=3;i++){
    create('cose da fare n'+i);
}

app.post('/toggle',(req,res)=>{
    toggleDone(parseInt(req.body.id));
    res.redirect('/');
});
app.post('/deletedone',(req,res)=>{
    deleteDone();
    res.redirect('/');
});
app.post('/crea',(req,res)=>{
    create(req.body.text);
    res.redirect('/');
});
/*
console.log(todos);
create('cose da fare n4');
console.log(todos);
console.log(readById(3));
console.log(toggleDone(3));
console.log(readByStatus(true));
console.log(readByStatus(false));
deleteDone();
console.log(todos);
deleteById(2);
console.log(todos);
*/
app.listen(8080);