
import type { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Amethyst Cluster',
    variants: [{ size: 'Standard', price: 45.00 }],
    description: 'A beautiful cluster known for its calming and spiritual properties.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?amethyst,cluster',
        'https://source.unsplash.com/400x400/?amethyst,crystal,geode',
        'https://source.unsplash.com/400x400/?purple,geode'
    ],
    category: 'Clusters',
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Rose Quartz',
    variants: [{ size: 'Standard', price: 25.00 }],
    description: 'The stone of universal love, encourages compassion and peace.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?rose,quartz',
        'https://source.unsplash.com/400x400/?rose,quartz,crystal'
    ],
    category: 'Tumbled Stones',
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Black Tourmaline',
    variants: [{ size: 'Standard', price: 30.00 }],
    description: 'A powerful grounding stone, providing protection against negativity.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?black,tourmaline',
        'https://source.unsplash.com/400x400/?tourmaline,raw',
        'https://source.unsplash.com/400x400/?black,crystal'
    ],
    category: 'Raw Stones',
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Clear Quartz Point',
    variants: [{ size: 'Standard', price: 20.00 }],
    description: 'Known as the "master healer," it amplifies energy and thought.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?clear,quartz,point',
        'https://source.unsplash.com/400x400/?quartz,crystal,wand'
    ],
    category: 'Points & Wands',
    isFeatured: true,
  },
  {
    id: '5',
    name: 'Citrine Geode',
    variants: [{ size: 'Standard', price: 55.00 }],
    description: 'Carries the power of the sun, promoting positivity and joy.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?citrine,geode',
        'https://source.unsplash.com/400x400/?citrine,crystal',
        'https://source.unsplash.com/400x400/?yellow,geode,cluster'
    ],
    category: 'Geodes',
    isFeatured: true,
  },
  {
    id: '6',
    name: 'Selenite Wand',
    variants: [{ size: 'Standard', price: 18.00 }],
    description: 'Used for cleansing energy from other crystals and spaces.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?selenite,wand',
        'https://source.unsplash.com/400x400/?selenite,crystal'
    ],
    category: 'Points & Wands',
    isFeatured: true,
  },
  {
    id: '7',
    name: 'Labradorite Palm Stone',
    variants: [
      { size: 'Small', price: 25.00, description: 'Approx. 1" - 1.5" in diameter.' },
      { size: 'Medium', price: 30.00, description: 'Approx. 1.5" - 2.5" in diameter.' },
      { size: 'Large', price: 35.00, description: 'Approx. 2.5" - 4" in diameter.' }
    ],
    description: 'A stone of transformation, it enhances strength of will and a sense of inner worth.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?labradorite',
        'https://source.unsplash.com/400x400/?labradorite,stone',
        'https://source.unsplash.com/400x400/?labradorite,crystal'
    ],
    category: 'Palm Stones',
    isFeatured: true,
  },
  {
    id: '8',
    name: 'Lapis Lazuli Sphere',
    variants: [{ size: 'Standard', price: 60.00 }],
    description: 'A symbol of wisdom and truth, it encourages self-awareness and self-expression.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?lapis,lazuli,sphere',
        'https://source.unsplash.com/400x400/?lapis,lazuli,crystal'
    ],
    category: 'Spheres',
    isFeatured: true,
  },
  {
    id: '9',
    name: 'Malachite',
    variants: [{ size: 'Standard', price: 48.00 }],
    description: 'Known as the stone of transformation, it absorbs negative energies and pollutants.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?malachite,stone',
        'https://source.unsplash.com/400x400/?malachite,crystal',
        'https://source.unsplash.com/400x400/?green,gemstone'
    ],
    category: 'Tumbled Stones',
  },
  {
    id: '10',
    name: 'Obsidian Scrying Mirror',
    variants: [{ size: 'Standard', price: 75.00 }],
    description: 'A strongly protective stone, it forms a shield against negativity.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?obsidian,mirror',
        'https://source.unsplash.com/400x400/?obsidian,scrying'
    ],
    category: 'Decorative',
  },
  {
    id: '11',
    name: 'Fluorite Octahedron',
    variants: [{ size: 'Standard', price: 22.00 }],
    description: 'Highly protective and stabilizing, useful for grounding and harmonizing spiritual energy.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?fluorite,octahedron',
        'https://source.unsplash.com/400x400/?fluorite,crystal'
    ],
    category: 'Geometric',
  },
  {
    id: '12',
    name: 'Tiger\'s Eye',
    variants: [{ size: 'Standard', price: 28.00 }],
    description: 'A stone of protection, Tiger\'s Eye may also bring good luck to the wearer.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?tigers,eye,stone',
        'https://source.unsplash.com/400x400/?tiger,eye,gemstone'
    ],
    category: 'Tumbled Stones',
  },
  {
    id: '13',
    name: 'Green Aventurine',
    variants: [{ size: 'Standard', price: 24.00 }],
    description: 'A stone of opportunity, thought to be the luckiest of all crystals.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?green,aventurine',
        'https://source.unsplash.com/400x400/?aventurine,tumbled'
    ],
    category: 'Tumbled Stones',
  },
  {
    id: '14',
    name: 'Carnelian',
    variants: [{ size: 'Standard', price: 26.00 }],
    description: 'A stabilizing stone, Carnelian restores vitality and motivation, and stimulates creativity.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?carnelian,stone',
        'https://source.unsplash.com/400x400/?carnelian,tumbled'
    ],
    category: 'Tumbled Stones',
  },
  {
    id: '15',
    name: 'Smoky Quartz Point',
    variants: [{ size: 'Standard', price: 32.00 }],
    description: 'An excellent grounding stone, Smoky Quartz gently neutralises negative vibrations.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?smoky,quartz,point',
        'https://source.unsplash.com/400x400/?smoky,quartz,crystal'
    ],
    category: 'Points & Wands',
  },
  {
    id: '16',
    name: 'Pyrite Cluster',
    variants: [{ size: 'Standard', price: 40.00 }],
    description: 'Also known as "Fool\'s Gold," Pyrite is a powerful protection stone which shields and protects against all forms of negative vibrations.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?pyrite,cluster',
        'https://source.unsplash.com/400x400/?pyrite,geode',
        'https://source.unsplash.com/400x400/?fools,gold'
    ],
    category: 'Clusters',
    isFeatured: true,
  },
  {
    id: '17',
    name: 'Amethyst Bracelet',
    variants: [{ size: 'Standard', price: 38.00 }],
    description: 'Wear the calming energy of Amethyst with this beautiful beaded bracelet.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?amethyst,bracelet',
        'https://source.unsplash.com/400x400/?crystal,bracelet,jewelry'
    ],
    category: 'Jewelry',
  },
  {
    id: '18',
    name: 'Howlite Sphere',
    variants: [{ size: 'Standard', price: 50.00 }],
    description: 'A calming stone, Howlite can help reduce levels of stress and anger.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?howlite,sphere',
        'https://source.unsplash.com/400x400/?howlite,crystal'
    ],
    category: 'Spheres',
  },
  {
    id: '19',
    name: 'Sodalite',
    variants: [{ size: 'Standard', price: 29.00 }],
    description: 'Encourages rational thought, objectivity, truth and intuition.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?sodalite,raw',
        'https://source.unsplash.com/400x400/?sodalite,stone'
    ],
    category: 'Raw Stones',
  },
  {
    id: '20',
    name: 'Red Jasper Palm Stone',
    variants: [{ size: 'Medium', price: 33.00 }],
    description: 'Known as the “supreme nurturer”, it sustains and supports through times of stress.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?red,jasper',
        'https://source.unsplash.com/400x400/?red,jasper,palm,stone'
    ],
    category: 'Palm Stones',
  },
  {
    id: '21',
    name: 'Moonstone Pendant',
    variants: [{ size: 'Standard', price: 65.00 }],
    description: 'A stone for “new beginnings”, Moonstone is a stone of inner growth and strength.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?moonstone,pendant',
        'https://source.unsplash.com/400x400/?moonstone,jewelry'
    ],
    category: 'Jewelry',
    isFeatured: true,
  },
  {
    id: '22',
    name: 'Desert Rose Selenite',
    variants: [{ size: 'Standard', price: 20.00 }],
    description: 'Said to contain a unique spirit guardian, each one is different.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?desert,rose,selenite',
        'https://source.unsplash.com/400x400/?desert,rose,crystal'
    ],
    category: 'Clusters',
  },
  {
    id: '23',
    name: 'Ocean Jasper',
    variants: [{ size: 'Standard', price: 34.00 }],
    description: 'Encourages a feeling of joy and elevated spirits. Helps you to release negative feelings.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?ocean,jasper',
        'https://source.unsplash.com/400x400/?ocean,jasper,tumbled'
    ],
    category: 'Tumbled Stones',
  },
  {
    id: '24',
    name: 'Kyanite Blade',
    variants: [{ size: 'Standard', price: 28.00 }],
    description: 'Excellent for attunement and meditation. It is tranquilizing and a powerful transmitter of high-frequency energies.',
    imageUrls: [
        'https://source.unsplash.com/400x400/?kyanite,blade',
        'https://source.unsplash.com/400x400/?kyanite,raw'
    ],
    category: 'Raw Stones',
  },
];
