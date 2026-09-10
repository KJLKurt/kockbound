async(page)=>{
 await page.getByRole('button',{name:'Back to the action',exact:true}).click();
 await page.keyboard.down('KeyW');await page.keyboard.press('Space');await page.waitForTimeout(1000);await page.keyboard.up('KeyW');
 await page.keyboard.down('KeyA');await page.waitForTimeout(650);await page.keyboard.up('KeyA');
 await page.waitForTimeout(5700);
 await page.screenshot({path:'output/playwright/crate-review-second.png'});await page.keyboard.press('Escape');
 return {hint:await page.locator('#pickup-hint').textContent(),item:await page.locator('#item-status').textContent()};
}
