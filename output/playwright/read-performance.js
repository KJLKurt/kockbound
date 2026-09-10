async (page) => JSON.parse(await page.locator('#report').textContent())
