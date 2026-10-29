import { randomUUID } from 'node:crypto'
import { gifts,categories } from '../src/data/wishlist.ts'
import { readBytes,writeBytes,storageReady,Conflict } from './storage.ts'
import { authenticated,authReady,passwordMatches,sessionCookie,allowLogin } from './auth.ts'
import { catalogSchema } from './schema.ts'
const seed={gifts,categories:categories.filter(c=>c!=='Tout')}
const json=(data:unknown,status=200,headers:Record<string,string>={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}})
async function body(request:Request) {const raw=await request.text();if(Buffer.byteLength(raw)>4_000_000)throw new Error('BODY_TOO_LARGE');return JSON.parse(raw)}
function imageType(bytes:Buffer) {
 if(bytes.subarray(0,3).equals(Buffer.from([0xff,0xd8,0xff])))return {ext:'jpg',type:'image/jpeg'}
 if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return {ext:'png',type:'image/png'}
 if(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP')return {ext:'webp',type:'image/webp'}
 return null
}
export async function handleRequest(request:Request):Promise<Response> {
 try {
  const url=new URL(request.url),action=url.searchParams.get('action')??'catalog'
  if(request.method==='GET'&&action==='catalog') {
    if(!storageReady())return json({...seed,version:'seed'})
    const current=await readBytes('catalog.json')
    return json({...current?JSON.parse(current.bytes.toString()):seed,version:current?.version??'seed'})
  }
  if(request.method==='GET'&&action==='image') {
    const key=url.searchParams.get('key')??''
    if(!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(key))return json({error:'Photo introuvable.'},404)
    const image=await readBytes(`images/${key}`)
    if(!image)return json({error:'Photo introuvable.'},404)
    const format=imageType(image.bytes);if(!format)return json({error:'Photo invalide.'},404)
    return new Response(new Uint8Array(image.bytes),{headers:{'Content-Type':format.type,'Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'}})
  }
  if(!authReady()||!storageReady())return json({error:'L’administration doit être configurée sur le serveur.',configured:false},503)
  if(request.method==='GET'&&action==='session')return json({authenticated:authenticated(request),email:authenticated(request)?process.env.ADMIN_EMAIL:undefined})
  if(!['POST','PUT'].includes(request.method))return json({error:'Méthode non autorisée.'},405)
  const origin=request.headers.get('origin')
  if(!origin || origin!==url.origin)return json({error:'Origine de la requête refusée.'},403)
  if(action==='login'&&request.method==='POST') {
    const data=await body(request)
    if(!data || typeof data.email!=='string'||typeof data.password!=='string'||data.email.length>254||data.password.length>300)return json({error:'Identifiants invalides.'},400)
    if(!await allowLogin())return json({error:'Trop de tentatives. Réessaie dans 15 minutes.'},429)
    if(!passwordMatches(data.email,data.password))return json({error:'Adresse e-mail ou mot de passe incorrect.'},401)
    return json({authenticated:true},200,{'Set-Cookie':sessionCookie(request)})
  }
  if(!authenticated(request))return json({error:'Connecte-toi pour modifier la liste.'},401)
  if(action==='logout')return json({authenticated:false},200,{'Set-Cookie':sessionCookie(request,true)})
  if(action==='catalog'&&request.method==='PUT') {
    const data=await body(request)
    const parsed=catalogSchema.safeParse(data)
    if(!parsed.success){const issue=parsed.error.issues[0];const message=issue?.code==='custom'?issue.message:issue?.path.includes('details')?'Limite les détails à trois phrases non vides.':issue?.path.includes('images')?'Vérifie les photos et leurs descriptions (12 maximum).':issue?.path.includes('links')?'Vérifie les liens HTTPS et leurs libellés.':'Vérifie les champs de l’article et les longueurs des textes.';return json({error:message},400)}
    if(typeof data.version!=='string')return json({error:'Recharge la liste avant d’enregistrer.'},400)
    const version=await writeBytes('catalog.json',Buffer.from(JSON.stringify(parsed.data)),data.version==='seed'?null:data.version)
    return json({...parsed.data,version})
  }
  if(action==='upload'&&request.method==='POST') {
    const data=await body(request)
    if(!data || typeof data.base64!=='string'||data.base64.length>4_000_000||!/^[A-Za-z0-9+/]*={0,2}$/.test(data.base64))return json({error:'Photo invalide ou trop volumineuse.'},400)
    const bytes=Buffer.from(data.base64,'base64'),format=imageType(bytes)
    if(!format||bytes.length>3_000_000||bytes.length<12)return json({error:'Choisis une photo JPEG, PNG ou WebP de moins de 3 Mo.'},400)
    const key=`${randomUUID()}.${format.ext}`;await writeBytes(`images/${key}`,bytes,null,format.type)
    return json({src:`/api/manage?action=image&key=${key}`})
  }
  return json({error:'Action introuvable.'},404)
 }catch(error) {
  if(error instanceof Conflict || (error as Error).name==='BlobPreconditionFailedError')return json({error:'La liste a changé dans un autre onglet. Recharge-la avant de recommencer.'},409)
  if(error instanceof SyntaxError)return json({error:'Les données reçues sont invalides.'},400)
  if((error as Error).message==='BODY_TOO_LARGE')return json({error:'Le fichier est trop volumineux.'},413)
  console.error('Wishlist API error:',(error as Error).name)
  return json({error:'L’enregistrement est indisponible. Réessaie dans un instant.'},503)
 }
}
