async(page)=>{
 await page.getByRole('combobox',{name:'Review movement',exact:true}).selectOption('left');
 for(const character of ['sprout','lumi','pebble','wisp']){
  await page.getByRole('combobox',{name:'Review character',exact:true}).selectOption(character);
  await page.waitForTimeout(700);
  await page.screenshot({path:`output/playwright/review-${character}-left.png`});
 }
 return await page.getByRole('combobox',{name:'Review character',exact:true}).inputValue();
}
