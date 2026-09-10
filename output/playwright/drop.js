async (page) => {
 await page.getByRole('button',{name:'Back to the action',exact:true}).click();
 await page.getByText('Drop · Q',{exact:true}).click();await page.waitForTimeout(150);
 const hidden=!(await page.locator('#item-hud').isVisible());
 await page.screenshot({path:'output/playwright/dropped.png'});await page.keyboard.press('Escape');return {itemHudHidden:hidden};
}
