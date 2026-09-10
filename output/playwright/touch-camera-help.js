async(page)=>{
 const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:2});
 await page.setViewportSize({width:390,height:844});await page.reload();
 await page.getByRole('button',{name:'Open settings',exact:true}).click();await page.getByRole('combobox',{name:'Camera view',exact:true}).selectOption('third');await page.getByRole('button',{name:'All set',exact:true}).click();
 await page.getByRole('button',{name:/Let’s play/}).click();await page.waitForTimeout(5100);
 const initial=await page.locator('#look-hint').textContent();await page.screenshot({path:'output/playwright/touch-camera-help.png'});
 await page.keyboard.down('KeyL');await page.waitForTimeout(50);await page.keyboard.up('KeyL');
 const keyboard=await page.locator('#look-hint').textContent();
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:280,y:420}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const touchAgain=await page.locator('#look-hint').textContent();await page.keyboard.press('Escape');await cdp.detach();return {initial,keyboard,touchAgain};
}
