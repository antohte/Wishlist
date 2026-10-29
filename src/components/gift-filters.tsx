import { ChevronDown, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { budgetOptions, type BudgetFilter } from '@/lib/prices'
function FilterMenu<T extends string>({value,onChange,items,label,icon}:{value:T;onChange:(value:T)=>void;items:Record<T,string>;label:string;icon:React.ReactNode}) {
  return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="type-filter" aria-label={`${label} : ${items[value]}`}>{icon}{items[value]}<ChevronDown/></Button></DropdownMenuTrigger>
    <DropdownMenuContent align="end"><DropdownMenuLabel>{label}</DropdownMenuLabel><DropdownMenuSeparator/><DropdownMenuRadioGroup value={value} onValueChange={value=>onChange(value as T)}>{Object.entries<string>(items).map(([value,text])=><DropdownMenuRadioItem key={value} value={value}>{text}</DropdownMenuRadioItem>)}</DropdownMenuRadioGroup></DropdownMenuContent>
  </DropdownMenu>
}
export function GiftFilters({budget,onBudget}: {budget:BudgetFilter;onBudget:(value:BudgetFilter)=>void}) {
  return <div className="filter-tools budget-filter-tools">
    <FilterMenu value={budget} onChange={onBudget} items={budgetOptions} label="Budget" icon={<Wallet/>}/>
  </div>
}
