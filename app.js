const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const {
        request
} = require("http");

const app = express();

app.use(bodyParser.urlencoded({extended:true})); // for using body-parser
app.use(express.static(__dirname + '/public/')); //for css files

app.set('view engine', 'ejs');

app.get("/",function(req,res){ 
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
        const query = req.body.cityName;
        const apiKey = "2c99fdae7732ab6feb360bb73530343d";
        const unit = "metric"
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

        https.get(url, function (response) {
                console.log(response.statusCode);

                response.on("data", function (data) {
                        const weatherdata = JSON.parse(data)
                        const temp = weatherdata.main.temp
                        const weatherDescription = weatherdata.weather[0].description
                        const icon = weatherdata.weather[0].icon
                        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
                        res.write("<p>The weather is currently" + weatherDescription + "</p>");
                        res.write("<h1>The temperature in "+ query +" is " + temp +  "degree Celcius.</h>");
                        res.write("<img src=" + imageURL + ">");
                        res.send()
                })
        })
})

app.listen(3000, function () {
        console.log("Server is running");
})
