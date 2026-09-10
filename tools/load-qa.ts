// Opt-in, read-only instrumentation for the ordinary packaged game.
performance.setResourceTimingBufferSize(2000);
const panel=document.createElement('details');
panel.style.cssText='position:fixed;z-index:99;left:8px;bottom:8px;max-width:90vw;max-height:40vh;overflow:auto;background:#fff;color:#173b4b;padding:8px;font:11px monospace';
const heading=document.createElement('summary');heading.textContent='Development load / memory report';
const report=document.createElement('pre');report.id='load-report';panel.append(heading,report);document.body.append(panel);
let readyMs:number|null=null;
const samples:unknown[]=[];let wasResult=false;
function sample(){
 const resources=performance.getEntriesByType('resource') as PerformanceResourceTiming[];
 const navigation=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined;
 const entries=[...(navigation?[navigation]:[]),...resources];
 const memory=(performance as Performance&{memory?:{usedJSHeapSize:number;totalJSHeapSize:number;jsHeapSizeLimit:number}}).memory;
 const play=document.querySelector<HTMLButtonElement>('#play');if(readyMs===null&&play&&!play.disabled)readyMs=Math.round(performance.now());
 const result=document.querySelector<HTMLElement>('#result');const visible=!!result&&!result.hidden;
 const heap=memory?{used:memory.usedJSHeapSize,total:memory.totalJSHeapSize,limit:memory.jsHeapSizeLimit}:null;
 if(visible&&!wasResult)samples.push({cycle:samples.length+1,atMs:Math.round(performance.now()),heap});wasResult=visible;
 report.textContent=JSON.stringify({readyMs,elapsedMs:Math.round(performance.now()),viewport:[innerWidth,innerHeight],devicePixelRatio,visibility:document.visibilityState,resourceCount:resources.length,transferBytes:entries.reduce((n,e)=>n+e.transferSize,0),encodedBytes:entries.reduce((n,e)=>n+e.encodedBodySize,0),decodedBytes:entries.reduce((n,e)=>n+e.decodedBodySize,0),zeroTransferEntries:entries.filter(e=>e.transferSize===0).length,heap,heapNote:'Chromium approximate heap; may include shared processes and uncollected garbage. No forced GC.',cycles:samples,largest:resources.slice().sort((a,b)=>b.encodedBodySize-a.encodedBodySize).slice(0,12).map(e=>({path:new URL(e.name).pathname,bytes:e.encodedBodySize,durationMs:Math.round(e.duration)}))},null,2);
}
sample();setInterval(sample,250);
