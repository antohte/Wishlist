import { giftPriceLabel } from '@/lib/prices'
import type { Gift } from '@/data/wishlist'

export function GiftPrice({gift}: {gift: Gift}) {
  return <div className="gift-price"><span>{giftPriceLabel(gift)}</span></div>
}
