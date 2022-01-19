var express = require('express');
var axios = require('axios');
var md5 = require('md5');
const bodyParser = require('body-parser');


var app = express();
// app.use(express.bodyParser());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// app.use(bodyParser);


app.get('/:order', function (req, res) {
    orderID = req.params.order
    merchantCode = "D11056"
    amount = 20000
    merchantKey = "a642ae14aaa19a3527fc54b5153a6bf9"
    var signature = md5(merchantCode+orderID+amount+merchantKey)
    var data = JSON.stringify(
        {
            "merchantCode":merchantCode,
            "paymentAmount":amount,
            "paymentMethod":"BT",
            "merchantOrderId":orderID,
            "productDetails":"Tes pembayaran menggunakan Duitku",
            "additionalParam":"",
            "merchantUserInfo":"",
            "customerVaName":"John Doe",
            "email":"test@test.com",
            "phoneNumber":"08123456789",
            "itemDetails":[
               {
                  "name":"Test Item 1",
                  "price":10000,
                  "quantity":1
               },
               {
                  "name":"Test Item 2",
                  "price":10000,
                  "quantity":3
               }
            ],
            "customerDetail":{
               "firstName":"John",
               "lastName":"Doe",
               "email":"test@test.com",
               "phoneNumber":"08123456789",
               "billingAddress":{
                  "firstName":"John",
                  "lastName":"Doe",
                  "address":"Jl. Kembangan Raya",
                  "city":"Jakarta",
                  "postalCode":"11530",
                  "phone":"08123456789",
                  "countryCode":"ID"
               },
               "shippingAddress":{
                  "firstName":"John",
                  "lastName":"Doe",
                  "address":"Jl. Kembangan Raya",
                  "city":"Jakarta",
                  "postalCode":"11530",
                  "phone":"08123456789",
                  "countryCode":"ID"
               }
            },
            "callbackUrl":"http://188.166.207.49:3000/callback",
            "returnUrl":"https://enu2xycs1fwjh5t.m.pipedream.net",
            "signature":signature,
            "expiryPeriod":5
         }
    );

    var config = {
    method: 'post',
    url: 'https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry',
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };

    axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data)); 
        // console.log(response);
        // res.send(JSON.stringify(response.data));
        res.redirect(response.data.paymentUrl)

    })
    .catch(function (error) {
        console.log(error);
        res.send("Error");
    });

});

app.post('/callback', function (req, res) {
    console.log(req.bodyParse);
    res.send("OK");

});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});