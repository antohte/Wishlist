import { useState } from 'react'
import { Check, Copy, Mail, Share2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { copyText, listUrl } from '@/lib/share'

export function ShareDialog() {
  const [copied, setCopied] = useState(false)
  const url = listUrl()
  const email = `mailto:?subject=${encodeURIComponent('Quelques idées cadeaux pour Antonin')}&body=${encodeURIComponent(`Voici ma liste d’envies, avec les photos, les tailles et les liens utiles :\n\n${url}\n\nÀ bientôt !\nAntonin`)}`
  return <Dialog onOpenChange={() => setCopied(false)}><DialogTrigger asChild><Button variant="outline" className="share-trigger"><Share2/><span>Partager la liste</span></Button></DialogTrigger>
    <DialogContent className="share-dialog"><DialogHeader><DialogTitle>Une liste, un lien.</DialogTitle><DialogDescription>À envoyer aux personnes avec qui tu veux partager ces idées.</DialogDescription></DialogHeader>
      <label htmlFor="share-url" className="text-sm font-bold">Le lien de la liste</label>
      <div className="copy-row"><Input id="share-url" value={url} readOnly onFocus={event => event.target.select()}/><Button size="icon" aria-label="Copier le lien de la liste" onClick={async () => { if (await copyText(url)) {setCopied(true); toast.success('Le lien est copié.')} else toast.error('Sélectionne le lien ci-dessus pour le copier.') }}>{copied ? <Check/> : <Copy/>}</Button></div>
      <Button asChild variant="secondary"><a href={email}><Mail/>Préparer un e-mail</a></Button>
      {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && <p className="local-note">Tu consultes un aperçu local. Le lien sera partageable une fois le site mis en ligne.</p>}
    </DialogContent>
  </Dialog>
}
