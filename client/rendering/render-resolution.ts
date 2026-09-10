/** Bound 3D fill cost independently of full-resolution DOM controls. */
export function renderPixelRatio(width:number,height:number,deviceRatio:number,high:boolean){
  const preferred=Math.min(deviceRatio,high?1.75:1);
  return Math.min(preferred,Math.sqrt(1_536_000/Math.max(1,width*height)));
}
