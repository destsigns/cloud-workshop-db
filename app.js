const express = require('express')
const app = express()
const port = 3000
const request = require('request')

app.get('/news/', (req, res) => {
    var source
    if (req.query.lang == "en"){source = "https://news.rthk.hk/rthk/en/latest-news.htm"}
    else {source = "https://news.rthk.hk/rthk/ch/latest-news.htm"}
    request.get(source, function(err, response, body){
        var body = response.body;
        var list = [];
        var count = (body.match(/ns2-title/g) || []).length
        console.log("Number of news: " + count)
        for (i=0;i<=count-1;i++){
            body = body.slice(body.indexOf("ns2-title")+12,-1);
            var title = body.slice(body.indexOf(">")+1,body.indexOf("<"));
            list.push(title);
        }
        res.json(list);
    }
    )
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})