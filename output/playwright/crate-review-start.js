async(page)=>{
 await page.getByRole('button',{name:'Open settings',exact:true}).click();
 await page.getByText('Choose individual items',{exact:true}).click();
 for(const name of ['Spring pod','Platform remover','Cloud bomb','Push shovel','Big mode','Helicopter hat','Wind blaster','Rolling rock','Optional hazards'])await page.getByRole('checkbox',{name:new RegExp('^'+name)}).uncheck();
 await page.getByRole('button',{name:'All set',exact:true}).click();
 await page.getByRole('button',{name:/Let’s play/}).click();
 await page.waitForTimeout(9200);
 await page.screenshot({path:'output/playwright/crate-review-first.png'});
 await page.keyboard.press('Escape');
 return {hint:await page.locator('#pickup-hint').textContent(),item:await page.locator('#item-status').textContent()};
}
