async(page)=>{
 for(const name of ['Spring pod','Platform remover','Cloud bomb','Push shovel','Big mode','Helicopter hat','Wind blaster','Rolling rock','Optional hazards'])await page.getByRole('checkbox',{name:new RegExp('^'+name)}).uncheck();
 await page.getByRole('button',{name:'All set',exact:true}).click();
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:/Let’s play/}).click();
 await page.waitForTimeout(9200);
 await page.screenshot({path:'output/playwright/crate-start.png'});
 await page.keyboard.press('Escape');
 return await page.locator('#pickup-hint').textContent();
}
