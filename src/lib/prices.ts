import type { Gift } from '@/data/wishlist'
export const budgetOptions = {
  all: 'Tous les budgets',
  '0-50': '0 à 50 €',
  '50-100': '50 à 100 €',
  '100-150': '100 à 150 €',
  '150-plus': 'Plus de 150 €',
} as const
export type BudgetFilter = keyof typeof budgetOptions
export function matchesBudget(gift: Gift, budget: BudgetFilter) {
  if (budget === 'all') return true
  if (gift.kind === 'contribution') return true
  if (!gift.price) return false
  if (gift.price.bands) return gift.price.bands.includes(budget)
  return gift.price.amounts.some(amount => {
    if (budget === '0-50') return amount >= 0 && amount <= 50
    if (budget === '50-100') return amount > 50 && amount <= 100
    if (budget === '100-150') return amount > 100 && amount <= 150
    return amount > 150
  })
}
export function giftPriceLabel(gift: Gift) {
  return gift.kind === 'contribution' ? 'Montant au choix' : gift.price?.label ?? 'Prix à préciser'
}
