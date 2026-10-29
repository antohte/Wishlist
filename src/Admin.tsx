import { useEffect,useState,type FormEvent } from 'react'
import { ArrowDown,ArrowUp,ArrowUpRight,LoaderCircle,LogOut,Pencil,Plus,Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card,CardContent } from '@/components/ui/card'
import { Alert,AlertDescription } from '@/components/ui/alert'
import { Tabs,TabsContent,TabsList,TabsTrigger } from '@/components/ui/tabs'
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from '@/components/ui/dialog'
import { AdminEditor } from '@/components/admin-editor'
import { api,type Catalog } from '@/lib/admin-api'
import type { Gift } from '@/data/wishlist'
import { giftPriceLabel } from '@/lib/prices'
import './admin.css'

function CategoryRow({name,count,onRename,onDelete,busy}:{name:string;count:number;onRename:(name:string)=>void;onDelete:()=>void;busy:boolean}) {
 const [value,setValue]=useState(name)
 return <div className="admin-category-row"><Input aria-label={`Nom de la catégorie ${name}`} maxLength={70} value={value} onChange={e=>setValue(e.target.value)}/><span>{count} article{count>1?'s':''}</span><Button variant="outline" disabled={busy||!value.trim()||value.trim()===name} onClick={()=>onRename(value.trim())}>Renommer</Button><Button size="icon" variant="ghost" disabled={busy||count>0} aria-label={`Supprimer la catégorie ${name}`} title={count?'Déplace les articles avant de supprimer la catégorie.':undefined} onClick={onDelete}><Trash2/></Button></div>
}
export default function Admin() {
 const [authenticated,setAuthenticated]=useState(false),[loading,setLoading]=useState(true),[catalog,setCatalog]=useState<Catalog|null>(null)
 const [email,setEmail]=useState('antonin.hotte@gmail.com'),[password,setPassword]=useState(''),[error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false)
 const [editing,setEditing]=useState<Gift|null>(null),[remove,setRemove]=useState<Gift|null>(null),[newCategory,setNewCategory]=useState('')
 async function load() {setError('');const state=await api<{authenticated:boolean}>('session');setAuthenticated(state.authenticated);if(state.authenticated)setCatalog(await api<Catalog>('catalog'))}
 useEffect(()=>{void load().catch(err=>setError(err.message)).finally(()=>setLoading(false))},[])
 async function login(event:FormEvent) {
  event.preventDefault();setBusy(true);setError('')
  try{await api('login','POST',{email,password});setPassword('');await load()}catch(err){setError((err as Error).message)}finally{setBusy(false)}
 }
 async function persist(next:Catalog) {
  const saved=await api<Catalog>('catalog','PUT',next);setCatalog(saved);setNotice('La liste est enregistrée et publiée.');return saved
 }
 async function operation(action:()=>Promise<unknown>) {setBusy(true);setError('');setNotice('');try{await action()}catch(err){setError((err as Error).message)}finally{setBusy(false)}}
 async function saveGift(gift:Gift) {
  if(!catalog)return
  const exists=catalog.gifts.some(item=>item.id===gift.id)
  const next={...catalog,gifts:exists?catalog.gifts.map(item=>item.id===gift.id?gift:item):[...catalog.gifts,gift],categories:catalog.categories.includes(gift.category)?catalog.categories:[...catalog.categories,gift.category]}
  await persist(next);setEditing(null)
 }
 function moveGift(index:number,direction:number) {
  if(!catalog)return;const items=[...catalog.gifts];[items[index],items[index+direction]]=[items[index+direction],items[index]]
  void operation(()=>persist({...catalog,gifts:items}))
 }
 function createGift(){if(!catalog)return;setError('');setNotice('');setEditing({id:`article-${crypto.randomUUID()}`,name:'',brand:'',category:catalog.categories[0]??'Autres idées',kind:'inspiration',summary:'',details:[''],images:[],links:[]})}
 if(loading)return <main className="admin-loading"><LoaderCircle className="animate-spin"/><p>Chargement de l’administration…</p></main>
 return <div className="admin-app"><header className="admin-header"><div><a href="/admin">Ma wishlist <span>Administration</span></a><div><Button variant="outline" asChild><a href="/" target="_blank" rel="noopener noreferrer">Voir la liste<ArrowUpRight/></a></Button>{authenticated&&<Button variant="ghost" onClick={()=>void operation(async()=>{await api('logout','POST');setAuthenticated(false);setCatalog(null);setEditing(null)})}><LogOut/><span>Déconnexion</span></Button>}</div></div></header>
 {!authenticated?<main className="admin-login"><Card><CardContent><h1>Gérer ma liste</h1><p>Connecte-toi pour ajouter et modifier tes idées cadeaux.</p>{error&&<Alert variant="destructive" role="alert"><AlertDescription>{error}</AlertDescription></Alert>}<form onSubmit={login}><div className="admin-field"><Label htmlFor="admin-email">Adresse e-mail</Label><Input id="admin-email" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></div><div className="admin-field"><Label htmlFor="admin-password">Mot de passe</Label><Input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></div><Button type="submit" disabled={busy}>{busy?<LoaderCircle className="animate-spin"/>:null}{busy?'Connexion…':'Se connecter'}</Button></form></CardContent></Card></main>:
 <main className="admin-main">{error&&<Alert variant="destructive" role="alert"><AlertDescription>{error} <Button variant="link" onClick={()=>void operation(load)}>Recharger la liste</Button></AlertDescription></Alert>}{notice&&!editing&&<Alert role="status"><AlertDescription>{notice}</AlertDescription></Alert>}
 {catalog&&(editing?<AdminEditor key={editing.id} initial={editing} categories={catalog.categories} onSave={saveGift} onCancel={()=>setEditing(null)}/>:<>
 <div className="admin-page-heading"><div><h1>Mes idées cadeaux</h1><p>Ajoute des articles, choisis leurs photos et garde ta liste à jour.</p></div><Button onClick={createGift} disabled={busy}><Plus/>Ajouter un article</Button></div>
 <div className="admin-overview"><Card><CardContent><span>Articles</span><strong>{catalog.gifts.length}</strong></CardContent></Card><Card><CardContent><span>Photos</span><strong>{catalog.gifts.reduce((sum,item)=>sum+item.images.length,0)}</strong></CardContent></Card><Card><CardContent><span>Catégories</span><strong>{catalog.categories.length}</strong></CardContent></Card></div>
 <Tabs defaultValue="articles"><TabsList><TabsTrigger value="articles">Articles</TabsTrigger><TabsTrigger value="categories">Catégories</TabsTrigger></TabsList><TabsContent value="articles"><div className="admin-articles">{catalog.gifts.map((gift,index)=><Card key={gift.id}><CardContent className="admin-article-row">{gift.images[0]?<img src={gift.images[0].src} alt=""/>:<div className="admin-thumb-empty"/>}<div className="admin-article-name"><h2>{gift.name}</h2><p>{gift.category}</p><span>{giftPriceLabel(gift)}</span></div><div className="admin-article-actions"><Button variant="outline" disabled={busy} onClick={()=>{setEditing(gift);setNotice('');setError('')}}><Pencil/>Modifier</Button><Button size="icon" variant="ghost" aria-label={`Remonter ${gift.name}`} disabled={busy||index===0} onClick={()=>moveGift(index,-1)}><ArrowUp/></Button><Button size="icon" variant="ghost" aria-label={`Descendre ${gift.name}`} disabled={busy||index===catalog.gifts.length-1} onClick={()=>moveGift(index,1)}><ArrowDown/></Button><Button variant="ghost" size="icon" aria-label={`Supprimer ${gift.name}`} disabled={busy} onClick={()=>setRemove(gift)}><Trash2/></Button></div></CardContent></Card>)}</div>{catalog.gifts.length===0&&<Card><CardContent className="admin-empty"><p>Ta liste est vide. Ajoute ta première idée.</p><Button onClick={createGift}><Plus/>Ajouter un article</Button></CardContent></Card>}</TabsContent>
 <TabsContent value="categories"><Card><CardContent className="admin-form-section"><h2>Les catégories</h2><p>Renommer une catégorie met à jour les articles qui en font partie.</p>{catalog.categories.map(name=><CategoryRow key={name} name={name} count={catalog.gifts.filter(g=>g.category===name).length} busy={busy} onRename={value=>{
  void operation(async()=>{
    if(catalog.categories.includes(value)||value==='Tout')throw new Error('Ce nom de catégorie est déjà utilisé.')
    await persist({...catalog,categories:catalog.categories.map(c=>c===name?value:c),gifts:catalog.gifts.map(g=>g.category===name?{...g,category:value}:g)})
  })
}} onDelete={()=>{void operation(()=>persist({...catalog,categories:catalog.categories.filter(c=>c!==name)}))}}/>)}<form className="admin-add-category" onSubmit={event=>{event.preventDefault();void operation(async()=>{const name=newCategory.trim();if(!name||name==='Tout'||catalog.categories.includes(name))throw new Error('Choisis un autre nom de catégorie.');await persist({...catalog,categories:[...catalog.categories,name]});setNewCategory('')})}}><Input aria-label="Nouvelle catégorie" maxLength={70} placeholder="Nouvelle catégorie" required value={newCategory} onChange={e=>setNewCategory(e.target.value)}/><Button disabled={busy}><Plus/>Ajouter</Button></form></CardContent></Card></TabsContent></Tabs>
 </>)}
 </main>}
 <Dialog open={!!remove} onOpenChange={open=>{if(!open&&!busy)setRemove(null)}}><DialogContent><DialogHeader><DialogTitle>Supprimer cet article ?</DialogTitle><DialogDescription>« {remove?.name} » sera retiré de ta liste.</DialogDescription></DialogHeader><div className="admin-dialog-actions"><Button variant="outline" disabled={busy} onClick={()=>setRemove(null)}>Annuler</Button><Button variant="destructive" disabled={busy} onClick={()=>void operation(async()=>{if(catalog&&remove){await persist({...catalog,gifts:catalog.gifts.filter(g=>g.id!==remove.id)});setRemove(null)}})}>{busy?'Suppression…':'Supprimer l’article'}</Button></div></DialogContent></Dialog>
 </div>
}
