async(page)=>{
 await page.reload();
 await page.getByRole('button',{name:'Crate control practice',exact:true}).click();
 await page.keyboard.down('KeyD');await page.keyboard.press('Space');await page.waitForTimeout(200);await page.keyboard.up('KeyD');await page.waitForTimeout(150);
 const collected={visible:await page.locator('#item-hud').isVisible(),status:await page.locator('#item-status').textContent()};
 await page.screenshot({path:'output/playwright/crate-controls-collected.png'});
 await page.keyboard.press('KeyE');await page.waitForTimeout(100);
 const fired=await page.locator('#item-status').textContent();
 await page.screenshot({path:'output/playwright/crate-controls-fired.png'});
 await page.keyboard.press('KeyQ');await page.waitForTimeout(100);
 const dropped=!(await page.locator('#item-hud').isVisible());
 await page.keyboard.press('Escape');
 return {collected,fired,dropped};
}
