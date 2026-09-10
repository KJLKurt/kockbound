/** Optional diagnostic only. Never wait synchronously for a GPU query. */
export class GpuTimer {
  readonly samples:number[]=[];
  discarded=0;
  private gl:WebGL2RenderingContext;
  private extension:{TIME_ELAPSED_EXT:number;GPU_DISJOINT_EXT:number}|null;
  private pending:WebGLQuery[]=[];
  private active:WebGLQuery|null=null;
  constructor(gl:WebGL2RenderingContext){this.gl=gl;this.extension=gl.getExtension('EXT_disjoint_timer_query_webgl2');}
  get available(){return !!this.extension;}
  get pendingCount(){return this.pending.length;}
  reset(){for(const query of this.pending)this.gl.deleteQuery(query);this.pending=[];this.samples.length=0;this.discarded=0;}
  poll(){
    const ext=this.extension;if(!ext)return;
    if(this.gl.getParameter(ext.GPU_DISJOINT_EXT)){this.discarded+=this.pending.length;for(const query of this.pending)this.gl.deleteQuery(query);this.pending=[];return;}
    while(this.pending.length&&this.gl.getQueryParameter(this.pending[0],this.gl.QUERY_RESULT_AVAILABLE)){
      const query=this.pending.shift()!,nanoseconds=Number(this.gl.getQueryParameter(query,this.gl.QUERY_RESULT));this.gl.deleteQuery(query);
      if(Number.isFinite(nanoseconds)&&nanoseconds>=0)this.samples.push(nanoseconds/1e6);
    }
  }
  begin(measuring:boolean){
    if(!measuring||!this.extension||this.active||this.pending.length>=8)return;
    const query=this.gl.createQuery();if(!query)return;
    this.active=query;this.gl.beginQuery(this.extension.TIME_ELAPSED_EXT,query);
  }
  end(){if(!this.active||!this.extension)return;this.gl.endQuery(this.extension.TIME_ELAPSED_EXT);this.pending.push(this.active);this.active=null;}
}
