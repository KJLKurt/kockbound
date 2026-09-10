async(page)=>{const reports=[];for(const peer of page.context().pages())reports.push({url:peer.url(),text:(await peer.locator('body').innerText()).slice(-1600)});return reports;}
