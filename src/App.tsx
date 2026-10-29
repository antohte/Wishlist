import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, Heart, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Toaster } from '@/components/ui/sonner'
import { GiftCard } from '@/components/gift-card'
import { GiftDialog } from '@/components/gift-dialog'
import { ShareDialog } from '@/components/share-dialog'
import { Overview } from '@/components/overview'
import { GiftFilters } from '@/components/gift-filters'
import { categories as initialCategories, gifts as initialGifts, type Gift } from '@/data/wishlist'
import { matchesBudget, type BudgetFilter } from '@/lib/prices'

const fromHash = (gifts:Gift[]) => gifts.find(gift => `#${gift.id}` === window.location.hash) ?? null

export default function App() {
  const [gifts,setGifts] = useState(initialGifts)
  const [categories,setCategories] = useState(initialCategories)
  const [category,setCategory] = useState('Tout')
  const [budget,setBudget] = useState<BudgetFilter>('all')
  const [selected,setSelected] = useState<Gift|null>(()=>fromHash(initialGifts))
  const lastFocused = useRef<HTMLElement|null>(null)
  useEffect(()=>{ const sync=()=>setSelected(fromHash(gifts)); window.addEventListener('hashchange',sync); window.addEventListener('popstate',sync); return ()=>{window.removeEventListener('hashchange',sync);window.removeEventListener('popstate',sync)} },[gifts])
  useEffect(()=>{const controller=new AbortController();void fetch('/api/manage?action=catalog',{signal:controller.signal}).then(response=>{if(!response.ok)throw new Error('Catalogue indisponible');return response.json()}).then(data=>{setGifts(data.gifts);setCategories(['Tout',...data.categories]);setSelected(fromHash(data.gifts))}).catch(()=>{});return()=>controller.abort()},[])
  const visible = useMemo(()=>gifts.filter(gift=>(category==='Tout'||gift.category===category)&&matchesBudget(gift,budget)),[category,budget,gifts])
  function openGift(gift:Gift) {
    lastFocused.current = document.activeElement as HTMLElement
    setSelected(gift)
    window.history.replaceState(null,'',`#${gift.id}`)
  }
  function closeGift() {
    setSelected(null)
    window.history.replaceState(null,'',`${window.location.pathname}${window.location.search}`)
  }
  return <TooltipProvider delayDuration={250}>
    <a className="skip-link" href="#selection">Aller aux idées cadeaux</a>
    <header className="site-header"><div className="page-width header-inner">
      <ShareDialog/>
    </div></header>
    <main id="top" className="page-width">
      <section className="intro" aria-labelledby="page-title"><div className="intro-copy">
        <h1 id="page-title">Ma liste<br/>d’envies.</h1>
        <p>Quelques idées pour les prochaines occasions. Les modèles que j’aime, mes inspirations et les détails pour choisir.</p>
        <Button asChild variant="link" className="explore-link"><a href="#selection">Découvrir les idées<ArrowDown/></a></Button>
      </div><Overview/></section>
      <section id="selection" className="selection-section" aria-labelledby="selection-title">
        <div className="section-heading"><div><h2 id="selection-title">La sélection</h2><p>Un objet te plaît ? Ouvre sa fiche pour tous les détails.</p></div><span className="total-count">{gifts.length} idées à explorer</span></div>
        <Tabs value={category} onValueChange={setCategory} className="gift-tabs">
          <div className="filters-row"><TabsList aria-label="Catégories de cadeaux" className="category-tabs" variant="line">{categories.map(name=><TabsTrigger key={name} value={name}>{name}</TabsTrigger>)}</TabsList></div>
          <div className="results-tools"><p className="results-count" role="status">{visible.length} {visible.length===1?'idée':'idées'}{category !== 'Tout' ? ` dans « ${category} »` : ''}</p><GiftFilters budget={budget} onBudget={setBudget}/></div>
          <TabsContent value={category} className="selection-content">
            {visible.length ? <div className={`gift-grid ${category==='Tout'&&budget==='all'?'gift-grid-curated':''}`}>{visible.map(gift=><GiftCard key={gift.id} gift={gift} featured={gift.id==='cloudtilt'&&category==='Tout'&&budget==='all'} onOpen={openGift}/>)}</div> : <div className="empty-state"><SearchX size={30}/><h3>Aucune idée avec ces filtres</h3><p>Choisis un autre budget ou retrouve la liste complète.</p><Button variant="outline" onClick={()=>{setBudget('all');setCategory('Tout')}}>Voir toutes les idées</Button></div>}
          </TabsContent>
        </Tabs>
      </section>
      <section className="info-section" id="infos" aria-labelledby="info-title"><div><Badge variant="secondary">Bon à savoir</Badge><h2 id="info-title">Les petits détails<br/>avant de choisir.</h2><p>Et si tu hésites, tu peux toujours m’en parler.</p></div><Accordion type="single" collapsible className="info-accordion">
        <AccordionItem value="tailles"><AccordionTrigger>Quelles tailles et quelles couleurs ?</AccordionTrigger><AccordionContent>Je fais du 46 en chaussures et du M en vêtements. Pour un sweat ou une veste, j’aime le noir, le bleu marine et le gris. Les modèles et coupes peuvent varier selon la marque.</AccordionContent></AccordionItem>
        <AccordionItem value="doublons"><AccordionTrigger>Comment éviter de choisir le même cadeau ?</AccordionTrigger><AccordionContent>Vois avec ma mère avant de choisir : c’est elle qui gère mes cadeaux et qui pourra te dire ce qui est déjà prévu.</AccordionContent></AccordionItem>
      </Accordion></section>
    </main>
    <footer className="site-footer"><div className="page-width footer-inner"><div><Heart size={21} strokeWidth={1.5}/><p>Merci d’y penser.</p></div><span>La liste d’Antonin</span><Button asChild variant="ghost"><a href="#top">Retour en haut<ArrowDown className="rotate-180"/></a></Button></div></footer>
    <GiftDialog gift={selected} onClose={closeGift} onRestoreFocus={()=>{(lastFocused.current ?? document.getElementById('selection'))?.focus()}}/>
    <Toaster position="bottom-center" closeButton toastOptions={{className:'wishlist-toast',closeButtonAriaLabel:'Fermer la notification'}}/>
  </TooltipProvider>
}
