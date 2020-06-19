let puppeteer = require("puppeteer")
let fs = require("fs")
let credentialsFile = process.argv[2];
(async function(){
    let data = await fs.promises.readFile(credentialsFile,"utf-8");
    let credentials = JSON.parse(data);
    login_link = credentials.website;

    let browser = await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        args:["--start-maximized"]
    })
    let numberofPages = await browser.pages();
    let tab = numberofPages[0];

    await tab.goto(login_link, {
        waitUntil: "networkidle2"
    });

    await tab.waitForSelector("#keyword");
    await tab.type("#keyword",city,{delay:100});
    await tab.waitForSelector("#propType_buy_span_10002_10003_10021_10022");
    await tab.click("#propType_buy_span_10002_10003_10021_10022");


    //await tab.waitForSelector("")

})();

async function navigationHelper(tab, selector) {
    await Promise.all([tab.waitForNavigation({
        waitUntil: "networkidle2"
    }), tab.click(selector)]);
}

