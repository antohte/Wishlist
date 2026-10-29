import type { IncomingMessage,ServerResponse } from 'node:http'
import { handleRequest } from './api.ts'
export async function serveApi(req:IncomingMessage & {body?:unknown},res:ServerResponse) {
 try {
  const headers=new Headers()
  for(const [name,value] of Object.entries(req.headers))if(value)headers.set(name,Array.isArray(value)?value.join(','):value)
  const protocol=process.env.VERCEL?'https':'http'
  const requestUrl=`${protocol}://${headers.get('host')||'localhost'}${req.url}`
  let bytes:Buffer|undefined
  if(req.method!=='GET'&&req.method!=='HEAD') {
    if(req.body!==undefined)bytes=Buffer.from(typeof req.body==='string'?req.body:JSON.stringify(req.body))
    else {const chunks:Buffer[]=[];let total=0;for await(const chunk of req){const buffer=Buffer.from(chunk);total+=buffer.length;if(total>4_000_000){res.writeHead(413);res.end();return}chunks.push(buffer)}bytes=Buffer.concat(chunks)}
  }
  const response=await handleRequest(new Request(requestUrl,{method:req.method,headers,...bytes?{body:new Uint8Array(bytes)}:{}}))
  res.statusCode=response.status;response.headers.forEach((value,key)=>res.setHeader(key,value))
  res.end(Buffer.from(await response.arrayBuffer()))
 }catch{res.statusCode=500;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:'Le serveur est indisponible.'}))}
}
