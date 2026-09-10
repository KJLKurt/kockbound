async(page)=>{
 await page.getByRole('button',{name:'Open settings',exact:true}).click();
 await page.getByText('Choose individual items',{exact:true}).click();
 for(const name of ['Spring pod','Platform remover','Cloud bomb','Push shovel','Big mode','Helicopter hat','Wind blaster','Rolling rock','Optional hazards'])await page.getByRole('checkbox',{name:new RegExp('^'+name)}).uncheck();
 await page.getByRole('button',{name:'All set',exact:true}).click();
 for(let i=0;i<3;i++){const peer=await page.context().newPage();await peer.goto('http://127.0.0.1:4179');await peer.getByRole('button',{name:/Let’s play/}).waitFor();}
 await page.bringToFront();
 await page.getByRole('button',{name:'Room play · multiplayer preview →',exact:true}).click();
 await page.getByRole('combobox',{name:'Human players',exact:true}).selectOption('4');
 return {pages:page.context().pages().length,humans:await page.getByRole('combobox',{name:'Human players',exact:true}).inputValue()};
}
