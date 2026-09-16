/* ZeroTrace live analytics loader */
(async()=>{
  const nodes=[...document.querySelectorAll("[data-zt-live]")];
  if(!nodes.length)return;
  try{
    const r=await fetch("/analytics/data/latest.json?ts="+Date.now(),{cache:"no-store"});
    if(!r.ok)throw new Error("HTTP "+r.status);
    const d=await r.json();
    const fmt=(v,k)=>{
      if(v===null||v===undefined)return "—";
      if(k.includes("pct")||k.includes("share"))return Number(v).toFixed(2)+"%";
      if(k.includes("supply")||k.includes("pool"))return Number(v).toLocaleString(undefined,{maximumFractionDigits:0})+" ZEC";
      if(k.includes("difficulty"))return Number(v).toLocaleString(undefined,{maximumFractionDigits:2});
      if(k.includes("hashrate"))return Number(v).toLocaleString(undefined,{maximumFractionDigits:0})+" Sol/s";
      return Number(v).toLocaleString(undefined,{maximumFractionDigits:2});
    };
    nodes.forEach(n=>{const k=n.dataset.ztLive;if(k in d.metrics)n.textContent=fmt(d.metrics[k],k)});
    document.querySelectorAll("[data-zt-updated]").forEach(n=>n.textContent=d.as_of||"—");
    document.documentElement.dataset.ztData="live";
  }catch(e){
    console.warn("ZeroTrace live data unavailable:",e);
    document.documentElement.dataset.ztData="stale";
  }
})();
