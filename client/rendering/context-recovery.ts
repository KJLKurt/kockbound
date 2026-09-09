/** Allow the browser to restore WebGL; keep the game in control of resuming play. */
export function watchGraphicsContext(canvas:EventTarget,onLost:()=>void,onRestored:()=>void){
  let lost=false;
  const lose=(event:Event)=>{event.preventDefault();if(lost)return;lost=true;onLost();};
  const restore=()=>{if(!lost)return;lost=false;onRestored();};
  canvas.addEventListener('webglcontextlost',lose);canvas.addEventListener('webglcontextrestored',restore);
  return ()=>{canvas.removeEventListener('webglcontextlost',lose);canvas.removeEventListener('webglcontextrestored',restore);};
}
