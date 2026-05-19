export const CATEGORY_OPTIONS = [
    { label: 'Tops', value: 'tops' },
    { label: 'Shorts', value: 'shorts' },
    { label: 'Hoodies', value: 'hoodies' },
    { label: 'Pants', value: 'pants' },
    { label: 'Headwear', value: 'headwear' },
];

export const SUBCATEGORY_OPTIONS = [
    { label: 'Caution Capsule', value: 'caution capsule' },
    { label: 'Menace to the Society', value: 'menace to the society' },
    { label: 'The Boxed Cropped T', value: 'the boxed cropped t' },
    { label: 'Anti Pilling Fleece', value: 'anti pilling fleece' },
];

export const SIZE_OPTIONS = [
    'XS', 'S', 'M', 'L', 'XL',
    '26', '28', '29', '30', '32', '34', '36', '38', '40', '42',
];

export const HERO_OPTIONS = [
    { label: 'Not a hero product', value: '' },
    { label: 'Hero 1', value: 'hero1' },
    { label: 'Hero 2', value: 'hero2' },
    { label: 'Hero 3', value: 'hero3' },
];

export const GENDER_OPTIONS = ['Men', 'Women', 'Unisex'];

export const EMPTY_PRODUCT_FORM = {
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    gender: '',
    bestseller: false,
    latestCollection: false,
    sizes: [],
    colours: [],
    images: [],
    video: null,
    hero: '',
};