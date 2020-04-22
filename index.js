const fs = require('fs');
const puppeteer = require('puppeteer');
const got = require('got');
const Parser = require('rss-parser');
const commandLineArgs = require('command-line-args');

(async () => {
  const parser = new Parser();
  const options = commandLineArgs([
    { name: 'limit', alias: 'l', type: Number, defaultValue: 0 },
    { name: 'random', alias: 'r', type: Boolean, defaultValue: false },
    { name: 'width', alias: 'w', type: Number, defaultValue: 1200 },
    { name: 'height', alias: 'h', type: Number, defaultValue: 800 },
  ]);

  console.log('Fetching inspiration');

  const feed = await parser.parseURL('https://personalsit.es/feed/all.xml');
  const personalsites = feed.items.map(i => i.link).filter(i => i !== '');
  console.log('Fetched "personalsit.es"');
  
  const eleventySitesResponse = await got('https://raw.githubusercontent.com/11ty/11ty-website/master/_data/fastestSites.json');
  let eleventySites = JSON.parse(eleventySitesResponse.body);
  eleventySites = eleventySites.map(i => i.url);
  console.log('Fetched "Built with Eleventy" sites');

  let sites = new Set([...personalsites, ...eleventySites]);
  sites = Array.from(sites);

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const fileName = (url) => {
    url = url.replace(/[\/:]/g, '');
    url = url.replace(/[-]/g, '_');
    url = url.replace(/__/g, '_');
    return url;
  };

  let prevLength = 0;
  const updateProgress = (text) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(text.padEnd(prevLength));

    if (text.length > prevLength) {
      prevLength = text.length;
    }
  };

  if (options.random) {
    shuffle(sites);
  }
  if (options.limit !== 0) {
    sites = sites.slice(0, options.limit);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: options.width,
    height: options.height,
    deviceScaleFactor: 1,
  });

  for (let i = 0; i < sites.length; i++) {
    const url = sites[i];
    updateProgress(`Taking screenshot of ${url} (${i + 1}/${sites.length})`);
    try {
      await page.goto(url);
      await page.screenshot({path: `screenshots/${fileName(url)}.png`});
    }
    catch (e) {
      // console.log(`Skipping ${url}`);
    }
  }
  console.log();
  console.log('Finished taking screenshots!');
 
  await browser.close();
})();