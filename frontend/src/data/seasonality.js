// Top 16 species with seasonal data for the Milano Blooming Map
// bloom_months: 0-indexed (0=Jan, 11=Dec), consistent with the rest of the app

export const SEASONS = {
  SPRING: 'spring',  // Mar–May  (2–4)
  SUMMER: 'summer',  // Jun–Aug  (5–7)
  AUTUMN: 'autumn',  // Sep–Nov  (8–10)
  WINTER: 'winter',  // Dec–Feb  (11,0,1)
}

export function getMonthSeason(month) {
  if (month >= 2 && month <= 4) return SEASONS.SPRING
  if (month >= 5 && month <= 7) return SEASONS.SUMMER
  if (month >= 8 && month <= 10) return SEASONS.AUTUMN
  return SEASONS.WINTER
}

// Top 16 species selected for Milan prevalence
export const SPECIES_DATA = {
  Prunus: {
    common: 'Cherry Blossom',
    latin: 'Prunus serrulata',
    type: 'tree',
    category: 'spring',
    bloom_months: [1, 2, 3],
    color: '#d4847a',
    icon: '🌸',
    showFlowers: true,
    autumnColor: '#c47a5a',
    desc: 'Clouds of pale pink blossom transform Milan streets into ephemeral spring sculptures. The quintessential harbinger of spring.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Prunus_serrulata_2.jpg?width=400',
    bloomPeriod: 'Feb – Apr',
  },
  Magnolia: {
    common: 'Magnolia',
    latin: 'Magnolia × soulangeana',
    type: 'tree',
    category: 'spring',
    bloom_months: [1, 2, 3],
    color: '#c49fcb',
    icon: '🌸',
    showFlowers: true,
    autumnColor: '#c49fcb',
    desc: 'Grand goblet-shaped flowers in pink and white appear before any leaves. A spectacular early spring display.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Magnolia_x_soulangeana1.jpg?width=400',
    bloomPeriod: 'Feb – Apr',
  },
  Cercis: {
    common: 'Judas Tree',
    latin: 'Cercis siliquastrum',
    type: 'tree',
    category: 'spring',
    bloom_months: [2, 3],
    color: '#c2529e',
    icon: '🌸',
    showFlowers: true,
    autumnColor: '#c4604e',
    desc: 'Vivid pink-purple flowers bloom directly on bare branches before leaves appear. Extremely common in Milan parks.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cercis_siliquastrum_flowers.jpg?width=400',
    bloomPeriod: 'Mar – Apr',
  },
  Malus: {
    common: 'Crabapple',
    latin: 'Malus sylvestris',
    type: 'tree',
    category: 'spring',
    bloom_months: [3, 4],
    color: '#d4847a',
    icon: '🌸',
    showFlowers: true,
    autumnColor: '#c4604e',
    desc: 'Pink and white apple-family blossoms cloud the canopy in mid spring, producing tiny ornamental fruits in autumn.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Malus_pumila_flower_detail.jpg?width=400',
    bloomPeriod: 'Apr – May',
  },
  Aesculus: {
    common: 'Horse Chestnut',
    latin: 'Aesculus hippocastanum',
    type: 'tree',
    category: 'spring',
    bloom_months: [3, 4],
    color: '#c99a4e',
    icon: '🌼',
    showFlowers: true,
    autumnColor: '#c4884e',
    desc: 'Spectacular white candle-like flower spikes tower above broad palmate leaves in late spring.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aesculus_hippocastanum_flowers.jpg?width=400',
    bloomPeriod: 'Apr – May',
  },
  Wisteria: {
    common: 'Wisteria',
    latin: 'Wisteria sinensis',
    type: 'vine',
    category: 'spring',
    bloom_months: [3, 4],
    color: '#9b8ec4',
    icon: '🌸',
    showFlowers: true,
    autumnColor: '#9b8ec4',
    desc: 'Cascading lavender-blue racemes drape over walls and pergolas — the iconic Italian spring sight.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Wisteria_sinensis_flowers2.jpg?width=400',
    bloomPeriod: 'Apr – May',
  },
  Syringa: {
    common: 'Lilac',
    latin: 'Syringa vulgaris',
    type: 'shrub',
    category: 'spring',
    bloom_months: [3, 4],
    color: '#9b8ec4',
    icon: '🌸',
    showFlowers: true,
    autumnColor: '#9b8ec4',
    desc: 'Dense fragrant clusters of purple and white fill parks with intoxicating perfume in April.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Syringa_vulgaris_flowers.jpg?width=400',
    bloomPeriod: 'Apr – May',
  },
  Forsythia: {
    common: 'Forsythia',
    latin: 'Forsythia × intermedia',
    type: 'shrub',
    category: 'spring',
    bloom_months: [1, 2],
    color: '#c99a4e',
    icon: '🌼',
    showFlowers: true,
    autumnColor: '#c4884e',
    desc: 'Bright yellow flowers on bare branches — the very first herald of spring in Milan.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Forsythia_x_intermedia.jpg?width=400',
    bloomPeriod: 'Feb – Mar',
  },
  Robinia: {
    common: 'Black Locust',
    latin: 'Robinia pseudoacacia',
    type: 'tree',
    category: 'spring',
    bloom_months: [4, 5],
    color: '#c99a4e',
    icon: '🌼',
    showFlowers: true,
    autumnColor: '#c99a4e',
    desc: 'Drooping clusters of fragrant white flowers fill parks with a heady sweet scent in late spring.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Robinia_pseudoacacia1.jpg?width=400',
    bloomPeriod: 'May – Jun',
  },
  Rosa: {
    common: 'Rose',
    latin: 'Rosa gallica',
    type: 'shrub',
    category: 'summer',
    bloom_months: [4, 5, 6, 7, 8],
    color: '#d47e8c',
    icon: '🌹',
    showFlowers: true,
    autumnColor: '#d4847a',
    desc: 'Roses bloom in wave after wave through the long summer months, filling gardens with layers of colour and scent.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rosa_centifolia_rosaceae.jpg?width=400',
    bloomPeriod: 'May – Sep',
  },
  Tilia: {
    common: 'Linden Tree',
    latin: 'Tilia cordata',
    type: 'tree',
    category: 'summer',
    bloom_months: [5, 6],
    color: '#7a9e7e',
    icon: '🌿',
    showFlowers: true,
    autumnColor: '#c4884e',
    desc: 'Small fragrant cream flowers perfume Milan streets with honey in June and July. Ancient limes line historic gardens.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tilia_cordata_in_flower.jpg?width=400',
    bloomPeriod: 'Jun – Jul',
  },
  Jacaranda: {
    common: 'Jacaranda',
    latin: 'Jacaranda mimosifolia',
    type: 'tree',
    category: 'summer',
    bloom_months: [4, 5, 6],
    color: '#9b8ec4',
    icon: '💜',
    showFlowers: true,
    autumnColor: '#9b8ec4',
    desc: 'Vivid violet-blue trumpets create a purple canopy before feathery leaves. Rare but magical in sheltered Milan spots.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jacaranda_mimosifolia_flowers.jpg?width=400',
    bloomPeriod: 'May – Jul',
  },
  Lagerstroemia: {
    common: 'Crape Myrtle',
    latin: 'Lagerstroemia indica',
    type: 'tree',
    category: 'summer',
    bloom_months: [6, 7, 8],
    color: '#d47e8c',
    icon: '🌺',
    showFlowers: true,
    autumnColor: '#c4604e',
    desc: 'Vivid crinkled flowers in shades of pink and purple carry colour through the long summer.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lagerstroemia_speciosa_flowers.jpg?width=400',
    bloomPeriod: 'Jul – Sep',
  },
  Catalpa: {
    common: 'Catalpa',
    latin: 'Catalpa bignonioides',
    type: 'tree',
    category: 'summer',
    bloom_months: [5, 6],
    color: '#b8d4bb',
    icon: '🌿',
    showFlowers: true,
    autumnColor: '#c99a4e',
    desc: 'Large orchid-like white flowers with purple markings appear above enormous tropical-looking leaves.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Catalpa_bignonioides_flowers.jpg?width=400',
    bloomPeriod: 'Jun – Jul',
  },
  Crataegus: {
    common: 'Hawthorn',
    latin: 'Crataegus monogyna',
    type: 'tree',
    category: 'spring',
    bloom_months: [3, 4],
    color: '#b8d4bb',
    icon: '🌸',
    showFlowers: true,
    autumnColor: '#c4604e',
    desc: 'Dense white blossom clusters smother hawthorn in mid spring, followed by red berries in autumn.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Crataegus_monogyna_flowers.jpg?width=400',
    bloomPeriod: 'Apr – May',
  },
  Acer: {
    common: 'Maple',
    latin: 'Acer platanoides',
    type: 'tree',
    category: 'autumn',
    bloom_months: [],             // No flower display
    color: '#c4604e',
    icon: '🍁',
    showFlowers: false,            // Special: never show flowers
    visibleMonths: [8, 9, 10],    // Only visible in autumn
    autumnColor: '#c4604e',
    desc: 'Maples blaze with spectacular flame-red and gold autumn foliage. The fiery highlight of October in Milan parks.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Acer_platanoides_autumn.jpg?width=400',
    bloomPeriod: 'Sep – Nov (autumn colour)',
  },
}

