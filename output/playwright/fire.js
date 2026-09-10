async (page) => {
 await page.getByRole('button',{name:'Back to the action',exact:true}).click();
 await page.keyboard.down('KeyA');await page.keyboard.down('KeyS');await page.waitForTimeout(100);await page.keyboard.up('KeyA');await page.keyboard.up('KeyS');
 await page.getByText('Fire',{exact:true}).click();await page.waitForTimeout(150);
 await page.screenshot({path:'output/playwright/fired.png'});await page.keyboard.press('Escape');
 return await page.locator('#item-status').textContent();
}
