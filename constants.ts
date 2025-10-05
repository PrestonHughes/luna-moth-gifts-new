
import type { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Amethyst Cluster',
    variants: [{ size: 'Standard', price: 45.00 }],
    description: 'A beautiful cluster known for its calming and spiritual properties.',
    imageUrls: [
        'https://images.unsplash.com/photo-1598808526189-3a339180c10f?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1619551148592-13c51368b1a4?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1620656335343-3e0b2d6a52b1?q=80&w=400&h=400&fit=crop'
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
        'https://images.unsplash.com/photo-1604164303426-a6f44a3b4c4a?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1515942400427-454593595822?q=80&w=400&h=400&fit=crop'
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
        'https://images.unsplash.com/photo-1617061751101-b2b58832b3f1?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1658428230182-e8bbd1664c39?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1617061751003-81b33b3a7a4f?q=80&w=400&h=400&fit=crop'
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
        'https://images.unsplash.com/photo-1605100298401-8c4c794339e1?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1610471851108-87a32e99388c?q=80&w=400&h=400&fit=crop'
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
        'https://images.unsplash.com/photo-1607870716491-dfe9b3137a82?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1623902364955-442431f45604?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1612145564263-9b5523b7aa21?q=80&w=400&h=400&fit=crop'
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
        'https://images.unsplash.com/photo-1628151128913-911946a4e320?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1628151068222-1081335c05d7?q=80&w=400&h=400&fit=crop'
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
        'https://images.unsplash.com/photo-1618688487375-3453b0a701d3?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1567317351559-86566a506145?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1618688487214-7299a9134a9b?q=80&w=400&h=400&fit=crop'
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
        'https://images.unsplash.com/photo-1617061751052-a6305608e1e8?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1614036735222-2646c0759a0f?q=80&w=400&h=400&fit=crop'
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
        'https://images.unsplash.com/photo-1610331289299-31ab6b25121b?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1613426383637-1262d1a3b118?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1618688487399-5489728b6d3a?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Tumbled Stones',
  },
  {
    id: '10',
    name: 'Obsidian Scrying Mirror',
    variants: [{ size: 'Standard', price: 75.00 }],
    description: 'A strongly protective stone, it forms a shield against negativity.',
    imageUrls: [
        'https://images.unsplash.com/photo-1620535948950-763d3f92d77d?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1605898394435-01e4a0b2e8a1?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Decorative',
  },
  {
    id: '11',
    name: 'Fluorite Octahedron',
    variants: [{ size: 'Standard', price: 22.00 }],
    description: 'Highly protective and stabilizing, useful for grounding and harmonizing spiritual energy.',
    imageUrls: [
        'https://images.unsplash.com/photo-1617061751100-c97b8e5c851c?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1617061751121-72901a1d9a2a?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Geometric',
  },
  {
    id: '12',
    name: 'Tiger\'s Eye',
    variants: [{ size: 'Standard', price: 28.00 }],
    description: 'A stone of protection, Tiger\'s Eye may also bring good luck to the wearer.',
    imageUrls: [
        'https://images.unsplash.com/photo-1618688487315-780c1f51253a?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1618688487233-04e43a6d96a7?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Tumbled Stones',
  },
  {
    id: '13',
    name: 'Green Aventurine',
    variants: [{ size: 'Standard', price: 24.00 }],
    description: 'A stone of opportunity, thought to be the luckiest of all crystals.',
    imageUrls: [
        'https://images.unsplash.com/photo-1618688487293-19948c6a0b22?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1579543321997-7a840e4a7a8f?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Tumbled Stones',
  },
  {
    id: '14',
    name: 'Carnelian',
    variants: [{ size: 'Standard', price: 26.00 }],
    description: 'A stabilizing stone, Carnelian restores vitality and motivation, and stimulates creativity.',
    imageUrls: [
        'https://images.unsplash.com/photo-1618688487254-8e4e9f7b1b5e?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1613426383618-47965a3c9b7e?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Tumbled Stones',
  },
  {
    id: '15',
    name: 'Smoky Quartz Point',
    variants: [{ size: 'Standard', price: 32.00 }],
    description: 'An excellent grounding stone, Smoky Quartz gently neutralises negative vibrations.',
    imageUrls: [
        'https://images.unsplash.com/photo-1617061751095-8e3b1e3e7f4c?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1617061751080-6e4b9f3e4c4d?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Points & Wands',
  },
  {
    id: '16',
    name: 'Pyrite Cluster',
    variants: [{ size: 'Standard', price: 40.00 }],
    description: 'Also known as "Fool\'s Gold," Pyrite is a powerful protection stone which shields and protects against all forms of negative vibrations.',
    imageUrls: [
        'https://images.unsplash.com/photo-1613426383643-15962e2d9b2e?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1610331289311-2de5f3e9b1d9?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1618688487299-4d8d1e9e2b0f?q=80&w=400&h=400&fit=crop'
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
        'https://images.unsplash.com/photo-1631047123386-14025a176917?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1631047123326-42774b70e704?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Jewelry',
  },
  {
    id: '18',
    name: 'Howlite Sphere',
    variants: [{ size: 'Standard', price: 50.00 }],
    description: 'A calming stone, Howlite can help reduce levels of stress and anger.',
    imageUrls: [
        'https://images.unsplash.com/photo-1617061751120-c20e5e0d4c8d?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1617061751139-3a3d5b3d7a9b?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Spheres',
  },
  {
    id: '19',
    name: 'Sodalite',
    variants: [{ size: 'Standard', price: 29.00 }],
    description: 'Encourages rational thought, objectivity, truth and intuition.',
    imageUrls: [
        'https://images.unsplash.com/photo-1618688487271-2b0b1c9c0b1e?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1617061751065-9a8d9a8c0f3d?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Raw Stones',
  },
  {
    id: '20',
    name: 'Red Jasper Palm Stone',
    variants: [{ size: 'Medium', price: 33.00 }],
    description: 'Known as the “supreme nurturer”, it sustains and supports through times of stress.',
    imageUrls: [
        'https://images.unsplash.com/photo-1618688487288-46d4e8b3b641?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1541458319134-2a91d24838a3?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Palm Stones',
  },
  {
    id: '21',
    name: 'Moonstone Pendant',
    variants: [{ size: 'Standard', price: 65.00 }],
    description: 'A stone for “new beginnings”, Moonstone is a stone of inner growth and strength.',
    imageUrls: [
        'https://images.unsplash.com/photo-1610331289326-4b5b719d2a3e?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1613426383648-4e8c1b1c1b1c?q=80&w=400&h=400&fit=crop'
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
        'https://images.unsplash.com/photo-1613426383623-1d9c1b1c1b1c?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1620535948950-763d3f92d77d?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Clusters',
  },
  {
    id: '23',
    name: 'Ocean Jasper',
    variants: [{ size: 'Standard', price: 34.00 }],
    description: 'Encourages a feeling of joy and elevated spirits. Helps you to release negative feelings.',
    imageUrls: [
        'https://images.unsplash.com/photo-1618688487244-4d8d1e9e2b0f?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1617061751070-9a8d9a8c0f3d?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Tumbled Stones',
  },
  {
    id: '24',
    name: 'Kyanite Blade',
    variants: [{ size: 'Standard', price: 28.00 }],
    description: 'Excellent for attunement and meditation. It is tranquilizing and a powerful transmitter of high-frequency energies.',
    imageUrls: [
        'https://images.unsplash.com/photo-1617061751110-c20e5e0d4c8d?q=80&w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1617061751129-72901a1d9a2a?q=80&w=400&h=400&fit=crop'
    ],
    category: 'Raw Stones',
  },
];
