async(page)=>{
 await page.setViewportSize({width:390,height:844});
 const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:2});
 const results=[];
 for(const mode of ['third','first']){
  await page.getByRole('button',{name:'Open settings',exact:true}).click();
  await page.getByRole('combobox',{name:'Camera view',exact:true}).selectOption(mode);
  await page.getByRole('button',{name:'All set',exact:true}).click();
  await page.getByRole('button',{name:/Let’s play/}).click();await page.waitForTimeout(5200);
  const pad=await page.getByRole('group',{name:'Movement joystick',exact:true}).boundingBox();
  const move={id:1,x:pad.x+pad.width/2,y:pad.y+pad.height/2-35,radiusX:8,radiusY:8,force:1};
  const look={id:2,x:250,y:420,radiusX:8,radiusY:8,force:1};
  await page.screenshot({path:`output/playwright/touch-${mode}-before.png`});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[move,look]});
  look.x+=70;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[move,look]});await page.waitForTimeout(120);
  await page.screenshot({path:`output/playwright/touch-${mode}-turned.png`});
  const during=await page.locator('#touch-knob').getAttribute('style');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[move]});
  const afterLookRelease=await page.locator('#touch-knob').getAttribute('style');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const released=await page.locator('#touch-knob').getAttribute('style');
  const locked=await page.evaluate(()=>!!document.pointerLockElement);
  await page.keyboard.press('Escape');
  results.push({mode,during,afterLookRelease,released,locked});
  await page.getByRole('button',{name:'Leave round',exact:true}).click();
 }
 await cdp.detach();return results;
}
