async (page) => {
 await page.getByRole('button',{name:'Back to the action',exact:true}).click();await page.waitForTimeout(1100);
 const status=await page.locator('#item-status').textContent();const visible=await page.locator('#item-hud').isVisible();
 await page.screenshot({path:'output/playwright/repicked.png'});await page.keyboard.press('Escape');return {visible,status};
}
