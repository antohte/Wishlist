import { Footprints, Shirt, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export function Overview() {
  return <Card className="overview-card" aria-labelledby="overview-title"><CardContent>
    <div className="overview-heading"><h2 id="overview-title">Les détails qui comptent</h2><Info size={17} aria-hidden="true"/></div>
    <div className="sizes"><div><Footprints size={21} aria-hidden="true"/><p>Pointure<strong>46<span>EU</span></strong></p></div><Separator orientation="vertical"/><div><Shirt size={21} aria-hidden="true"/><p>Vêtements<strong>M</strong></p></div></div>
    <Separator className="overview-separator"/>
    <p className="overview-color-label">Mes couleurs, pour les vêtements</p>
    <div className="color-badges"><Badge><span style={{background:'#000'}}/>Noir</Badge><Badge><span style={{background:'#92969e'}}/>Gris</Badge><Badge><span style={{background:'#35496e'}}/>Bleu marine</Badge></div>
  </CardContent></Card>
}
