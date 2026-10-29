import test from 'node:test'
import assert from 'node:assert/strict'
import { matchesBudget, type BudgetFilter } from '../src/lib/prices.ts'
import { gifts, type Gift } from '../src/data/wishlist.ts'

const gift = (id: string) => gifts.find(g => g.id === id)!
const priced = (amount: number): Gift => ({ ...gift('casque'), price: {amounts:[amount],label:'Test',note:'',source:''} })

test('les prix limites n’apparaissent que dans une tranche', () => {
  for (const [amount, expected] of [[0,'0-50'],[50,'0-50'],[50.01,'50-100'],[100,'50-100'],[100.01,'100-150'],[150,'100-150'],[150.01,'150-plus']] as const) {
    const matching = (['0-50','50-100','100-150','150-plus'] as BudgetFilter[]).filter(budget=>matchesBudget(priced(amount),budget))
    assert.deepEqual(matching,[expected])
  }
})
test('un cadeau disponible à plusieurs prix apparaît dans chaque budget correspondant', () => {
  assert.equal(matchesBudget(gift('parfum'),'50-100'),true)
  assert.equal(matchesBudget(gift('parfum'),'100-150'),true)
  assert.equal(matchesBudget(gift('parfum'),'0-50'),false)
})
test('les budgets précisés par Antonin sont respectés', () => {
  for (const id of ['sac','station','cadres']) {
    assert.equal(matchesBudget(gift(id),'0-50'),true)
    assert.equal(matchesBudget(gift(id),'50-100'),false)
  }
  assert.equal(matchesBudget(gift('chaise'),'50-100'),true)
  assert.equal(matchesBudget(gift('vetements'),'150-plus'),true)
  assert.equal(matchesBudget(gift('vetements'),'100-150'),false)
})
test('les participations à montant libre conviennent à chaque budget', () => {
  for (const id of ['telephone','zara']) for (const budget of ['all','0-50','50-100','100-150','150-plus'] as BudgetFilter[]) {
    assert.equal(matchesBudget(gift(id),budget),true)
  }
})
