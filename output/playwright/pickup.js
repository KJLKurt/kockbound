async (page) => {
 await page.getByRole('button',{name:'Back to the action',exact:true}).click();
 await page.keyboard.down('KeyW');await page.keyboard.down('KeyD');await page.waitForTimeout(150);await page.keyboard.up('KeyD');await page.waitForTimeout(300);await page.keyboard.up('KeyW');await page.waitForTimeout(100);
 console.log(await page.locator('#item-status').textContent());
 await page.screenshot({path:'output/playwright/picked-up.png'});await page.keyboard.press('Escape');
}
