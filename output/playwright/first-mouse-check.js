async (page) => {
 await page.getByRole('button',{name:'Back to the action',exact:true}).click();
 await page.getByRole('button',{name:'Open settings',exact:true}).click();
 await page.getByRole('combobox',{name:'Camera view',exact:true}).selectOption('first');
 await page.getByRole('button',{name:'All set',exact:true}).click();
 await page.screenshot({path:'output/playwright/first-mouse-before.png'});
 await page.mouse.click(450,400);await page.waitForTimeout(150);
 const locked=await page.evaluate(()=>document.pointerLockElement?.id??null);
 await page.mouse.move(300,420,{steps:10});await page.waitForTimeout(150);
 await page.screenshot({path:'output/playwright/first-mouse-after.png'});
 await page.keyboard.press('Escape');await page.waitForTimeout(150);
 return {locked,afterEscape:await page.evaluate(()=>document.pointerLockElement?.id??null),paused:await page.getByRole('button',{name:'Back to the action',exact:true}).isVisible()};
}
