async (page) => {
 await page.setViewportSize({width:1920,height:1080});
 await page.waitForFunction(()=>document.querySelector('#report')?.textContent?.startsWith('{'));
 await page.getByRole('button',{name:'Measure 3 minutes',exact:true}).click();
 await page.screenshot({path:'output/playwright/direct-stress.png'});
 return JSON.parse(await page.locator('#report').textContent());
}
