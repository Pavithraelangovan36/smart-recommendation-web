/**
 * SMART RECOMMENDATION SYSTEM - Mock Data Repository
 * Realistic product, content, category, and seed user data with LocalStorage initialization.
 */

// Initial Seed Products (28+ diverse products with realistic pricing in INR ₹)
const SEED_PRODUCTS = [
  {
    id: "prod-1",
    name: "Aura Pro Wireless Noise-Cancelling Headphones",
    brand: "SonicWave",
    category: "Electronics",
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    rating: 4.8,
    reviewsCount: 320,
    isTrending: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Immerse yourself in rich, high-resolution audio with hybrid active noise cancellation, 40-hour battery life, and ultra-plush memory foam earcups.",
    features: [
      "Active Hybrid Noise Cancellation (ANC)",
      "40-hour playtime with USB-C quick charge",
      "Multipoint Bluetooth 5.3 connection",
      "Custom EQ sound profiles via companion app"
    ],
    inStock: true,
    dateAdded: "2026-02-15"
  },
  {
    id: "prod-2",
    name: "UltraFit Horizon Smartwatch & Health Tracker",
    brand: "AeroTech",
    category: "Electronics",
    price: 4299,
    originalPrice: 5999,
    discount: 28,
    rating: 4.7,
    reviewsCount: 245,
    isTrending: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Crisp 1.43-inch AMOLED display with heart rate, SpO2, sleep staging, and 110+ sports tracking modes in an aircraft-grade aluminum chassis.",
    features: [
      "Always-on 1.43\" AMOLED vibrant screen",
      "Precision continuous biometrics & sleep scoring",
      "Water resistant to 5 ATM (50 meters)",
      "Up to 12 days battery life on single charge"
    ],
    inStock: true,
    dateAdded: "2026-01-20"
  },
  {
    id: "prod-3",
    name: "ErgoFlow Aluminum Ergonomic Laptop Stand",
    brand: "DeskMate",
    category: "Electronics",
    price: 1199,
    originalPrice: 1799,
    discount: 33,
    rating: 4.6,
    reviewsCount: 180,
    isTrending: false,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Elevate your workspace posture. Sturdy CNC-machined aluminum stand compatible with 10 to 17.3 inch laptops, featuring hollow cooling vents.",
    features: [
      "Ergonomic height adjustment up to 6 inches",
      "Anti-skid silicone pads prevent scratches",
      "Heat dissipation ventilated structure",
      "Foldable portable flat design"
    ],
    inStock: true,
    dateAdded: "2026-02-01"
  },
  {
    id: "prod-4",
    name: "KeyCraft RGB Mechanical Keyboard (Hot-Swappable)",
    brand: "KeyCraft",
    category: "Electronics",
    price: 2899,
    originalPrice: 3999,
    discount: 27,
    rating: 4.9,
    reviewsCount: 410,
    isTrending: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Compact 75% layout mechanical keyboard with pre-lubed linear switches, sound dampening silicone foam, and custom RGB backlighting.",
    features: [
      "Hot-swappable 3/5-pin switch sockets",
      "Double-shot PBT shine-through keycaps",
      "Tri-mode: 2.4GHz wireless, Bluetooth 5.0 & Type-C",
      "Factory pre-lubricated red linear switches"
    ],
    inStock: true,
    dateAdded: "2026-03-05"
  },
  {
    id: "prod-5",
    name: "PulseBeat 360 Waterproof Bluetooth Speaker",
    brand: "SonicWave",
    category: "Electronics",
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    rating: 4.5,
    reviewsCount: 162,
    isTrending: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80"
    ],
    description: "360-degree room-filling acoustic audio with deep bass radiators and IPX7 waterproof rating, perfect for pool parties and travel.",
    features: [
      "24W omnidirectional stereo drivers",
      "IPX7 fully submersible waterproof",
      "PartySync link up to 100 units together",
      "16-hour continuous playback"
    ],
    inStock: true,
    dateAdded: "2026-01-11"
  },
  {
    id: "prod-6",
    name: "UrbanGlide Minimalist Street Sneakers",
    brand: "StrideLab",
    category: "Fashion",
    price: 2199,
    originalPrice: 3299,
    discount: 33,
    rating: 4.6,
    reviewsCount: 198,
    isTrending: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Streamlined casual sneakers featuring cloud foam cushioning, breathable knit upper, and durable vulcanized rubber grip sole.",
    features: [
      "Breathable engineered fly-knit mesh",
      "Responsive energy-return memory foam insole",
      "Featherweight construction (240g per shoe)",
      "Shock-absorbing anti-slip outsole"
    ],
    inStock: true,
    dateAdded: "2026-02-18"
  },
  {
    id: "prod-7",
    name: "Nomad Washed Denim Trucker Jacket",
    brand: "Heritage Threads",
    category: "Fashion",
    price: 2499,
    originalPrice: 3799,
    discount: 34,
    rating: 4.7,
    reviewsCount: 145,
    isTrending: false,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Classic vintage-washed denim jacket crafted from 100% sustainable organic cotton. Designed with regular tailored fit and brass buttons.",
    features: [
      "100% heavy-weight 12.5oz cotton denim",
      "Dual chest flap pockets & slant side pockets",
      "Reinforced double-stitched seams",
      "Comfort regular fit for effortless layering"
    ],
    inStock: true,
    dateAdded: "2026-01-28"
  },
  {
    id: "prod-8",
    name: "Apex Commuter Weatherproof Laptop Backpack",
    brand: "PackCraft",
    category: "Fashion",
    price: 1899,
    originalPrice: 2699,
    discount: 29,
    rating: 4.8,
    reviewsCount: 312,
    isTrending: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Sleek 22L everyday backpack with dedicated fleece-lined 16\" laptop sleeve, luggage pass-through strap, and water-repellent ballistic nylon.",
    features: [
      "Dedicated padded 16-inch laptop pocket",
      "Water-repellent 900D Oxford nylon exterior",
      "Anti-theft hidden pocket & USB charge pass",
      "Ergonomic breathable mesh shoulder straps"
    ],
    inStock: true,
    dateAdded: "2026-03-01"
  },
  {
    id: "prod-9",
    name: "Classic Aviator Polarized Sunglasses",
    brand: "Vanguard Eyewear",
    category: "Fashion",
    price: 899,
    originalPrice: 1499,
    discount: 40,
    rating: 4.4,
    reviewsCount: 110,
    isTrending: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Timeless teardrop aviator frame in electroplated titanium finish with UV400 polarized glare-reducing TAC lenses.",
    features: [
      "UV400 Category 3 optical clarity lenses",
      "Ultra-lightweight titanium alloy frame",
      "Adjustable hypoallergenic silicone nose pads",
      "Includes hard shell leather protective case"
    ],
    inStock: true,
    dateAdded: "2026-02-12"
  },
  {
    id: "prod-10",
    name: "Organic Supima Cotton Heavyweight Tee",
    brand: "Heritage Threads",
    category: "Fashion",
    price: 699,
    originalPrice: 999,
    discount: 30,
    rating: 4.5,
    reviewsCount: 220,
    isTrending: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Premium 240 GSM combed organic cotton t-shirt with a relaxed drop-shoulder silhouette and rib-knit collar.",
    features: [
      "240 GSM heavy compact Supima cotton",
      "Pre-shrunk fabric to prevent color fading",
      "Seamless drop-shoulder modern fit",
      "Eco-friendly non-toxic certified dye"
    ],
    inStock: true,
    dateAdded: "2026-01-15"
  },
  {
    id: "prod-11",
    name: "Python Mastery & Clean Architecture Manual",
    brand: "TechPress",
    category: "Books",
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.9,
    reviewsCount: 540,
    isTrending: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=700&q=80"
    ],
    description: "The definitive roadmap to writing maintainable, production-grade Python. Covers async patterns, design patterns, testing, and modern packaging.",
    features: [
      "520 pages of practical real-world exercises",
      "Covers Python 3.12+ advanced idioms",
      "Includes downloadable GitHub repo source code",
      "High-quality lay-flat binding"
    ],
    inStock: true,
    dateAdded: "2026-02-10"
  },
  {
    id: "prod-12",
    name: "Modern Digital Marketing Blueprint 2026",
    brand: "GrowthWave",
    category: "Books",
    price: 649,
    originalPrice: 899,
    discount: 28,
    rating: 4.8,
    reviewsCount: 380,
    isTrending: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Master modern omnichannel marketing, AI-driven recommendation loops, conversion rate optimization, and behavioral consumer psychology.",
    features: [
      "Comprehensive case studies of top D2C brands",
      "Actionable analytics & attribution frameworks",
      "SEO, PPC, and personalized retention funnels",
      "Exclusive checklist templates included"
    ],
    inStock: true,
    dateAdded: "2026-01-05"
  },
  {
    id: "prod-13",
    name: "Data Science & Practical Machine Learning",
    brand: "O'Reilly Media",
    category: "Books",
    price: 1099,
    originalPrice: 1499,
    discount: 26,
    rating: 4.7,
    reviewsCount: 295,
    isTrending: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Hands-on guide to statistical modeling, feature engineering, recommender systems, deep learning architectures, and cloud deployments.",
    features: [
      "Full coverage of Scikit-Learn, PyTorch & Pandas",
      "Detailed recommendation systems chapter",
      "End-to-end deployment with Docker and FastAPI",
      "Over 120 illustrative graphs and diagrams"
    ],
    inStock: true,
    dateAdded: "2026-02-25"
  },
  {
    id: "prod-14",
    name: "The Full Stack Web Developer's Handbook",
    brand: "DevPublish",
    category: "Books",
    price: 849,
    originalPrice: 1199,
    discount: 29,
    rating: 4.6,
    reviewsCount: 190,
    isTrending: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Everything from modern CSS layouts and vanilla JavaScript mastery to RESTful APIs, caching strategies, and frontend performance tuning.",
    features: [
      "Modern JavaScript ES6+ through Next.js patterns",
      "Frontend state management architectures",
      "Web accessibility and SEO best practices",
      "Includes 10 complete capstone project briefs"
    ],
    inStock: true,
    dateAdded: "2026-03-02"
  },
  {
    id: "prod-15",
    name: "Botanical Hydrating Facial Cleanser Gel",
    brand: "PureGlow",
    category: "Beauty",
    price: 499,
    originalPrice: 699,
    discount: 28,
    rating: 4.7,
    reviewsCount: 310,
    isTrending: false,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Sulfate-free pH-balanced gentle face wash infused with green tea extract, hyaluronic acid, and aloe vera for glowing, clean skin.",
    features: [
      "Balances natural skin microbiome without stripping",
      "100% vegan, cruelty-free, and fragrance-free",
      "Enriched with 2% Hyaluronic Acid & Aloe",
      "Dermatologically tested for sensitive skin"
    ],
    inStock: true,
    dateAdded: "2026-02-14"
  },
  {
    id: "prod-16",
    name: "Ceramide Barrier Repair Daily Moisturizer",
    brand: "DermaShield",
    category: "Beauty",
    price: 649,
    originalPrice: 899,
    discount: 28,
    rating: 4.8,
    reviewsCount: 420,
    isTrending: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1608248597359-0098e945c71b?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608248597359-0098e945c71b?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Ultra-hydrating non-greasy barrier defense cream with 5 essential ceramides, squalane, and soothing centella asiatica extract.",
    features: [
      "Strengthens skin lipid moisture barrier in 48 hours",
      "Fast-absorbing velvet matte finish",
      "Non-comedogenic and pore-safe",
      "Suitable for all weather and skin types"
    ],
    inStock: true,
    dateAdded: "2026-01-19"
  },
  {
    id: "prod-17",
    name: "Radiant Skin 4-Step Complete Care Kit",
    brand: "PureGlow",
    category: "Beauty",
    price: 1599,
    originalPrice: 2299,
    discount: 30,
    rating: 4.9,
    reviewsCount: 512,
    isTrending: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Complete daily skincare set: cleanser, exfoliating toner, vitamin C antioxidant serum, and ceramide barrier moisturizer.",
    features: [
      "Includes full-sized 4 essential skincare steps",
      "Clinically formulated to brighten and even tone",
      "Comes in a reusable travel cosmetic case",
      "Clean beauty certified with no parabens"
    ],
    inStock: true,
    dateAdded: "2026-03-01"
  },
  {
    id: "prod-18",
    name: "Aerolight Distance Pro Running Shoes",
    brand: "StrideLab",
    category: "Sports",
    price: 3299,
    originalPrice: 4799,
    discount: 31,
    rating: 4.8,
    reviewsCount: 380,
    isTrending: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Engineered for marathon training and daily 5K runs. Carbon-infused TPU plate with dual-density nitrogen infused cushioning.",
    features: [
      "Nitrogen-infused foam midsole for max rebound",
      "Engineered jacquard breathable mesh upper",
      "Reflective accents for 360-degree night visibility",
      "Reinforced carbon rubber abrasion pods"
    ],
    inStock: true,
    dateAdded: "2026-02-11"
  },
  {
    id: "prod-19",
    name: "Eco-Friendly High Density TPE Yoga Mat",
    brand: "ZenCore",
    category: "Sports",
    price: 999,
    originalPrice: 1499,
    discount: 33,
    rating: 4.6,
    reviewsCount: 215,
    isTrending: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=700&q=80"
    ],
    description: "6mm thick dual-layer non-slip exercise mat with alignment guides. Non-toxic, moisture-resistant, and comes with a convenient carry strap.",
    features: [
      "Double-sided textured non-slip traction",
      "Laser-etched body alignment lines",
      "6mm joint protection high-density cushioning",
      "Includes adjustable braided carry strap"
    ],
    inStock: true,
    dateAdded: "2026-01-30"
  },
  {
    id: "prod-20",
    name: "ActivePro Smart Fitness & Activity Band",
    brand: "AeroTech",
    category: "Sports",
    price: 1599,
    originalPrice: 2299,
    discount: 30,
    rating: 4.5,
    reviewsCount: 190,
    isTrending: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Lightweight fitness companion with OLED touchscreen, automatic rep counting, sleep tracking, and continuous step/calorie monitoring.",
    features: [
      "14-day ultra-long battery life",
      "50-meter water resistance for swimming",
      "24/7 Heart rate & Blood oxygen monitor",
      "Customizable watch faces via mobile app"
    ],
    inStock: true,
    dateAdded: "2026-02-08"
  },
  {
    id: "prod-21",
    name: "Wanderlust Expandable 40L Travel Backpack",
    brand: "PackCraft",
    category: "Travel",
    price: 2699,
    originalPrice: 3899,
    discount: 30,
    rating: 4.8,
    reviewsCount: 340,
    isTrending: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Flight-approved carry-on backpack with 180° suitcase style opening, wet/dry separation pocket, and breathable ergonomic harness.",
    features: [
      "Expandable capacity from 30L to 40L",
      "TSA-compliant lie-flat 17\" laptop compartment",
      "Water-resistant tear-proof Cordura fabric",
      "Hideaway backpack straps for duffel mode"
    ],
    inStock: true,
    dateAdded: "2026-02-22"
  },
  {
    id: "prod-22",
    name: "Memory Foam Ergonomic Travel Neck Pillow",
    brand: "CloudRest",
    category: "Travel",
    price: 699,
    originalPrice: 999,
    discount: 30,
    rating: 4.6,
    reviewsCount: 165,
    isTrending: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80"
    ],
    description: "360-degree supportive memory foam pillow with adjustable chin lock strap and washable cooling ice-silk fabric cover.",
    features: [
      "100% slow-rebound pure memory foam core",
      "Compresses down to 1/3 size into carry pouch",
      "Breathable cooling magnetic therapy lining",
      "Ergonomic contoured hump prevents neck strain"
    ],
    inStock: true,
    dateAdded: "2026-01-25"
  },
  {
    id: "prod-23",
    name: "7-Piece Compression Travel Packing Cubes",
    brand: "PackCraft",
    category: "Travel",
    price: 899,
    originalPrice: 1399,
    discount: 35,
    rating: 4.7,
    reviewsCount: 280,
    isTrending: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Save up to 60% luggage space. Double-zipper compression organizers including shoe bag, laundry pouch, and toiletry case.",
    features: [
      "Heavy-duty double compression zipper system",
      "Ripstop ultra-lightweight translucent nylon",
      "Water-resistant interior lining",
      "Includes 4 packing cubes, shoe bag, and wash pouch"
    ],
    inStock: true,
    dateAdded: "2026-03-04"
  },
  {
    id: "prod-24",
    name: "Artisanal Pour-Over Coffee Dripper Set",
    brand: "BrewCraft",
    category: "Food",
    price: 1399,
    originalPrice: 1999,
    discount: 30,
    rating: 4.8,
    reviewsCount: 190,
    isTrending: false,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Heat-resistant borosilicate glass carafe with spiral ribbed ceramic cone and 50 unbleached filters for barista quality morning brew.",
    features: [
      "600ml borosilicate glass server with level markers",
      "Precision internal spiral rib design for optimal extraction",
      "Heat-insulated walnut wood collar and tie",
      "Includes 50 premium natural paper filters"
    ],
    inStock: true,
    dateAdded: "2026-02-17"
  },
  {
    id: "prod-25",
    name: "Gourmet Organic Single-Origin Coffee Beans (500g)",
    brand: "RoastMaster",
    category: "Food",
    price: 599,
    originalPrice: 799,
    discount: 25,
    rating: 4.7,
    reviewsCount: 310,
    isTrending: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Medium roast 100% Arabica beans from Chikmagalur estate with notes of dark chocolate, toasted hazelnut, and sweet caramel.",
    features: [
      "100% shade-grown Arabica estate beans",
      "Freshly roasted in small artisanal batches",
      "Degassing valve foil pouch retains freshness",
      "Ideal for French press, Aeropress, and Espresso"
    ],
    inStock: true,
    dateAdded: "2026-02-28"
  },
  {
    id: "prod-26",
    name: "Aromatherapy Ultrasonic Essential Oil Diffuser",
    brand: "ZenCore",
    category: "Lifestyle",
    price: 1299,
    originalPrice: 1899,
    discount: 31,
    rating: 4.7,
    reviewsCount: 275,
    isTrending: false,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80"
    ],
    description: "500ml ultrasonic cool mist aroma diffuser with realistic wood grain base, 7 soothing ambient LED light colors, and auto shut-off.",
    features: [
      "Whisper-quiet ultrasonic operation (<23dB)",
      "Continuous 10-hour misting with timer settings",
      "BPA-free medical grade water tank",
      "Waterless automatic safety shut-off"
    ],
    inStock: true,
    dateAdded: "2026-01-22"
  },
  {
    id: "prod-27",
    name: "Insulated Stainless Steel Temperature Water Bottle (750ml)",
    brand: "HydroVibe",
    category: "Lifestyle",
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.6,
    reviewsCount: 185,
    isTrending: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Triple-wall vacuum insulated flask keeping drinks icy cold for 24 hours or piping hot for 12 hours. Sweat-proof powder coating.",
    features: [
      "18/8 food-grade pro stainless steel interior",
      "100% leak-proof lid with ergonomic carry loop",
      "Zero condensation, sweat-proof exterior finish",
      "Fits standard car and bicycle cup holders"
    ],
    inStock: true,
    dateAdded: "2026-02-05"
  },
  {
    id: "prod-28",
    name: "Minimalist Bamboo Desk Organizer & Pen Dock",
    brand: "DeskMate",
    category: "Lifestyle",
    price: 649,
    originalPrice: 949,
    discount: 31,
    rating: 4.5,
    reviewsCount: 140,
    isTrending: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Handcrafted natural bamboo desk caddy with compartments for smartphone, pens, sticky notes, and stationery items.",
    features: [
      "100% sustainably sourced natural bamboo",
      "Smooth rounded edges with protective non-slip base",
      "Integrated cable slot for phone charging",
      "Compact footprint suited for any home office"
    ],
    inStock: true,
    dateAdded: "2026-02-19"
  }
];

