var express = require('express');
var axios = require('axios');
var md5 = require('md5');
const bodyParser = require('body-parser');
const { json } = require('body-parser');


var app = express();
// app.use(express.bodyParser());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// app.use(bodyParser);


app.get('/order', function (req, res) {
    console.log(req.query.transid, 'tes')
    orderID = req.query.transid
    merchantCode = "D11056"
    amount = 10000
    redirectUrl = req.query.redirecturl
    sellingcurrencyamount = req.query.sellingcurrencyamount
    accountingcurrencyamount = req.query.accountingcurrencyamount
    merchantKey = "a642ae14aaa19a3527fc54b5153a6bf9"
    var signature = md5(merchantCode+orderID+amount+merchantKey)
    var checksum = req.query.checksum

    addParams = [{
        "redirectUrl" : redirectUrl,
        "checksum" : checksum,
        "sellingcurrencyamount" : sellingcurrencyamount,
        "accountingcurrencyamount" : accountingcurrencyamount

    }]
    // $checksum =generateChecksum($transId,$sellingCurrencyAmount,$accountingCurrencyAmount,$status, $rkey,$key);

    var data = JSON.stringify(
        {
            "merchantCode":merchantCode,
            "paymentAmount":amount,
            "paymentMethod":"BT",
            "merchantOrderId":orderID,
            "productDetails":"Tes pembayaran menggunakan Duitku",
            "additionalParam":JSON.stringify(addParams),
            "merchantUserInfo":"",
            "customerVaName":"John Doe",
            "email":"test@test.com",
            "phoneNumber":"08123456789",
            "itemDetails":[
               {
                  "name":"Test Item 1",
                  "price":10000,
                  "quantity":1
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
            "callbackUrl":"https://f097-103-124-197-154.ngrok.io/callback",
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
        console.log()
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
    console.log(req.body);
    let additional = JSON.parse(req.body.additionalParam)
    let data = additional[0]
    let transid = req.body.merchantOrderId
    let status;
    if(req.body.resultCode=="00"){
        status = 'Y'
    }else if(req.body.resultCode=="01"){
        status = 'N'
    }else{
        status = 'P'
    }
    let statuss = status
    let rkey = (Math.random() + 1).toString(36).substring(7);
    let key = "WeEY0Qg4rEGe1jTvDiyoozyCx8vHl7ZQ";



    // console.log(rkey, 'key');

    // let checksums = data.checksum
    let sellingamount = data.sellingcurrencyamount
    let accountingamount = data.accountingcurrencyamount

    let checksum = md5(transid+'|'+sellingamount+'|'+accountingamount+'|'+statuss+'|'+rkey+'|'+key);

    console.log(checksum, 'cek')

    var datas = JSON.stringify(
        {
            "transid":transid,
            "status":statuss,
            "rkey":rkey,
            "checksum":checksum,
            "sellingamount":sellingamount,
            "accountingamount":accountingamount,
         }
    );

    var config = {
        method: 'post',
        url: data.redirectUrl,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : datas
        };
    
        axios(config)
        .then(function (response) {
            console.log(response)
            // console.log(JSON.stringify(response.data)); 
            // console.log(response);
            // res.send(JSON.stringify(response.data));
            // res.redirect(response.data.paymentUrl)
    
        })
        .catch(function (error) {
            console.log(error);
            res.send("Error");
        });

    res.send("OK");
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});