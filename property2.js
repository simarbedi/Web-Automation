// Working on it extra work
let puppeteer = require("puppeteer")
let fs = require("fs")
let credentialsFile = process.argv[2];
(async function(){
    let data = await fs.promises.readFile(credentialsFile,"utf-8");
    let credentials = JSON.parse(data);
    login_link = credentials.website;
    location = credentials.location;
    minValue = credentials.minValue;
    maxValue = credentials.maxValue;

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

    await tab.waitForSelector("input.AS_searchInp.ui-autocomplete-input");                                                   // property location
    await tab.type("input.AS_searchInp.ui-autocomplete-input",location,{delay:100});

    await page.keyboard.press('Enter');

    await tab.waitForSelector("a#home-searchbtn-express-search");                                        // property search
    await navigationHelper(tab, "a#home-searchbtn-express-search")

    await tab.waitForSelector("#propType_holder_div_buy .propertyTypeArrow")                 // property type arrow
    await tab.click("#propType_holder_div_buy .propertyTypeArrow")

    await tab.waitForSelector("#propType_buy_span_10002_10003_10021_10022");                 // property type flats option 
    await tab.click("#propType_buy_span_10002_10003_10021_10022");

    await tab.waitForSelector("#propType_buy_chk_10001_10017");                              // property type house
    await tab.click("#propType_buy_chk_10001_10017");

    await tab.waitForSelector("#bhk_11702");                                                 // property type 3BHK
    await tab.click("#bhk_11702");

    await tab.waitForSelector("#bhk_11703");                                                 // property type 4BHK
    await tab.click("#bhk_11703");

    await tab.waitForSelector("#buy_budget_holder .propertyTypeArrow.toggleBudgetList");     // budget list arrow
    await tab.click("#buy_budget_holder .propertyTypeArrow.toggleBudgetList");

    await tab.waitForSelector(".rangeOption #rangeMinLinkbudgetBuyinput");                   // minimum budget
    await tab.type(".rangeOption #rangeMinLinkbudgetBuyinput",minValue,{delay:100})

    await tab.waitForSelector(".rangeOption #rangeMaxLinkbudgetBuyinput");                   // maximum budget
    await tab.type(".rangeOption #rangeMaxLinkbudgetBuyinput",maxValue,{delay:100})

    

    let idx = 0
    do {
        let allproperties = await tab.$$(".flex.relative.clearfix.m-srp-card__container");
        console.log("2");

        let cProperty = allproperties[idx];
        console.log("3");
        await tab.waitForSelector(".m-srp-card__title");
        let cPropertyClick = await cProperty.$(".m-srp-card__title");
        console.log("4");

        await cPropertyClick.click({ delay: 300 });
        
        idx++;
        
    } while (idx < 10)
})();

async function navigationHelper(tab, selector) {
    await Promise.all([tab.waitForNavigation({
        waitUntil: "networkidle2"
    }), tab.click(selector)]);
}

