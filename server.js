const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const path = require('path');
const { v4: uuidv4 } = require('uuid')

var browser;

(async () => {
    browser = await puppeteer.launch();
})();

app.use("/screenshots",express.static(__dirname + '/screenshots'));

app.get('/screenshot', async (req, res) => {

    if (!req.query.url) return res.status(400).send('No url provided');

    const options = {
        width: parseInt(req.query.width) || 1920,
        height: parseInt(req.query.height) || 1080,
    }

    const page = await browser.newPage();

    let uid = uuidv4(); 
    let imgPath = `./screenshots/` + uid + `.jpeg`

    page.setViewport({ width: options.width, height: options.height });

    await page.goto(req.query.url, {
        waitUntil: 'networkidle2',
    });

    await page.screenshot({
        path: path.resolve(imgPath),
        type: 'jpeg',
        captureBeyondViewport: true,
    });

    page.close()

    res.redirect(`/screenshots/${uid}.jpeg`);
})

app.get('*', function(req, res){
    res.sendFile('404.html', { root: __dirname });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})