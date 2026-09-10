async(page)=>{
 await page.getByRole('button',{name:'Leave round',exact:true}).click();
 await page.getByRole('button',{name:/Let’s play/}).click();
 await page.waitForTimeout(9150);await page.screenshot({path:'output/playwright/crate-review-round4.png'});await page.keyboard.press('Escape');
 return {hint:await page.locator('#pickup-hint').textContent(),item:await page.locator('#item-status').textContent()};
}