// Initial Seed Digital Marketing & Lifestyle Content (16+ Articles)
const SEED_CONTENT = [
  {
    id: "art-1",
    title: "10 Digital Marketing Trends Reshaping Customer Experience in 2026",
    category: "Digital Marketing",
    author: "Elena Rostova",
    date: "2026-03-10",
    readingTime: "6 min read",
    views: 4520,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    summary: "Discover how hyper-personalized recommendation loops, omnichannel tracking, and conversational AI are setting a new standard for modern marketing.",
    body: `
Digital marketing has evolved beyond generic broadcast messaging into hyper-personalized user journeys. Modern consumers demand relevant, timely, and contextual value at every single touchpoint.

### 1. Recommender Systems as Core Infrastructure
Today's top-performing digital platforms treat recommendation algorithms not as secondary widgets, but as the foundational architecture of the user experience. By measuring micro-interactions—from scroll dwell time to category filtering—brands present the right product or guide before the shopper explicitly searches for it.

### 2. Zero-Party Data & Transparent Preferences
With third-party tracking restrictions tightening across browsers, digital marketers are transitioning toward zero-party data. By inviting users to directly select their interests during onboarding, brands earn authentic customer trust while drastically boosting relevancy metrics.

### 3. Micro-Moments and Frictionless Discovery
Shoppers no longer browse catalog pages linearly. Instead, discovery happens through curated carousels, contextual "Because you viewed" suggestions, and instant previews. Designing fast, mobile-first interfaces that cater to micro-moments yields up to 3.4x higher conversion rates.
    `
  },
  {
    id: "art-2",
    title: "How Recommendation Systems Work: The Science of Personalization",
    category: "Technology",
    author: "Dr. Vikram Patel",
    date: "2026-03-02",
    readingTime: "8 min read",
    views: 6180,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    summary: "A deep dive into collaborative filtering, content-based matching, and scoring algorithms that power platforms like Netflix, Amazon, and Spotify.",
    body: `
Behind every personalized storefront lies an algorithmic engine that continuously decodes user intent from behavioral signals. Let's break down the mathematical fundamentals that turn clicks into meaningful suggestions.

### Content-Based Filtering
Content-based recommendation evaluates the attributes of items a user has historically enjoyed. If a visitor frequently inspects items with attributes like \`category: Electronics\` or \`brand: SonicWave\`, the engine computes cosine similarity against other products sharing those exact descriptors.

### Collaborative Filtering & Interaction Matrices
Collaborative filtering shifts the lens from item attributes to user cohorts. By identifying "user neighbors" who demonstrate similar browsing and wishlist patterns, the system recommends items liked by peer shoppers that the active user hasn't encountered yet.

### Hybrid Scoring Models
Modern platforms combine both approaches using weighted linear scoring models:
- Direct Interest Match: +5 points
- Category Alignment: +4 points
- Saved Wishlist Affinity: +3 points
- Browsing History Frequency: +3 points
- Customer Satisfaction Rating: +2 points

This blended scoring produces recommendations that feel uncanny yet explainable.
    `
  },
  {
    id: "art-3",
    title: "The Ultimate Guide to Modern Smart Shopping & Saving",
    category: "Shopping",
    author: "Aarav Sharma",
    date: "2026-02-28",
    readingTime: "5 min read",
    views: 3240,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    summary: "Learn how to leverage wishlist alerts, discount cycles, and personalized product recommendations to maximize your shopping budget.",
    body: `
Smart shopping is no longer about clipping coupons—it is about harnessing digital intelligence to buy high-value items at their optimal price points.

### Tracking Price Trends & Seasonal Cycles
E-commerce pricing follows predictable quarterly rhythms. Electronics and productivity accessories peak in discount margins during seasonal clearance cycles. Adding high-consideration items to your digital wishlist allows recommendation engines to alert you whenever discounts reach 30% or higher.

### Prioritizing Durability Over Fast Consumption
Whether choosing an ergonomic laptop stand or premium running shoes, calculate the cost-per-use rather than initial price. Investing in modular, repairable, and multi-functional essentials consistently yields greater long-term satisfaction.
    `
  },
  {
    id: "art-4",
    title: "Best Technology Trends in 2026: From Edge AI to Spatial Audio",
    category: "Technology",
    author: "Elena Rostova",
    date: "2026-02-18",
    readingTime: "7 min read",
    views: 5410,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    summary: "Exploring the groundbreaking consumer electronics, wearable health sensors, and intelligent wireless peripherals defining this year.",
    body: `
The consumer technology landscape has transitioned into an era of ambient intelligence. Devices are getting smaller, battery runtimes are stretching into weeks, and sound processing is becoming spatially dynamic.

### Spatial Audio & Hybrid Acoustic Drivers
Headphones and portable speakers now incorporate multi-channel acoustic processing that dynamically tracks head movements. Whether listening to podcasts or mastering music, real-time DSP delivers immersive concert-hall acoustics in compact personal form factors.

### Low-Power AMOLED & Continuous Health Metrics
Wearables are bridging the gap between stylish accessories and clinical-grade fitness trackers. With advanced PPG sensors measuring optical blood flow, SpO2 saturation, and heart rate variability (HRV), users obtain actionable daily readiness scores.
    `
  },
  {
    id: "art-5",
    title: "How Personalized Marketing Drives 3x Higher Customer Retention",
    category: "Digital Marketing",
    author: "Marcus Chen",
    date: "2026-02-12",
    readingTime: "6 min read",
    views: 2980,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    summary: "Why generic email blasts are dead and how real-time behavioral personalization builds long-lasting customer loyalty.",
    body: `
Customer acquisition costs continue to rise year over year. To maintain sustainable growth, forward-thinking e-commerce leaders are prioritizing customer retention through individualized content and product delivery.

### The Power of Explainable Recommendations
When a customer sees *“Recommended because you saved Wireless Headphones to your Wishlist”*, their trust in the algorithm multiplies. Transparent rationales eliminate the feeling of intrusive surveillance and replace it with helpful curation.

### Dynamic Lifecycle Messaging
Matching marketing touchpoints to actual engagement phases—such as suggesting articles on ergonomics after someone views workstation accessories—keeps users engaged without feeling pressured to purchase immediately.
    `
  },
  {
    id: "art-6",
    title: "Travel Planning Blueprint: Packing Smart and Traveling Light",
    category: "Travel",
    author: "Sophia Martinez",
    date: "2026-02-04",
    readingTime: "5 min read",
    views: 3820,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
    summary: "Master the art of one-bag travel with compression packing cubes, modular carry-ons, and ergonomic essentials.",
    body: `
Navigating crowded international airports and train stations with bulky rolling luggage drains the joy of travel. The one-bag travel movement offers total freedom without sacrificing everyday comfort.

### The Compression Cube Formula
By categorizing garments into dedicated compression pouches—shirts in one, thermal layers in another, toiletries in a leakproof pouch—you maximize volumetric luggage efficiency by over 50%.

### Essential Comfort on Long Flights
A memory foam neck support pillow, noise-cancelling headphones, and a durable stainless steel refillable water bottle turn exhausting red-eye transit into a rejuvenating rest period.
    `
  },
  {
    id: "art-7",
    title: "Fashion Forecast: Sustainable Materials and Minimalist Aesthetics",
    category: "Fashion",
    author: "Aarav Sharma",
    date: "2026-01-29",
    readingTime: "5 min read",
    views: 2650,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    summary: "Why capsule wardrobes, heavyweight organic fabrics, and durable timeless cuts are replacing fast fashion in 2026.",
    body: `
The modern wardrobe is shifting away from seasonal micro-trends toward mindful, high-quality staples that look exceptional year after year.

### Organic Heavyweight Cotton
Garments crafted from 240+ GSM Supima and organic combed cotton hold their structural drape through dozens of wash cycles without pill or shrinkage. Paired with classic washed denim and clean minimalist sneakers, a curated capsule delivers effortless style for any setting.
    `
  },
  {
    id: "art-8",
    title: "Introduction to AI Recommendations: A Beginner’s Guide",
    category: "Technology",
    author: "Dr. Vikram Patel",
    date: "2026-01-20",
    readingTime: "6 min read",
    views: 4890,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1507146426996-ef0538887853?auto=format&fit=crop&w=800&q=80",
    summary: "Demystifying machine intelligence in everyday software: how algorithms learn your tastes and present relevant items.",
    body: `
Recommendation systems are often perceived as mysterious black boxes. However, at their core, they rely on elegant statistical logic. By converting user preferences and item characteristics into mathematical vectors, algorithms measure how closely two points align in conceptual space.
    `
  },
  {
    id: "art-9",
    title: "Customer Engagement Strategies for Modern E-Commerce Platforms",
    category: "Digital Marketing",
    author: "Marcus Chen",
    date: "2026-01-14",
    readingTime: "7 min read",
    views: 3100,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    summary: "Proven tactics to boost session duration, repeat visits, and genuine community feedback across digital storefronts.",
    body: `
Building an engaged customer base requires delivering value beyond the point of purchase. Providing informative buying guides, allowing authentic star reviews, and delivering tailored content creates a thriving community around your brand.
    `
  },
  {
    id: "art-10",
    title: "The Art of Slow Living & Mindful Morning Coffee Brewing",
    category: "Lifestyle",
    author: "Sophia Martinez",
    date: "2026-01-08",
    readingTime: "4 min read",
    views: 2420,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    summary: "Transform your morning routine with artisanal pour-over coffee, fresh estate beans, and calm intentional rituals.",
    body: `
In a fast-paced digital world, dedicating fifteen minutes each morning to the sensory craft of pour-over coffee offers a grounding meditation. Grinding fresh whole beans, watching the coffee bloom under hot water, and savoring clean tasting notes restores balance.
    `
  },
  {
    id: "art-11",
    title: "Content Marketing Basics: Creating High-Converting Digital Assets",
    category: "Digital Marketing",
    author: "Elena Rostova",
    date: "2025-12-28",
    readingTime: "6 min read",
    views: 3500,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    summary: "How to craft educational blog posts, case studies, and buyer guides that organically educate and convert visitors.",
    body: `
Content marketing succeeds when it solves genuine problems for readers. By understanding customer pain points and answering them clearly, brands build authority that naturally guides readers toward relevant products.
    `
  },
  {
    id: "art-12",
    title: "Ergonomics & Wellness: Designing an Optimized Home Workspace",
    category: "Lifestyle",
    author: "Dr. Vikram Patel",
    date: "2025-12-19",
    readingTime: "5 min read",
    views: 4120,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80",
    summary: "Prevent neck strain and eye fatigue with proper monitor height, tactile mechanical keyboards, and ambient desktop lighting.",
    body: `
Remote professionals spend over 2,000 hours per year at their desks. Investing in adjustable aluminum stands, tactile keyboards, and correct eye-level alignment drastically reduces spinal fatigue and boosts daily focus.
    `
  },
  {
    id: "art-13",
    title: "Social Media Marketing Blueprint: Building Organic Communities",
    category: "Digital Marketing",
    author: "Marcus Chen",
    date: "2025-12-10",
    readingTime: "6 min read",
    views: 2890,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    summary: "Why authenticity, interactive polls, and real customer feedback outshine polished corporate ads across social channels.",
    body: `
Audiences have developed immunity to aggressive advertising. Modern brands build engagement through transparent behind-the-scenes content, user-generated showcases, and authentic conversational marketing.
    `
  },
  {
    id: "art-14",
    title: "The Science of Skincare: Understanding Active Ingredients & Barriers",
    category: "Beauty",
    author: "Sophia Martinez",
    date: "2025-11-28",
    readingTime: "5 min read",
    views: 3340,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    summary: "How ceramides, hyaluronic acid, and gentle pH-balanced cleansers work together to protect your natural lipid barrier.",
    body: `
Healthy skin requires a balanced barrier. Over-exfoliating damages the lipid matrix, leading to dryness and irritation. Using pH-friendly gentle cleansers and ceramides restores hydration and natural protection.
    `
  },
  {
    id: "art-15",
    title: "Marathon Preparation: Injury Prevention & Pacing Strategies",
    category: "Sports",
    author: "Aarav Sharma",
    date: "2025-11-15",
    readingTime: "6 min read",
    views: 2190,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80",
    summary: "Training tips for long-distance runners: footwear selection, progressive overload, recovery nutrition, and zone-2 heart rate training.",
    body: `
Long-distance running is an exercise in disciplined pacing. Incorporating responsive cushioned shoes, gradual mileage increases, and consistent recovery days ensures peak performance on race day without overuse injuries.
    `
  },
  {
    id: "art-16",
    title: "Mastering Financial Wellness & Mindful Spending Habits",
    category: "Finance",
    author: "Elena Rostova",
    date: "2025-11-01",
    readingTime: "5 min read",
    views: 3950,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
    summary: "Practical frameworks to balance long-term savings with mindful investments in personal growth and quality essentials.",
    body: `
Financial wellness isn't about extreme deprivation—it is about intentional allocation. By cutting spending on unconscious impulse buys, you free up resources to invest in premium tools and experiences that truly enhance your daily life.
    `
  }
];

