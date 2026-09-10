async(page)=>{
 await page.setViewportSize({width:390,height:844});
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:2});
 await page.getByRole('button',{name:/Let’s play/}).click();
 await page.waitForTimeout(5200);
 const pad=await page.getByRole('group',{name:'Movement joystick',exact:true}).boundingBox();
 const dash=await page.getByRole('button',{name:'Dash',exact:true}).boundingBox();
 const move={id:1,x:pad.x+pad.width/2,y:pad.y+pad.height/2,radiusX:8,radiusY:8,force:1};
 const action={id:2,x:dash.x+dash.width/2,y:dash.y+dash.height/2,radiusX:8,radiusY:8,force:1};
 await page.screenshot({path:'output/playwright/touch-round-before.png'});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[move]});
 move.y-=45;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[move]});
 await page.waitForTimeout(100);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[move,action]});
 await page.waitForTimeout(100);
 const together={knob:await page.locator('#touch-knob').getAttribute('style'),dash:await page.locator('#dash-label').textContent()};
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[move]});
 await page.waitForTimeout(100);
 const oneFinger={knob:await page.locator('#touch-knob').getAttribute('style'),dash:await page.locator('#dash-label').textContent()};
 await page.screenshot({path:'output/playwright/touch-round-moving.png'});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const released=await page.locator('#touch-knob').getAttribute('style');
 await page.keyboard.press('Escape');await cdp.detach();
 return {together,oneFinger,released};
}
