let puppeteer = require("puppeteer");
let fs = require("fs");
const { promise } = require("selenium-webdriver");
let credentialsFile = process.argv[2];
(async function () {
	let data = await fs.promises.readFile(credentialsFile, "utf-8");
	let credentials = JSON.parse(data);
	login_link = credentials.website;
	location = credentials.location;
	minValue = credentials.minValue;
	maxValue = credentials.maxValue;

	let browser = await puppeteer.launch({
		headless: false,
		defaultViewport: null,
		args: ["--start-maximized"],
	});
	let numberofPages = await browser.pages();
	let tab = numberofPages[0];

	await tab.goto(login_link, {
		waitUntil: "networkidle2",
	});

	await tab.waitForSelector("#keyword"); // property location
	await tab.click("#keyword");

	await tab.waitForSelector("#avail_wrap .FI-Tag.ddLClick.dropDown.frmEl"); // property type arrow
	await tab.click("#avail_wrap .FI-Tag.ddLClick.dropDown.frmEl");

	await tab.waitForSelector("#ready_move"); // property ready to move
	await tab.click("#ready_move");

	await tab.waitForSelector("#budget_sub_wrap .dropDown"); // budget list arrow
	await tab.click("#budget_sub_wrap .dropDown");

	if (parseInt(minValue) <= 5000000) {
		await tab.waitForSelector('#buy_minprice a[val="9"]'); // minimum budget
		await tab.click('#buy_minprice a[val="9"]');
	} else if (parseInt(minValue) <= 9000000) {
		await tab.waitForSelector('#buy_minprice a[val="12"]'); // minimum budget
		await tab.click('#buy_minprice a[val="12"]');
	}

	if (parseInt(maxValue) < 30000000) {
		await tab.waitForSelector('#buy_maxprice a[val="15"]'); // minimum budget
		await tab.click('#buy_maxprice a[val="15"]');
	} else if (parseInt(maxValue) < 100000000) {
		await tab.waitForSelector('#buy_maxprice a[val="18"]'); // minimum budget
		await tab.click('#buy_maxprice a[val="18"]');
	}

	if (parseInt(minValue) <= 5000000) {
		await tab.waitForSelector('#buy_minprice a[val="9"]'); // minimum budget
		await tab.click('#buy_minprice a[val="9"]');
	} else if (parseInt(minValue) <= 9000000) {
		await tab.waitForSelector('#buy_minprice a[val="12"]'); // minimum budget
		await tab.click('#buy_minprice a[val="12"]');
	}

	await tab.waitForSelector("#bedroom_num_wrap .dropDown"); // property size arrow
	await tab.click("#bedroom_num_wrap .dropDown");

	await tab.waitForSelector("#bd_3"); // property type 3BHK
	await tab.click("#bd_3");

	await tab.waitForSelector("#bd_4"); // property type 4BHK
	await tab.click("#bd_4");

	await tab.waitForSelector("#keyword"); // property location
	await tab.type("#keyword", location, { delay: 100 });

	await tab.waitForSelector("#submit_query"); // property search
	await navigationHelper(tab, "#submit_query");

	let result = await tab.evaluate(() => {
		let properties = Array.from(
			document.querySelectorAll('div[data-label="SEARCH"] > div.srp')
		);
		return properties.map((property) => {
			let propertyName = property.querySelector("table h2").innerText;
			let societyName = property.querySelector(
				"table #srp_tuple_society_heading"
			).innerText;
			let price = property.querySelector("table #srp_tuple_price").innerText;
			let description = property.querySelector("table #srp_tuple_description")
				.innerText;
			return {
				propertyName,
				societyName,
				price,
				description,
			};
		});
	});

    console.log(result);

    await fs.promises.writeFile(
		"LatestProperty2.JSON",
		JSON.stringify(result, null, 4)
	);
    
    console.log("All Properties processed");

})();

async function navigationHelper(tab, selector) {
	await Promise.all([
		tab.waitForNavigation({
			waitUntil: "networkidle2",
		}),
		tab.click(selector),
	]);
}

