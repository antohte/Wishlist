import { createServer } from 'node:http'
import { readFile,stat } from 'node:fs/promises'
import { resolve,extname } from 'node:path'
import { serveApi } from '../server/adapter.ts'
const root=resolve('dist')
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.otf':'font/otf','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8'}
createServer(async(req,res)=>{
 if(req.url?.startsWith('/api/manage')){await serveApi(req,res);return}
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)
  let path=resolve(root,`.${pathname}`)
  if(!path.startsWith(`${root}/`)&&path!==root){res.writeHead(404);res.end();return}
  if(path===root || pathname==='/admin' || pathname.startsWith('/admin/'))path=resolve(root,'index.html')
  if(!(await stat(path)).isFile())throw Error()
  res.setHeader('Content-Type',types[extname(path)]||'application/octet-stream')
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Robots-Tag','noindex, nofollow')
  res.setHeader('Referrer-Policy','no-referrer')
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'")
  res.end(await readFile(path))
 }catch{res.writeHead(404);res.end('Introuvable')}
}).listen(Number(process.env.PORT||8088),process.env.HOST||'127.0.0.1',()=>console.log(`Site prêt sur http://${process.env.HOST||'127.0.0.1'}:${process.env.PORT||8088}`))
