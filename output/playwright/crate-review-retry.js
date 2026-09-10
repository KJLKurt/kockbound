async(page)=>{
 await page.getByRole('button',{name:'Leave round',exact:true}).click();
 await page.getByRole('button',{name:/Let’s play/}).click();
 await page.waitForTimeout(5100);
 await page.keyboard.down('KeyW');await page.waitForTimeout(800);await page.keyboard.up('KeyW');
 await page.waitForTimeout(3200);await page.screenshot({path:'output/playwright/crate-review-round3.png'});await page.keyboard.press('Escape');
 return {hint:await page.locator('#pickup-hint').textContent(),item:await page.locator('#item-status').textContent()};
}