// Lookup: common_name from GeoJSON → SPECIES_DATA key (genus)
export const COMMON_NAME_TO_GENUS = {
  // Prunus — cherry & plum
  'Cherry': 'Prunus',
  'Cherry Blossom': 'Prunus',
  'Cherry / Plum': 'Prunus',
  'Japanese Cherry': 'Prunus',
  'Yoshino Cherry': 'Prunus',
  'Plum': 'Prunus',
  'Sweet Cherry': 'Prunus',
  'Bird Cherry': 'Prunus',
  // Magnolia
  'Magnolia': 'Magnolia',
  'Saucer Magnolia': 'Magnolia',
  'Bull Bay Magnolia': 'Magnolia',
  // Cercis — judas tree
  'Judas Tree': 'Cercis',
  'Judas Tree / Redbud': 'Cercis',
  'Redbud': 'Cercis',
  // Malus — crabapple
  'Crabapple': 'Malus',
  'Apple': 'Malus',
  'Ornamental Apple': 'Malus',
  'Ornamental Pear': 'Malus',
  // Aesculus — horse chestnut
  'Horse Chestnut': 'Aesculus',
  'Buckeye': 'Aesculus',
  'Red Horse Chestnut': 'Aesculus',
  // Wisteria
  'Wisteria': 'Wisteria',
  'Chinese Wisteria': 'Wisteria',
  'Japanese Wisteria': 'Wisteria',
  // Syringa — lilac
  'Lilac': 'Syringa',
  // Forsythia
  'Forsythia': 'Forsythia',
  // Robinia — black locust
  'Black Locust': 'Robinia',
  'Black Locust / Acacia': 'Robinia',
  'Acacia': 'Robinia',
  'False Acacia': 'Robinia',
  'Honey Locust': 'Robinia',
  // Rosa
  'Rose': 'Rosa',
  'Heritage Rose': 'Rosa',
  'Climbing Rose': 'Rosa',
  // Tilia — linden / lime
  'Linden': 'Tilia',
  'Linden / Lime Tree': 'Tilia',
  'Lime': 'Tilia',
  'Small-leaved Lime': 'Tilia',
  'Large-leaved Lime': 'Tilia',
  'Linden Tree': 'Tilia',
  // Jacaranda
  'Jacaranda': 'Jacaranda',
  // Lagerstroemia — crape myrtle
  'Crape Myrtle': 'Lagerstroemia',
  'Lagerstroemia': 'Lagerstroemia',
  // Catalpa
  'Catalpa': 'Catalpa',
  // Crataegus — hawthorn
  'Hawthorn': 'Crataegus',
  // Acer — maple
  'Maple': 'Acer',
  'Norway Maple': 'Acer',
  'Field Maple': 'Acer',
  'Sycamore Maple': 'Acer',
  'Sycamore': 'Acer',
  'Silver Maple': 'Acer',
  'Red Maple': 'Acer',
}

