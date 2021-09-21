const http = require('http');
const fs = require('fs');
var requests = require('requests');
const express = require('express');
const app = express()
const port = process.env.PORT || 7000;

const homeFile = fs.readFileSync('home.html','utf-8');
const replaceval = (tempval,orgval)=>{
    let temperature = tempval.replace('{%tempval%}',orgval.main.temp);
    temperature = temperature.replace('{%tempmin%}',orgval.main.temp_min);
    temperature = temperature.replace('{%tempmax%}',orgval.main.temp_max);
    temperature = temperature.replace('{%location%}',orgval.name);
    temperature = temperature.replace('{%country%}',orgval.sys.country);
    temperature = temperature.replace('{%tempstatus%}',orgval.weather[0].main);
    return temperature;
}

app.get('/', function (req, res) {
    if(req.url == '/'){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Faisalabad&appid=c3af16ad116b3a597efa9578837e41e0")
        .on('data', (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrdata = [objdata]
            // console.log(arrdata[0].main.temp);
            const realTimeData = arrdata.map((val) => replaceval(homeFile,val)).join("");
            res.write(realTimeData);
            // console.log(realTimeData);
        })
        .on('end', (err) => {
         if (err) return console.log('connection closed due to errors', err);
         res.end();
        });
    }
});

app.listen(port,()=>{
    console.log(`Listening to port no. at ${port}`);
});
