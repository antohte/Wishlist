import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp,rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { scryptSync } from 'node:crypto'
import { handleRequest } from '../server/api.ts'

test('administration : connexion, droits, validation et stockage persistant',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'wishlist-admin-test-'))
 const original={...process.env}
 process.env.STORAGE_MODE='local';delete process.env.VERCEL;process.env.DATA_DIR=directory
 process.env.ADMIN_EMAIL='test@example.com';process.env.SESSION_SECRET='test-secret-that-is-at-least-thirty-two-characters'
 process.env.ADMIN_PASSWORD_HASH=`scrypt:test-salt:${scryptSync('test-password','test-salt',64).toString('hex')}`
 const request=(action:string,method='GET',data?:unknown,cookie?:string,origin='http://localhost')=>handleRequest(new Request(`http://localhost/api/manage?action=${action}`,{method,headers:{Origin:origin,...cookie?{Cookie:cookie}:{},'Content-Type':'application/json'},...data?{body:JSON.stringify(data)}:{}}))
 try{
  assert.equal((await request('catalog','PUT',{})).status,401)
  assert.equal((await request('login','POST',{email:'test@example.com',password:'wrong'})).status,401)
  assert.equal((await request('login','POST',{email:'test@example.com',password:'test-password'},undefined,'https://evil.test')).status,403)
  const login=await request('login','POST',{email:'test@example.com',password:'test-password'})
  assert.equal(login.status,200)
  const cookie=login.headers.get('set-cookie')!.split(';')[0]
  assert.match(login.headers.get('set-cookie')!,/HttpOnly/);assert.match(login.headers.get('set-cookie')!,/SameSite=Strict/)
  assert.equal((await (await request('session','GET',undefined,cookie)).json()).authenticated,true)
  assert.equal((await request('catalog','PUT',{},cookie+'tampered')).status,401)
  const initial=await (await request('catalog')).json()
  assert.equal(initial.gifts.length,13)
  const invalid=structuredClone(initial);invalid.gifts[0].links=[{label:'Bad',url:'javascript:alert(1)'}]
  assert.equal((await request('catalog','PUT',invalid,cookie)).status,400)
  const changed=structuredClone(initial);changed.gifts[0].name='Test persistant'
  const saved=await request('catalog','PUT',changed,cookie)
  assert.equal(saved.status,200)
  assert.equal((await (await request('catalog')).json()).gifts[0].name,'Test persistant')
  assert.equal((await request('catalog','PUT',initial,cookie)).status,409)
  assert.equal((await request('upload','POST',{base64:Buffer.from('<svg onload=alert(1)>').toString('base64')},cookie)).status,400)
  const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC1sAAAAASUVORK5CYII='
  const uploaded=await request('upload','POST',{base64:png},cookie)
  assert.equal(uploaded.status,200)
  const image=await handleRequest(new Request('http://localhost'+(await uploaded.json()).src))
  assert.equal(image.status,200);assert.equal(image.headers.get('content-type'),'image/png')
  assert.equal((await request('image&key=../../.env.local')).status,404)
  const current=await (await request('catalog')).json()
  const results=await Promise.all([request('catalog','PUT',{...current,categories:[...current.categories,'Test concurrent']},cookie),request('catalog','PUT',{...current,gifts:[]},cookie)])
  assert.deepEqual(results.map(r=>r.status).sort(),[200,409])
  for(let i=0;i<8;i++)await request('login','POST',{email:'test@example.com',password:'wrong'})
  assert.equal((await request('login','POST',{email:'test@example.com',password:'wrong'})).status,429)
  const logout=await request('logout','POST',{},cookie);assert.match(logout.headers.get('set-cookie')!,/Max-Age=0/)
 }finally{process.env=original;await rm(directory,{recursive:true,force:true})}
})