// All Available System Categories with Icons & Descriptions
const SEED_CATEGORIES = [
  { id: "cat-1", name: "Electronics", icon: "bi-laptop", count: 5, description: "Smart wearables, audio devices, and computer peripherals." },
  { id: "cat-2", name: "Fashion", icon: "bi-bag", count: 5, description: "Apparel, footwear, backpacks, and everyday accessories." },
  { id: "cat-3", name: "Books", icon: "bi-book", count: 4, description: "Tech guides, digital marketing blueprints, and data science manuals." },
  { id: "cat-4", name: "Beauty", icon: "bi-stars", count: 3, description: "Skin cleansers, ceramides, and daily organic care kits." },
  { id: "cat-5", name: "Sports", icon: "bi-trophy", count: 3, description: "Running shoes, non-slip yoga mats, and smart fitness bands." },
  { id: "cat-6", name: "Travel", icon: "bi-compass", count: 3, description: "Expandable carry-ons, compression cubes, and travel pillows." },
  { id: "cat-7", name: "Food", icon: "bi-cup-hot", count: 2, description: "Specialty coffee beans, pour-over drippers, and artisan treats." },
  { id: "cat-8", name: "Lifestyle", icon: "bi-house-heart", count: 3, description: "Aroma diffusers, desk organizers, and insulated water flasks." }
];

