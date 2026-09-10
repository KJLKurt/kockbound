async(page)=>{
 const pages=page.context().pages();
 for(const peer of pages){const back=peer.getByRole('button',{name:'Back to the island',exact:true});if(await back.isVisible())await back.click();if(!(await peer.getByRole('button',{name:'Join room',exact:true}).isVisible()))await peer.getByRole('button',{name:'Room play · multiplayer preview →',exact:true}).click();}
 await page.getByRole('combobox',{name:'Human players',exact:true}).selectOption('4');await page.getByRole('button',{name:'Create a room',exact:true}).click();
 const link=page.getByRole('link',{name:'Open another player tab ↗',exact:true});await link.waitFor();const href=await link.getAttribute('href'),code=href.split('room=')[1];
 await Promise.all(pages.filter(peer=>peer!==page).map(async peer=>{await peer.getByRole('textbox',{name:'Room code',exact:true}).fill(code);await peer.getByRole('button',{name:'Join room',exact:true}).click();}));
 await page.bringToFront();if(await page.getByRole('button',{name:'Back to the action',exact:true}).isVisible())await page.getByRole('button',{name:'Back to the action',exact:true}).click();
 await page.waitForTimeout(18000);await page.screenshot({path:'output/playwright/crate-room-start.png'});
 return {room:code,timer:await page.locator('#timer').textContent(),status:await page.locator('#network-status').textContent()};
}
