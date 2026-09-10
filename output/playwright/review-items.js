async(page)=>{
 await page.getByRole('combobox',{name:'Review movement',exact:true}).selectOption('back');
 await page.getByRole('combobox',{name:'Review held item',exact:true}).selectOption('rock');await page.waitForTimeout(700);await page.screenshot({path:'output/playwright/review-wisp-rock-back.png'});
 await page.getByRole('combobox',{name:'Review held item',exact:true}).selectOption('helicopter');await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);await page.screenshot({path:'output/playwright/review-phone-controls.png'});
 await page.getByText('Character / item pose review',{exact:true}).click();await page.screenshot({path:'output/playwright/review-wisp-hat-phone.png'});
 return await page.locator('#item-status').textContent();
}
