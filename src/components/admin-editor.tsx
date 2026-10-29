import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ImagePlus, LoaderCircle, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from '@/components/ui/select'
import { Alert,AlertDescription } from '@/components/ui/alert'
import { Card,CardContent } from '@/components/ui/card'
import { Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle } from '@/components/ui/dialog'
import { budgetOptions } from '@/lib/prices'
import { uploadPhoto } from '@/lib/admin-api'
import type { Gift,GiftKind } from '@/data/wishlist'

const kinds={exact:'Article précis',choice:'Au choix parmi plusieurs modèles',inspiration:'Photo d’inspiration',contribution:'Participation ou carte cadeau'}
const euro=(value:number)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(value)
function Field({label,children,hint}:{label:string;children:ReactNode;hint?:string}) {return <div className="admin-field"><Label>{label}</Label>{children}{hint&&<p>{hint}</p>}</div>}
function Choice({value,onChange,items,label}:{value:string;onChange:(value:string)=>void;items:Record<string,string>;label:string}) {return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label}><SelectValue/></SelectTrigger><SelectContent>{Object.entries(items).map(([value,text])=><SelectItem key={value} value={value}>{text}</SelectItem>)}</SelectContent></Select>}

export function AdminEditor({initial,categories,onSave,onCancel}:{initial:Gift;categories:string[];onSave:(gift:Gift)=>Promise<void>;onCancel:()=>void}) {
 const [gift,setGift]=useState<Gift>(structuredClone(initial))
 const [priceMode,setPriceMode]=useState(initial.price?.bands?.length?'band':initial.price?.amounts.length?'amount':'none')
 const [band,setBand]=useState(initial.price?.bands?.[0]??'0-50')
 const [amount,setAmount]=useState(initial.price?.amounts.join(' ; ')??'')
 const [priceLabel,setPriceLabel]=useState(initial.price?.label??'')
 const [error,setError]=useState(''),[saving,setSaving]=useState(false),[uploading,setUploading]=useState(false),[confirmDelete,setConfirmDelete]=useState(false)
 const set=<K extends keyof Gift>(key:K,value:Gift[K])=>setGift(current=>({...current,[key]:value}))
 function moveImage(index:number,direction:number) {const images=[...gift.images];[images[index],images[index+direction]]=[images[index+direction],images[index]];set('images',images)}
 async function submit(event:FormEvent) {
  event.preventDefault();setError('');setSaving(true)
  try {
   const result={...gift,category:gift.category.trim(),name:gift.name.trim()}
   if(priceMode==='none')delete result.price
   else if(priceMode==='band')result.price={amounts:[],bands:[band as '0-50'],label:priceLabel.trim()||`Budget : ${budgetOptions[band as keyof typeof budgetOptions]}`,note:'Budget indicatif renseigné par Antonin.',source:'Antonin'}
   else {
    const amounts=amount.split(';').map(value=>Number(value.trim().replace(',','.')))
    if(!amount.trim()||amounts.some(value=>!Number.isFinite(value)||value<0))throw new Error('Saisis un prix valide. Pour plusieurs prix, sépare-les par un point-virgule.')
    result.price={amounts,label:priceLabel.trim()||(amounts.length===1?euro(amounts[0]):`${euro(Math.min(...amounts))} à ${euro(Math.max(...amounts))}`),note:'Prix indicatif renseigné par Antonin, hors livraison.',source:'Antonin'}
   }
   result.details=result.details.map(text=>text.trim()).filter(Boolean)
   result.links=result.links.filter(link=>link.label.trim()||link.url.trim())
   if(!result.intent?.title.trim())delete result.intent
   await onSave(result)
  }catch(err){setError((err as Error).message)}finally{setSaving(false)}
 }
 return <form className="admin-editor" onSubmit={submit}>
  <div className="admin-editor-heading"><div><h2>{initial.name?'Modifier l’article':'Nouvel article'}</h2><p>Les modifications sont publiées quand tu enregistres.</p></div><Button type="button" variant="outline" onClick={()=>setConfirmDelete(true)}>Fermer</Button></div>
  {error&&<Alert variant="destructive" role="alert"><AlertDescription>{error}</AlertDescription></Alert>}
  <Card><CardContent className="admin-form-section"><h3>L’article</h3><div className="admin-columns">
   <Field label="Nom"><Input aria-label="Nom de l’article" required maxLength={140} value={gift.name} onChange={e=>set('name',e.target.value)}/></Field>
   <Field label="Marque ou sous-titre"><Input aria-label="Marque ou sous-titre" maxLength={150} value={gift.brand} onChange={e=>set('brand',e.target.value)}/></Field>
   <Field label="Catégorie" hint="Choisis une catégorie existante ou saisis-en une nouvelle."><Input aria-label="Catégorie" required list="admin-categories" maxLength={70} value={gift.category} onChange={e=>set('category',e.target.value)}/><datalist id="admin-categories">{categories.map(category=><option key={category} value={category}/>)}</datalist></Field>
   <Field label="Type de cadeau"><Choice label="Type de cadeau" value={gift.kind} onChange={value=>set('kind',value as GiftKind)} items={kinds}/></Field>
  </div>
  <Field label="Résumé sur la carte"><Textarea aria-label="Résumé sur la carte" maxLength={700} rows={2} value={gift.summary} onChange={e=>set('summary',e.target.value)}/></Field>
  <Field label="Précision courte" hint="Par exemple : taille M, pointure 46 ou d’occasion."><Input aria-label="Précision courte" maxLength={100} value={gift.meta??''} onChange={e=>set('meta',e.target.value)}/></Field>
  <Field label="Détails dans la fiche" hint="Une phrase par ligne, trois maximum."><Textarea aria-label="Détails dans la fiche" required rows={4} value={gift.details.join('\n')} onChange={e=>set('details',e.target.value.split('\n'))}/></Field>
  <details className="admin-advanced"><summary>Personnaliser le message du type de cadeau</summary><div className="admin-field"><Input aria-label="Titre du type de cadeau" placeholder="Ex. Un de ces 3 modèles" maxLength={100} value={gift.intent?.title??''} onChange={e=>set('intent',{title:e.target.value,description:gift.intent?.description??''})}/><Textarea aria-label="Explication du type de cadeau" placeholder="Ex. Les trois me plaisent autant." maxLength={250} value={gift.intent?.description??''} onChange={e=>set('intent',{title:gift.intent?.title??'',description:e.target.value})}/></div></details>
  </CardContent></Card>
  <Card><CardContent className="admin-form-section"><h3>Le prix</h3><div className="admin-columns">
   <Field label="Comment indiquer le prix ?"><Choice label="Format du prix" value={priceMode} onChange={value=>{setPriceMode(value);setPriceLabel('')}} items={{band:'Catégorie de prix',amount:'Prix précis ou plusieurs prix',none:'Pas de prix / montant libre'}}/></Field>
   {priceMode==='band'&&<Field label="Budget"><Choice label="Budget de l’article" value={band} onChange={value=>{setBand(value as '0-50');setPriceLabel('')}} items={Object.fromEntries(Object.entries(budgetOptions).filter(([key])=>key!=='all'))}/></Field>}
   {priceMode==='amount'&&<Field label="Prix en euros" hint="Exemple : 49,90 ou 85,60 ; 117,60."><Input aria-label="Prix en euros" required value={amount} onChange={e=>{setAmount(e.target.value);setPriceLabel('')}}/></Field>}
  </div>{priceMode!=='none'&&<Field label="Libellé du prix (facultatif)" hint="Laisse vide pour un libellé automatique."><Input aria-label="Libellé du prix" maxLength={150} value={priceLabel} onChange={e=>setPriceLabel(e.target.value)} placeholder="Ex. Environ 50 €"/></Field>}
  </CardContent></Card>
  <Card><CardContent className="admin-form-section"><div className="admin-section-heading"><div><h3>Les photos</h3><p>La première est la couverture. Jusqu’à 12 photos.</p></div><Label className="admin-upload"><ImagePlus size={17}/>{uploading?'Import en cours…':'Ajouter des photos'}<input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading||saving||gift.images.length>=12} onChange={async event=>{
   const files=Array.from(event.target.files??[]);event.target.value='';if(!files.length)return
   if(files.length+gift.images.length>12){setError('Tu peux ajouter 12 photos maximum.');return}
   setUploading(true);setError('');let images=[...gift.images]
   try{for(const file of files){const src=await uploadPhoto(file);images=[...images,{src,alt:gift.name||'Photo de l’article'}];set('images',images)}}catch(err){setError((err as Error).message)}finally{setUploading(false)}
  }}/></Label></div>
  {gift.images.length===0&&<p className="admin-empty-photos">Aucune photo pour le moment.</p>}
  <div className="admin-photo-grid">{gift.images.map((image,index)=><div key={image.src} className="admin-photo-item"><img src={image.src} alt={image.alt}/><span>{index===0?'Couverture':`Photo ${index+1}`}</span><Input aria-label={`Description de la photo ${index+1}`} value={image.alt} maxLength={200} onChange={e=>set('images',gift.images.map((item,i)=>i===index?{...item,alt:e.target.value}:item))}/><div><Button type="button" size="icon-sm" variant="outline" disabled={index===0||uploading} aria-label={`Avancer la photo ${index+1}`} onClick={()=>moveImage(index,-1)}><ArrowUp/></Button><Button type="button" size="icon-sm" variant="outline" disabled={index===gift.images.length-1||uploading} aria-label={`Reculer la photo ${index+1}`} onClick={()=>moveImage(index,1)}><ArrowDown/></Button><Button type="button" size="icon-sm" variant="ghost" disabled={uploading} aria-label={`Retirer la photo ${index+1}`} onClick={()=>set('images',gift.images.filter((_,i)=>i!==index))}><Trash2/></Button></div></div>)}</div>
  </CardContent></Card>
  <Card><CardContent className="admin-form-section"><h3>Les liens</h3>{gift.links.map((link,index)=><div key={index} className="admin-link-row"><Field label={`Bouton ${index+1}`}><Input aria-label={`Libellé du lien ${index+1}`} required maxLength={100} placeholder="Voir chez…" value={link.label} onChange={e=>set('links',gift.links.map((item,i)=>i===index?{...item,label:e.target.value}:item))}/></Field><Field label="Adresse HTTPS"><Input aria-label={`Adresse du lien ${index+1}`} required type="url" placeholder="https://…" value={link.url} onChange={e=>set('links',gift.links.map((item,i)=>i===index?{...item,url:e.target.value}:item))}/></Field><Button type="button" variant="ghost" size="icon" aria-label={`Retirer le lien ${index+1}`} onClick={()=>set('links',gift.links.filter((_,i)=>i!==index))}><Trash2/></Button></div>)}<Button type="button" variant="outline" disabled={gift.links.length>=8} onClick={()=>set('links',[...gift.links,{label:'',url:''}])}><Plus/>Ajouter un lien</Button></CardContent></Card>
  <div className="admin-save-bar"><Button type="button" variant="outline" onClick={()=>setConfirmDelete(true)}>Annuler les modifications</Button><Button type="submit" disabled={saving||uploading}>{saving?<LoaderCircle className="animate-spin"/>:null}{saving?'Enregistrement…':'Enregistrer et publier'}</Button></div>
  <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}><DialogContent><DialogHeader><DialogTitle>Abandonner les modifications ?</DialogTitle><DialogDescription>Les modifications de cette fiche ne seront pas enregistrées.</DialogDescription></DialogHeader><div className="admin-dialog-actions"><Button type="button" variant="outline" onClick={()=>setConfirmDelete(false)}>Continuer l’édition</Button><Button type="button" onClick={onCancel}>Abandonner</Button></div></DialogContent></Dialog>
 </form>
}
