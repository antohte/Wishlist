import { get, put, BlobNotFoundError } from '@vercel/blob'
import { readFile, mkdir, rename, writeFile } from 'node:fs/promises'
import { createHash, randomUUID } from 'node:crypto'
import { join, dirname } from 'node:path'

export class Conflict extends Error {}
export function localStorage() { return process.env.STORAGE_MODE === 'local' && !process.env.VERCEL }
export function storageReady() { return localStorage() || !!process.env.BLOB_READ_WRITE_TOKEN }
const directory = () => process.env.DATA_DIR || join(process.cwd(), '.data')
function safeKey(key: string) { if (!/^[a-zA-Z0-9/_.-]+$/.test(key) || key.includes('..')) throw new Error('Invalid key'); return key }
let queue: Promise<unknown> = Promise.resolve()
export async function readBytes(key: string): Promise<{bytes:Buffer;version:string}|null> {
  safeKey(key)
  if (localStorage()) {
    try { const bytes=await readFile(join(directory(),key)); return {bytes,version:createHash('sha256').update(bytes).digest('hex')} }
    catch(error) { if ((error as NodeJS.ErrnoException).code==='ENOENT') return null; throw error }
  }
  try {
    const result=await get(`wishlist/${key}`,{access:'private',useCache:false})
    if(!result || result.statusCode!==200) return null
    return {bytes:Buffer.from(await new Response(result.stream).arrayBuffer()),version:result.blob.etag}
  } catch(error) { if(error instanceof BlobNotFoundError) return null; throw error }
}
export async function writeBytes(key:string,bytes:Buffer,expected?:string|null,contentType='application/json') {
  safeKey(key)
  if(!localStorage()) {
    try {
      const blob=await put(`wishlist/${key}`,bytes,{access:'private',addRandomSuffix:false,contentType,allowOverwrite:expected!==null, ...(expected ? {ifMatch:expected}:{}),cacheControlMaxAge:60})
      return blob.etag
    } catch(error) {
      if((error as Error).name==='BlobPreconditionFailedError' || /already exists/i.test((error as Error).message)) throw new Conflict()
      throw error
    }
  }
  const operation=queue.then(async()=>{
    const current=await readBytes(key)
    if(expected!==undefined && (current?.version??null)!==expected) throw new Conflict()
    const path=join(directory(),key);await mkdir(dirname(path),{recursive:true})
    const tmp=`${path}.${randomUUID()}.tmp`;await writeFile(tmp,bytes,{mode:0o600});await rename(tmp,path)
    return createHash('sha256').update(bytes).digest('hex')
  })
  queue=operation.catch(()=>{});return operation
}
