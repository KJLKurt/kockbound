async(page)=>{
 await page.locator('header').evaluate(el=>el.style.display='');
 await page.getByRole('combobox',{name:'Review character',exact:true}).selectOption('wisp');
 await page.getByRole('combobox',{name:'Review movement',exact:true}).selectOption('back');
 await page.getByRole('combobox',{name:'Review held item',exact:true}).selectOption('wind');
 await page.locator('header').evaluate(el=>el.style.display='none');
 await page.waitForTimeout(600);await page.screenshot({path:'output/playwright/occluded-wisp-wind.png'});
 await page.getByRole('button',{name:'Drop',exact:true}).click();
 await page.waitForTimeout(200);await page.screenshot({path:'output/playwright/occluded-wisp-drop.png'});
}
