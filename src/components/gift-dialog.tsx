import { useState } from 'react'
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { type Gift } from '@/data/wishlist'
import { GiftIntent } from './gift-intent'
import { GiftPrice } from './gift-price'

function GiftDetails({ gift }: { gift: Gift }) {
  const [photo, setPhoto] = useState(0)
  return <div className="gift-details">
    <div className={`detail-gallery detail-${gift.id}`}>
      {gift.images.length ? <img src={gift.images[photo].src} alt={gift.images[photo].alt}/> : <ImageIcon size={100} strokeWidth={1}/>}
      {gift.images.length > 1 && <div className="gallery-controls">
        <Button variant="outline" size="icon" aria-label="Photo précédente" onClick={() => setPhoto((photo - 1 + gift.images.length) % gift.images.length)}><ChevronLeft/></Button>
        <span aria-live="polite"><strong>{gift.images[photo].alt.replace(', modèle souhaité','')}</strong>{photo + 1} / {gift.images.length}</span>
        <Button variant="outline" size="icon" aria-label="Photo suivante" onClick={() => setPhoto((photo + 1) % gift.images.length)}><ChevronRight/></Button>
      </div>}
    </div>
    <div className="detail-copy">
      <GiftIntent gift={gift} compact/>
      <DialogHeader>
        <p className="gift-brand">{gift.brand}</p>
        <DialogTitle className="detail-title">{gift.name}</DialogTitle>
      </DialogHeader>
      <GiftPrice gift={gift}/>
      <Separator/>
      <DialogDescription asChild><ul className="detail-list">{gift.details.map(text => <li key={text}><Check size={16} aria-hidden="true"/><span>{text}</span></li>)}</ul></DialogDescription>
      <div className="detail-actions">
        {gift.links.map(link => <Button key={link.url} asChild><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight aria-hidden="true"/></a></Button>)}
      </div>
    </div>
  </div>
}
export function GiftDialog({ gift, onClose, onRestoreFocus }: { gift: Gift | null; onClose: () => void; onRestoreFocus: () => void }) {
  return <Dialog open={!!gift} onOpenChange={open => {if (!open) onClose()}}><DialogContent className="gift-modal" onOpenAutoFocus={event=>{event.preventDefault();requestAnimationFrame(()=>document.querySelector<HTMLElement>('[data-slot="dialog-close"]')?.focus())}} onCloseAutoFocus={event=>{event.preventDefault();onRestoreFocus()}}>{gift && <GiftDetails key={gift.id} gift={gift}/>}</DialogContent></Dialog>
}