export function getGenus(commonName) {
  return COMMON_NAME_TO_GENUS[commonName] || null
}

// Compute visual state for a species in a given month
export function getVisualState(commonName, month) {
  const genus = getGenus(commonName)
  const season = getMonthSeason(month)

  // Maple: only visible in autumn, no flowers ever
  if (genus === 'Acer') {
    if (month < 8 || month > 10) return { visible: false }
    return { visible: true, state: 'autumn', color: '#c4604e', icon: '🍁', label: 'Autumn colour', animClass: 'anim-autumn' }
  }

  const species = genus ? SPECIES_DATA[genus] : null

  if (species && species.bloom_months.includes(month) && species.showFlowers) {
    return { visible: true, state: 'bloom', color: species.color, icon: species.icon, label: 'In bloom', animClass: 'anim-flower' }
  }

  if (season === SEASONS.WINTER) {
    return { visible: true, state: 'winter', color: '#9a8a78', icon: '🌿', label: 'Winter', animClass: 'anim-bare' }
  }
  if (season === SEASONS.AUTUMN) {
    const autumnColor = species?.autumnColor || '#c4884e'
    return { visible: true, state: 'autumn', color: autumnColor, icon: '🍂', label: 'Autumn colour', animClass: 'anim-autumn' }
  }

  return { visible: true, state: 'foliage', color: '#7a9e7e', icon: '🌿', label: 'Foliage', animClass: 'anim-leaf' }
}
