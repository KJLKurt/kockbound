async(page)=>{
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Crate control practice',exact:true}).click();
 await page.locator('header').evaluate(el=>el.style.display='none');
 await page.keyboard.down('KeyD');await page.keyboard.press('Space');await page.waitForTimeout(200);await page.keyboard.up('KeyD');await page.waitForTimeout(150);
 await page.screenshot({path:'output/playwright/crate-controls-phone.png'});
 const status=await page.locator('#item-status').textContent();await page.keyboard.press('Escape');return status;
}
