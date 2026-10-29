import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { readBytes, writeBytes, Conflict } from './storage.ts'
const COOKIE='wishlist_admin'
export function authReady() {return !!(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH && process.env.SESSION_SECRET && process.env.SESSION_SECRET.length>=32)}
function sign(value:string) {return createHmac('sha256',process.env.SESSION_SECRET!).update(value).digest('base64url')}
function equal(a:string,b:string) {const aa=Buffer.from(a),bb=Buffer.from(b);return aa.length===bb.length && timingSafeEqual(aa,bb)}
export function passwordMatches(email:string,password:string) {
  const [scheme,salt,hash]=process.env.ADMIN_PASSWORD_HASH!.split(':')
  if(scheme!=='scrypt' || !salt || !hash) throw new Error('Invalid admin configuration')
  const result=scryptSync(password,salt,64).toString('hex')
  return equal(result,hash) && equal(email.trim().toLowerCase(),process.env.ADMIN_EMAIL!.toLowerCase())
}
export function authenticated(request:Request) {
  if(!authReady()) return false
  const raw=request.headers.get('cookie')?.split(';').map(c=>c.trim()).find(c=>c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length+1)
  if(!raw) return false
  try {
    const [value,signature]=raw.split('.')
    if(!value || !signature || !equal(sign(value),signature)) return false
    const session=JSON.parse(Buffer.from(value,'base64url').toString())
    return session.exp>Date.now() && session.email===process.env.ADMIN_EMAIL && equal(session.rev,sign(process.env.ADMIN_PASSWORD_HASH!))
  }catch{return false}
}
export function sessionCookie(request:Request,logout=false) {
  const secure=request.url.startsWith('https:') || !!process.env.VERCEL
  const value=Buffer.from(JSON.stringify({email:process.env.ADMIN_EMAIL,exp:Date.now()+8*60*60*1000,rev:sign(process.env.ADMIN_PASSWORD_HASH!),nonce:randomBytes(16).toString('hex')})).toString('base64url')
  return `${COOKIE}=${logout?'':`${value}.${sign(value)}`}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${logout?0:28800}${secure?'; Secure':''}`
}
// Persistent account-level rate limit, with conditional writes across serverless instances.
export async function allowLogin() {
  for(let i=0;i<8;i++) {
    const current=await readBytes('security/login.json');const now=Date.now()
    let record=current ? JSON.parse(current.bytes.toString()) : {start:now,count:0}
    if(now-record.start>15*60*1000) record={start:now,count:0}
    if(record.count>=10) return false
    record.count++
    try {await writeBytes('security/login.json',Buffer.from(JSON.stringify(record)),current?.version??null);return true}
    catch(error){if(!(error instanceof Conflict)) throw error}
  }
  return false
}