// Default Demo User Account
const DEMO_USER = {
  id: "user-demo-1",
  name: "Alex Johnson",
  email: "alex@example.com",
  age: 26,
  location: "Bangalore, India",
  interests: ["Technology", "Travel", "Books"],
  joinedDate: "2026-01-10",
  status: "Active"
};

// Default Demo Admin Account
const DEMO_ADMIN = {
  id: "admin-1",
  name: "Chief Marketing Officer",
  email: "admin@smartrecommend.com",
  password: "admin123",
  role: "Administrator"
};

// Seed Feedback Entries for Demonstration
const SEED_FEEDBACK = [
  {
    id: "fb-1",
    user: "Alex Johnson",
    email: "alex@example.com",
    targetType: "product",
    targetName: "Aura Pro Wireless Headphones",
    rating: 5,
    comment: "The noise cancellation and battery life exceeded my expectations. Outstanding recommendation!",
    date: "2026-03-12",
    status: "Reviewed"
  },
  {
    id: "fb-2",
    user: "Priya Sundaram",
    email: "priya.s@example.com",
    targetType: "content",
    targetName: "How Recommendation Systems Work",
    rating: 5,
    comment: "Extremely clear explanation of collaborative filtering and linear scoring systems. Great read!",
    date: "2026-03-15",
    status: "Resolved"
  },
  {
    id: "fb-3",
    user: "Rahul Mehta",
    email: "rahul.m@example.com",
    targetType: "product",
    targetName: "Wanderlust 40L Travel Backpack",
    rating: 4,
    comment: "Great compartments and materials. Would love to see additional color options like navy or olive.",
    date: "2026-03-18",
    status: "New"
  }
];

