import { useState } from 'react'
import { ChevronLeft, ChevronRight, Images, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { type Gift } from '@/data/wishlist'
import { cn } from '@/lib/utils'
import { GiftIntent } from './gift-intent'
import { GiftPrice } from './gift-price'

export function GiftCard({ gift, featured, onOpen }: {gift: Gift; featured?: boolean; onOpen: (gift: Gift) => void}) {
  const [photo, setPhoto] = useState(0)
  return <Card className={cn('gift-card', featured && 'gift-card-featured', `gift-${gift.id}`)} id={gift.id}>
    <div className="gift-photo-region">
    <button className="gift-photo" onClick={() => onOpen(gift)} aria-label={`Découvrir ${gift.name}`}>
      {gift.images.length ? <img src={gift.images[photo].src} alt={gift.images[photo].alt} loading={featured || gift.id === 'casque' ? 'eager' : 'lazy'} decoding="async" /> : <div className="no-photo"><ImageIcon strokeWidth={1} /><span>Photo à venir</span></div>}
      {gift.images.length > 1 && <span className="photo-count" aria-live="polite"><Images size={14}/>Modèle {photo + 1} sur {gift.images.length}</span>}
    </button>
    {gift.images.length > 1 && <>
      <Button variant="outline" size="icon-lg" className="card-photo-arrow card-photo-previous" aria-label={`Photo précédente de ${gift.name}`} onClick={() => setPhoto(index => (index - 1 + gift.images.length) % gift.images.length)}><ChevronLeft/></Button>
      <Button variant="outline" size="icon-lg" className="card-photo-arrow card-photo-next" aria-label={`Photo suivante de ${gift.name}`} onClick={() => setPhoto(index => (index + 1) % gift.images.length)}><ChevronRight/></Button>
    </>}
    </div>
    <CardContent className="gift-content">
      <GiftIntent gift={gift}/>
      <p className="gift-brand">{gift.brand}</p>
      <h3><button onClick={() => onOpen(gift)}>{gift.name}</button></h3>
      <p className="gift-summary">{gift.summary}</p>
      <GiftPrice gift={gift}/>
    </CardContent>
    <CardFooter className="gift-footer">
      <span className="gift-meta">{gift.meta ?? gift.category}</span>
    </CardFooter>
  </Card>
}
