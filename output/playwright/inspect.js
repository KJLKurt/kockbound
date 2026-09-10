async (page) => {
 await page.getByRole('button',{name:'Back to the action',exact:true}).click();
 await page.screenshot({path:'output/playwright/first-pickup.png'});
 await page.keyboard.press('Escape');
}
