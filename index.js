const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');    
const moment = require('moment');
const favicon = require('serve-favicon');
const fs = require('fs')

moment.locale('it');

app = express();

app.set('views',path.join(__dirname,"views"));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use( morgan('dev') );

let id = 0;
let pcs = [];

app.get('/',(req,res)=>{
    let date = moment().format('LL LTS');
    res.render('index.ejs',{pcs,date});
});

app.post('/save',(req,res)=>{
    fs.writeFileSync(path.join(__dirname,'saved','obj.json'),JSON.stringify(pcs));
    res.redirect('/');
});

app.post('/load',(req,res)=>{
    try{
        pcs=JSON.parse(fs.readFileSync(path.join(__dirname,'saved','obj.json'), 'utf8'));
    }catch(err){
        res.redirect('/');
    }
    id=pcs.length;
    res.redirect('/');
});

app.post('/creapc',(req,res)=>{
    id++;
    req.body.id=id;
    req.body.createdAtDate=moment().format('LL');
    req.body.createdAtClock=moment().format('LTS');
    pcs.push(req.body);
    res.redirect('/');
});

app.post('/eliminapc',(req,res)=>{
    const id=parseInt(req.body.id);
    pcs=pcs.filter(pcs=>{
        return pcs.id !== id;
    });
    res.redirect('/');
});

app.post('/modificapc',(req,res)=>{
    let date = moment().format('LL LTS');
    const ids=parseInt(req.body.id);
    pc=pcs.filter(function(pcs){
        return pcs.id === ids;
    });
    pc=pc[0];
    res.render('mod.ejs',{pc,date});
});

app.post('/modpc',(req,res)=>{
    const id=parseInt(req.body.id);
    const element = pcs.find(element => element.id===id);
    element.modello=req.body.modello;
    element.marca=req.body.marca;
    res.redirect('/');
});

app.use((req,res)=>{
    res.status(404);
    res.sendFile(path.join(__dirname,"public","404.html"));
});

app.listen(8080);

console.log('Server running on http://localhost:8080');