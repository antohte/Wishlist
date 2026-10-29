export type GiftKind = 'exact' | 'choice' | 'inspiration' | 'contribution'
export type Gift = {
  id: string; name: string; brand: string; category: string; kind: GiftKind;
  summary: string; details: string[]; images: {src: string; alt: string}[];
  links: {label: string; url: string}[]; photoNote?: string; meta?: string;
  intent?: {title: string; description: string};
  price?: {amounts: number[]; bands?: ('0-50' | '50-100' | '100-150' | '150-plus')[]; label: string; note: string; source: string};
}
const photo = (file: string, alt: string) => ({src: `/assets/${file}.webp`, alt})
export const categories = ['Tout', 'Vêtements', 'Tech', 'Sport & détente', 'Soin', 'Maison', 'Petites attentions']
export const gifts: Gift[] = [
  {
    id: 'cloudtilt', name: 'Cloudtilt', brand: 'On', category: 'Vêtements', kind: 'exact',
    price: {amounts:[170],label:'Environ 170 €',note:'Repère pour les Cloudtilt chez JD Sports le 29 octobre 2026. Vérifier le prix du coloris et de la pointure, hors livraison.',source:'https://www.jdsports.fr/campaign/jd-exclusive/marque/on-running/p/baskets/'},
    summary: 'La paire en blanc, gris et noir de la photo. Pointure 46.', meta: 'Pointure 46',
    details: ['Modèle On Cloudtilt, coloris de la photo.', 'Pointure européenne : 46.', 'Le lien correspond à la référence repérée chez JD Sports. Vérifier la taille et le coloris avant de commander.'],
    images: [photo('IMG_0123','Basket On Cloudtilt blanche et grise avec des détails noirs')],
    links: [{label: 'Voir chez JD Sports', url: 'https://www.jdsports.fr/product/blanc-on-running-cloudtilt/19615454_jdsportsfr/'}],
  },
  {
    id: 'casque', name: 'DT 770 PRO', brand: 'Beyerdynamic', category: 'Tech', kind: 'exact',
    price: {amounts:[159],label:'Dès 159 €',note:'Offre repérée chez Darty le 29 octobre 2026, hors livraison.',source:'https://www.darty.com/nav/achat/ref/MC351380692.html'},
    summary: 'Black Edition, 80 ohms. La référence du lien Darty.', meta: '80 ohms · Black Edition',
    details: ['DT 770 PRO Black Edition, 80 ohms, édition limitée.', 'La référence à suivre est celle du lien Darty : MC351380692.', 'La photo illustre la gamme DT 770 PRO ; la finition exacte est celle de la fiche produit.'],
    images: [photo('IMG_0127','Casque filaire Beyerdynamic DT 770 PRO noir avec coussinets gris')],
    photoNote: 'Photo de la gamme ; suivre la finition Black Edition du lien.',
    links: [{label: 'Voir chez Darty', url: 'https://www.darty.com/nav/achat/ref/MC351380692.html'}],
  },
  {
    id: 'parfum', name: 'La Nuit de L’Homme', brand: 'Yves Saint Laurent', category: 'Soin', kind: 'exact',
    price: {amounts:[85.60,117.60],label:'85,60 à 117,60 €',note:'60 ml : 85,60 € ; 100 ml : 117,60 €. Prix YSL repérés le 29 octobre 2026, hors livraison.',source:'https://www.yslbeauty.fr/parfums/parfum-homme/la-nuit-de-l-homme/la-nuit-de-l-homme-le-parfum/522YSL.html'},
    summary: 'La version Le Parfum, comme sur la photo.', meta: 'Le Parfum',
    details: ['La version « Le Parfum » présentée sur la photo.', 'La contenance est au choix.'],
    images: [photo('IMG_0124','Flacon La Nuit de L’Homme Le Parfum Yves Saint Laurent')],
    links: [{label: 'Voir chez YSL Beauté', url: 'https://www.yslbeauty.fr/parfums/parfum-homme/la-nuit-de-l-homme/la-nuit-de-l-homme-le-parfum/522YSL.html'}],
  },
  {
    id: 'vetements', name: 'Un sweat ou une veste légère', brand: 'On, Drôle de Monsieur et Alo', category: 'Vêtements', kind: 'choice',
    intent: {title: 'Un de ces 3 modèles', description: 'Les trois me plaisent autant. Un seul suffit.'},
    price: {amounts:[],bands:['150-plus'],label:'Budget : plus de 150 €',note:'Budget indicatif précisé par Antonin le 29 octobre 2026.',source:'Antonin'},
    summary: 'La veste On, le sweat Drôle de Monsieur ou la veste Alo des photos. Taille M, sans préférence entre les trois.', meta: 'Taille M',
    details: ['L’un des trois modèles photographiés : veste On, sweat Drôle de Monsieur ou veste Alo.', 'Taille M, en noir, bleu marine ou gris.', 'Aucune préférence entre les trois modèles : un seul suffit.'],
    images: [photo('IMG_0134','Veste noire à capuche On, modèle souhaité'), photo('IMG_0132','Sweat noir à capuche Drôle de Monsieur, modèle souhaité'), photo('IMG_0133','Veste noire à capuche Alo, modèle souhaité')],
    photoNote: 'Les liens de collection permettent de retrouver les modèles photographiés. Je souhaite bien l’un de ces trois modèles.',
    links: [{label:'Collection vestes On',url:'https://www.on.com/fr-fr/shop/mens/apparel/jackets'}, {label:'Collection vestes Alo',url:'https://www.aloyoga.com/collections/mens-jackets'}, {label:'Collection Drôle de Monsieur',url:'https://droledemonsieur.com/fr/collections/hoodies-and-sweatshirts'}],
  },
  {
    id: 'rituals', name: 'Un ou des soins Rituals gris', brand: 'Rituals', category: 'Soin', kind: 'inspiration',
    price: {amounts:[],bands:['0-50'],label:'Budget : 0 à 50 €',note:'Budget indicatif précisé par Antonin. Un ou plusieurs soins de la gamme grise.',source:'Antonin'},
    summary: 'Les produits de la gamme grise. En coffret ou séparément.',
    details: ['Des produits Rituals dans les emballages gris, comme sur la photo.', 'Le coffret est une inspiration, pas une composition exacte à reproduire.', 'Le lien mène à la collection Homme, pour retrouver cet univers de soins.'],
    images: [photo('IMG_0130','Exemple de coffret Rituals avec des produits gris et une trousse bleu nuit')],
    links: [{label: 'Explorer la collection Homme', url: 'https://www.rituals.com/fr-fr/collection/homme'}],
  },
  {
    id: 'massage', name: 'Un pistolet de massage', brand: 'Essentielb', category: 'Sport & détente', kind: 'inspiration',
    price: {amounts:[42.99],label:'Exemple à 42,99 €',note:'Exemple Essentielb HyperB chez Boulanger, repéré le 29 octobre 2026, hors livraison.',source:'https://www.boulanger.com/ref/8009700'},
    summary: 'Un modèle pour la récupération. Le HyperB est une piste.',
    details: ['Un pistolet de massage, dans l’esprit de la photo.', 'Le modèle repéré dans le lien fourni est l’Essentielb rechargeable HyperB.', 'La photo est une inspiration ; elle n’identifie pas forcément le modèle du lien.'],
    images: [photo('IMG_0131','Pistolet de massage compact noir, photo d’inspiration')],
    links: [{label: 'Voir l’exemple chez Boulanger', url: 'https://www.boulanger.com/ref/8009700'}],
  },
  {
    id: 'cadres', name: 'Des voitures au mur', brand: 'Photo & décoration', category: 'Maison', kind: 'inspiration',
    price: {amounts:[],bands:['0-50'],label:'Budget : 0 à 50 €',note:'Budget indicatif précisé par Antonin le 29 octobre 2026.',source:'Antonin'},
    summary: 'Deux ou trois cadres automobiles en noir et blanc, dans le même esprit.', meta: '2 ou 3 cadres',
    details: ['Deux ou trois cadres de voitures en noir et blanc, avec une esthétique cohérente.', 'Des cadres seuls à contour noir ou blanc me conviennent aussi : je ferai imprimer les photos.', 'La photo donne une idée du style souhaité.'],
    images: [photo('IMG_0135','Cadre noir avec une photographie automobile en noir et blanc')], links: [],
  },
  {
    id: 'station', name: 'Une station de charge Apple', brand: 'Accessoires', category: 'Tech', kind: 'choice',
    intent: {title: 'Le modèle est au choix', description: 'Une station compatible avec mes appareils Apple.'},
    price: {amounts:[],bands:['0-50'],label:'Budget : 0 à 50 €',note:'Budget indicatif précisé par Antonin le 29 octobre 2026.',source:'Antonin'},
    summary: 'Un support pour réunir les appareils, dans l’esprit de la photo.',
    details: ['Une station de charge pour les appareils Apple.', 'La photo montre une station pour téléphone, montre et écouteurs : c’est un exemple.', 'Vérifier avec moi la compatibilité des appareils et la présence de l’alimentation avant l’achat.'],
    images: [photo('IMG_0136','Station de charge noire avec un iPhone, une Apple Watch et un boîtier d’écouteurs')], links: [],
  },
  {
    id: 'chaise', name: 'Une chaise romaine', brand: 'L’occasion me va très bien', category: 'Sport & détente', kind: 'inspiration',
    price: {amounts:[],bands:['50-100'],label:'Budget : 50 à 100 €',note:'Budget indicatif précisé par Antonin le 29 octobre 2026.',source:'Antonin'},
    summary: 'Un équipement de sport à trouver d’occasion.', meta: 'D’occasion',
    details: ['Une chaise romaine d’occasion.', 'La photo sert d’exemple de type d’équipement.', 'À voir ensemble avant l’achat pour vérifier l’état et l’encombrement.'],
    images: [photo('IMG_0128','Chaise romaine de sport noire avec barre de traction')], links: [],
  },
  {
    id: 'sac', name: 'Sac de voyage noir', brand: 'ASOS DESIGN', category: 'Vêtements', kind: 'exact',
    price: {amounts:[],bands:['0-50'],label:'Budget : 0 à 50 €',note:'Budget indicatif précisé par Antonin le 29 octobre 2026.',source:'Antonin'},
    summary: 'Le sac de voyage noir ASOS DESIGN du lien. C’est ce modèle que je souhaite.',
    details: ['Le modèle noir photographié, référence ASOS 209017778.', 'Le lien mène directement au sac souhaité.'], images: [photo('IMG_0129','Sac de voyage noir ASOS DESIGN souhaité')], links: [{label:'Voir le sac chez ASOS',url:'https://www.asos.com/fr/asos-design/asos-design-sac-de-voyage-noir/prd/209017778'}],
  },
  {
    id: 'redbull', name: 'Un pack de 24 Red Bull', brand: 'Red Bull', category: 'Petites attentions', kind: 'choice',
    intent: {title: 'La saveur est au choix', description: 'Un pack de 24 canettes, pas forcément l’édition de la photo.'},
    price: {amounts:[43.99],label:'Exemple à 43,99 €',note:'Pack de 24 × 250 ml chez Fitadium, repéré le 29 octobre 2026. Le tarif dépend de la saveur et du vendeur, hors livraison.',source:'https://www.fitadium.com/5521-red-bull-24x250ml.html'},
    summary: 'Le petit stock qui fait plaisir. La saveur reste à choisir.', meta: '24 canettes',
    details: ['Un pack de 24 canettes.', 'La saveur est au choix ; l’édition de la photo est un exemple.'],
    images: [photo('IMG_0137','Exemple de pack de 24 canettes Red Bull jaunes')], links: [{label:'Voir un pack chez Fitadium',url:'https://www.fitadium.com/5521-red-bull-24x250ml.html'}],
  },
  {
    id: 'telephone', name: 'Mon prochain téléphone', brand: 'Une participation', category: 'Tech', kind: 'contribution',
    summary: 'Un coup de pouce pour changer de téléphone, du montant de ton choix.', meta: 'Montant libre',
    details: ['De l’argent pour un nouveau téléphone.', 'Le téléphone sur la photo est illustratif : le modèle n’est pas encore choisi.'],
    images: [photo('IMG_0125','Téléphone bordeaux illustrant le projet de nouveau téléphone')], links: [],
  },
  {
    id: 'zara', name: 'Une carte cadeau Zara', brand: 'Zara', category: 'Vêtements', kind: 'contribution',
    intent: {title: 'Une carte cadeau', description: 'Le montant est au choix, pour choisir mes vêtements.'},
    summary: 'Pour choisir une prochaine pièce. Le montant est libre.', meta: 'Montant libre',
    details: ['Une carte cadeau Zara, du montant de ton choix parmi les montants proposés.'],
    images: [photo('IMG_0126','Carte cadeau Zara grise')],
    links: [{label: 'Voir la carte cadeau Zara', url: 'https://www.zara.com/fr/fr/carte-cadeau-pT9234152152.html'}],
  },
]
export const kindLabels: Record<GiftKind, string> = {exact: 'Référence précise', inspiration: 'Inspiration', choice: 'Au choix', contribution: 'Participation'}
