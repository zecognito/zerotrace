#!/usr/bin/env python3
import json, os, urllib.request, datetime, pathlib

OUT=pathlib.Path("analytics/data/latest.json")
RPC=os.environ.get("ZCASH_RPC_URL","").strip()
USER=os.environ.get("ZCASH_RPC_USER","")
PASSWORD=os.environ.get("ZCASH_RPC_PASSWORD","")

def rpc(method,params=[]):
    if not RPC: return None
    body=json.dumps({"jsonrpc":"1.0","id":"zerotrace","method":method,"params":params}).encode()
    req=urllib.request.Request(RPC,data=body,headers={"Content-Type":"application/json"})
    if USER:
        import base64
        token=base64.b64encode(f"{USER}:{PASSWORD}".encode()).decode()
        req.add_header("Authorization","Basic "+token)
    with urllib.request.urlopen(req,timeout=25) as r:
        x=json.load(r)
    if x.get("error"): raise RuntimeError(x["error"])
    return x["result"]

old={}
if OUT.exists():
    try: old=json.loads(OUT.read_text())
    except: pass

metrics=dict(old.get("metrics",{}))
source={}
try:
    b=rpc("getblockchaininfo")
    if b:
        metrics["height"]=b.get("blocks")
        metrics["difficulty"]=b.get("difficulty")
        cs=b.get("chainSupply") or {}
        metrics["total_supply"]=cs.get("chainValue")
        for p in b.get("valuePools") or []:
            key=(p.get("id") or "").lower()
            if key:
                metrics[key+"_pool"]=p.get("chainValue")
        source["rpc_blockchaininfo"]=True
except Exception as e: source["rpc_blockchaininfo_error"]=str(e)

try:
    h=rpc("getnetworksolps",[-1])
    if h is not None:
        metrics["hashrate"]=h
        source["rpc_networksolps"]=True
except Exception as e: source["rpc_networksolps_error"]=str(e)

shielded_keys=[k for k in metrics if k.endswith("_pool") and not k.startswith("transparent")]
vals=[metrics[k] for k in shielded_keys if isinstance(metrics[k],(int,float))]
if vals:
    metrics["shielded_supply"]=sum(vals)
    if isinstance(metrics.get("total_supply"),(int,float)) and metrics["total_supply"]:
        metrics["shielded_pct"]=100*metrics["shielded_supply"]/metrics["total_supply"]

payload={
 "schema":"zerotrace.analytics.v1",
 "as_of":datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00","Z"),
 "metrics":metrics,
 "source_status":source
}
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps(payload,indent=2,sort_keys=True)+"\n")
print(json.dumps(payload,indent=2))
