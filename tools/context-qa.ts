const bar=document.createElement('div');bar.style.cssText='position:fixed;z-index:99;bottom:0;left:0;background:#fff;padding:8px;font:12px sans-serif';
bar.textContent='Development graphics test: ';
const canvas=document.querySelector<HTMLCanvasElement>('#game')!;
let extension:WEBGL_lose_context|null=null;
for(const [label,restore] of [['Lose graphics',false],['Restore graphics',true]] as const){const button=document.createElement('button');button.textContent=label;button.onclick=()=>{extension??=canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')??null;if(extension){if(restore)extension.restoreContext();else extension.loseContext();}else button.textContent='Extension unavailable';};bar.append(button);}
document.body.append(bar);

