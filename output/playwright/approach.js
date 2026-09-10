async (page) => {
 await page.getByRole('button',{name:'Back to the action',exact:true}).click();
 await page.keyboard.down('KeyW');await page.keyboard.down('KeyD');await page.waitForTimeout(700);await page.keyboard.up('KeyD');await page.waitForTimeout(600);await page.keyboard.up('KeyW');
 await page.screenshot({path:'output/playwright/approach-pickup.png'});
 await page.keyboard.press('Escape');
}
