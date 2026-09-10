async (page) => {
 await page.getByRole('combobox',{name:'Camera view',exact:true}).selectOption('third');
 await page.getByRole('checkbox',{name:/^Mouse look/}).check();
 await page.getByRole('button',{name:'All set',exact:true}).click();
 await page.getByRole('button',{name:/Let’s play/}).click();await page.waitForTimeout(150);
 await page.screenshot({path:'output/playwright/mouse-before.png'});
 await page.mouse.click(450,400);await page.waitForTimeout(150);
 const locked=await page.evaluate(()=>document.pointerLockElement?.id??null);
 await page.mouse.move(600,400,{steps:10});await page.waitForTimeout(150);
 const hint=await page.locator('#look-hint').textContent();
 await page.screenshot({path:'output/playwright/mouse-after.png'});
 await page.keyboard.press('Escape');await page.waitForTimeout(150);
 return {locked,hint,afterEscape:await page.evaluate(()=>document.pointerLockElement?.id??null),paused:await page.getByRole('button',{name:'Back to the action',exact:true}).isVisible()};
}
