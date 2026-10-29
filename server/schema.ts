import { z } from 'zod'
const text=(max:number)=>z.string().trim().max(max)
const link=z.string().url().max(2000).refine(value=>new URL(value).protocol==='https:','Le lien doit commencer par https://')
const imagePath=z.string().max(400).refine(value=>/^\/assets\/[a-zA-Z0-9/_.-]+$/.test(value) || /^\/api\/manage\?action=image&key=[a-f0-9-]+\.(jpg|png|webp)$/.test(value),'Photo non valide')
export const giftSchema=z.object({
 id:z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}$/),name:text(140).min(1),brand:text(150),category:text(70).min(1),kind:z.enum(['exact','choice','inspiration','contribution']),
 summary:text(700),details:z.array(text(700).min(1)).min(1).max(3),meta:text(100).optional(),photoNote:text(700).optional(),
 images:z.array(z.object({src:imagePath,alt:text(200).min(1)})).max(12),
 links:z.array(z.object({label:text(100).min(1),url:link})).max(8),
 intent:z.object({title:text(100).min(1),description:text(250)}).optional(),
 price:z.object({amounts:z.array(z.number().finite().min(0).max(100000)).max(20),bands:z.array(z.enum(['0-50','50-100','100-150','150-plus'])).max(4).optional(),label:text(150).min(1),note:text(500),source:text(2000)}).optional(),
})
export const catalogSchema=z.object({gifts:z.array(giftSchema).max(250),categories:z.array(text(70).min(1)).max(30)}).superRefine((value,ctx)=>{
 if(new Set(value.gifts.map(g=>g.id)).size!==value.gifts.length)ctx.addIssue({code:'custom',message:'Les identifiants des articles doivent être uniques.'})
 if(new Set(value.categories).size!==value.categories.length || value.categories.includes('Tout'))ctx.addIssue({code:'custom',message:'Vérifie les catégories.'})
 for(const gift of value.gifts)if(!value.categories.includes(gift.category))ctx.addIssue({code:'custom',message:'Chaque article doit appartenir à une catégorie existante.'})
})
