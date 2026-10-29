import type { Gift } from '@/data/wishlist'
export type Catalog={gifts:Gift[];categories:string[];version:string}
export async function api<T>(action:string,method='GET',data?:unknown):Promise<T> {
 const response=await fetch(`/api/manage?action=${action}`,{method,credentials:'same-origin',headers:data?{'Content-Type':'application/json'}:{},...(data?{body:JSON.stringify(data)}:{})})
 const result=await response.json()
 if(!response.ok)throw new Error(result.error||'La demande a échoué.')
 return result
}
export async function uploadPhoto(file:File):Promise<string> {
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Choisis une photo JPEG, PNG ou WebP.')
 if(file.size>20_000_000)throw new Error('La photo dépasse 20 Mo.')
 const image=await createImageBitmap(file)
 try {
  const scale=Math.min(1,1800/Math.max(image.width,image.height))
  const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale)
  const context=canvas.getContext('2d');if(!context)throw new Error('Impossible de préparer la photo.')
  context.drawImage(image,0,0,canvas.width,canvas.height)
  const data=canvas.toDataURL('image/webp',.88)
  const result=await api<{src:string}>('upload','POST',{base64:data.split(',')[1]})
  return result.src
 } finally {image.close()}
}
