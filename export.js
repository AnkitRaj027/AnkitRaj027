const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    fs.mkdirSync('assets', { recursive: true });

    const browser = await chromium.launch();

    const page = await browser.newPage({
        viewport: { width: 900, height: 800 },
        deviceScaleFactor: 2
    });

    await page.goto('file://' + path.join(__dirname, 'profile.html'));
    await page.evaluate(() => document.fonts.ready);

    const ids = await page.$$eval(
        'section[id]',
        sections => sections.map(section => section.id)
    );

    for (const [i, id] of ids.entries()) {
        const number = String(i + 1).padStart(2, '0');

        const filename = `assets/${number}-${id}.png`;

        await page.locator(`#${id}`).screenshot({
            path: filename
        });

        console.log('Saved:', filename);
    }

    await browser.close();
})();