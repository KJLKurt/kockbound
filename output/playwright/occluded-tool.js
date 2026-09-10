async(page)=>{ await page.reload();
 await page.getByRole('button',{name:'Projectile motion',exact:true}).waitFor();
 await page.getByText('Character / item pose review',{exact:true}).click();
 await page.getByRole('combobox',{name:'Review movement',exact:true}).selectOption('left');
 await page.waitForTimeout(500);
 await page.screenshot({path:'output/playwright/occluded-tool-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 await page.locator('header').evaluate(el=>el.style.display='none');
 await page.waitForTimeout(500);
 await page.screenshot({path:'output/playwright/occluded-tool-phone.png'});
}