// Seed Registered Users for Admin Management
const SEED_USERS = [
  {
    id: "user-101",
    name: "Alex Johnson",
    email: "alex@example.com",
    interests: ["Technology", "Travel", "Books"],
    joinedDate: "2026-01-10",
    activityCount: { viewed: 24, wishlist: 8, content: 15, ratings: 7 },
    status: "Active"
  },
  {
    id: "user-102",
    name: "Priya Sundaram",
    email: "priya.s@example.com",
    interests: ["Beauty", "Fashion", "Lifestyle"],
    joinedDate: "2026-01-22",
    activityCount: { viewed: 18, wishlist: 4, content: 9, ratings: 3 },
    status: "Active"
  },
  {
    id: "user-103",
    name: "Rahul Mehta",
    email: "rahul.m@example.com",
    interests: ["Sports", "Technology", "Travel"],
    joinedDate: "2026-02-05",
    activityCount: { viewed: 32, wishlist: 12, content: 20, ratings: 11 },
    status: "Active"
  },
  {
    id: "user-104",
    name: "Ananya Deshmukh",
    email: "ananya.d@example.com",
    interests: ["Books", "Food", "Lifestyle"],
    joinedDate: "2026-02-18",
    activityCount: { viewed: 14, wishlist: 3, content: 11, ratings: 4 },
    status: "Active"
  },
  {
    id: "user-105",
    name: "Vikram Sengupta",
    email: "vikram.s@example.com",
    interests: ["Technology", "Sports"],
    joinedDate: "2026-03-01",
    activityCount: { viewed: 7, wishlist: 2, content: 5, ratings: 1 },
    status: "Disabled"
  }
];

