async (page) => {
 for (const name of ['Spring pod','Mystery crate','Platform remover','Cloud bomb','Push shovel','Big mode','Helicopter hat','Wind blaster','Rolling rock','Optional hazards']) await page.getByRole('checkbox',{name:new RegExp('^'+name)}).uncheck();
 await page.getByRole('button',{name:'All set',exact:true}).click();
 await page.setViewportSize({width:390,height:844});
}
