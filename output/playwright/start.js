async (page) => {
 await page.getByRole('button',{name:/Let’s play/}).click();
 await page.waitForTimeout(9150);
 await page.keyboard.press('Escape');
 await page.screenshot({path:'output/playwright/first-pickup-paused.png'});
}