/**
 * Initialize LocalStorage with default seeds if not already populated.
 */
function initMockDatabase() {
  if (!localStorage.getItem("smartProducts")) {
    localStorage.setItem("smartProducts", JSON.stringify(SEED_PRODUCTS));
  }
  if (!localStorage.getItem("smartContent")) {
    localStorage.setItem("smartContent", JSON.stringify(SEED_CONTENT));
  }
  if (!localStorage.getItem("smartCategories")) {
    localStorage.setItem("smartCategories", JSON.stringify(SEED_CATEGORIES));
  }
  if (!localStorage.getItem("smartFeedback")) {
    localStorage.setItem("smartFeedback", JSON.stringify(SEED_FEEDBACK));
  }
  if (!localStorage.getItem("smartUsers")) {
    localStorage.setItem("smartUsers", JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem("smartWishlist")) {
    localStorage.setItem("smartWishlist", JSON.stringify(["prod-1", "prod-2", "prod-8"]));
  }
  if (!localStorage.getItem("smartRecentlyViewed")) {
    localStorage.setItem("smartRecentlyViewed", JSON.stringify(["prod-1", "prod-4", "prod-11", "prod-21"]));
  }
  if (!localStorage.getItem("smartContentHistory")) {
    localStorage.setItem("smartContentHistory", JSON.stringify(["art-1", "art-2", "art-4"]));
  }
  if (!localStorage.getItem("smartRatings")) {
    localStorage.setItem("smartRatings", JSON.stringify({ "prod-1": 5, "prod-4": 5, "art-1": 5, "art-2": 5 }));
  }
  if (!localStorage.getItem("smartPreferences")) {
    localStorage.setItem("smartPreferences", JSON.stringify(["Technology", "Travel", "Books"]));
  }
  if (!localStorage.getItem("smartUser")) {
    localStorage.setItem("smartUser", JSON.stringify(DEMO_USER));
    localStorage.setItem("smartLogin", "true");
  }
}

// Auto-run database seed initialization
initMockDatabase();
