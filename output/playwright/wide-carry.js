async(page)=>{
 await page.getByText('Character / item pose review',{exact:true}).click();
 await page.getByRole('button',{name:'Camera aim practice',exact:true}).click();
 await page.getByRole('combobox',{name:'Review movement',exact:true}).selectOption('left');
 await page.waitForTimeout(700);
 await page.screenshot({path:'output/playwright/wide-carry-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(500);
 await page.screenshot({path:'output/playwright/wide-carry-phone.png'});
}

