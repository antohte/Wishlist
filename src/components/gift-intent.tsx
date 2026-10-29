import { CircleCheck, Gift as GiftIcon, Shuffle, Wallet } from 'lucide-react'
import type { Gift } from '@/data/wishlist'

export function GiftIntent({gift, compact = false}: {gift: Gift; compact?: boolean}) {
  const defaults = {
    exact: {title:'Cet article précis',description:'Je souhaite le modèle indiqué dans le lien d’achat.',icon:CircleCheck},
    choice: {title:'Au choix',description:'Plusieurs options me conviennent : à toi de choisir.',icon:Shuffle},
    inspiration: {title:'Une idée dans cet esprit',description:'La photo sert d’exemple ; un modèle similaire me convient.',icon:GiftIcon},
    contribution: {title:'Une participation',description:'Un coup de pouce, du montant de ton choix.',icon:Wallet},
  }
  const {icon:Icon,...fallback} = defaults[gift.kind]
  const {title,description} = gift.intent ?? fallback
  return <div className="gift-intent" data-kind={gift.kind}><Icon aria-hidden="true" size={20}/><div><p>{title}</p>{!compact && <span>{description}</span>}</div></div>
}
