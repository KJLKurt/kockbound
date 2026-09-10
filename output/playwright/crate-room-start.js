async(page)=>{
 const peers=page.context().pages().filter(peer=>peer!==page);
 await page.getByRole('button',{name:'Create a room',exact:true}).click();
 await page.getByRole('link',{name:'Open another player tab ↗',exact:true}).waitFor();
 const href=await page.getByRole('link',{name:'Open another player tab ↗',exact:true}).getAttribute('href');
 await Promise.all(peers.map(async peer=>{await peer.goto(new URL(href,page.url()).href);await peer.getByRole('button',{name:'Join room',exact:true}).click();}));
 await page.bringToFront();if(await page.getByRole('button',{name:'Back to the action',exact:true}).isVisible())await page.getByRole('button',{name:'Back to the action',exact:true}).click();
 await page.waitForTimeout(9300);await page.screenshot({path:'output/playwright/crate-room-start.png'});
 return {room:href,status:await page.locator('#network-status').textContent(),timer:await page.locator('#timer').textContent(),roster:await page.locator('#roster').textContent()};
}
