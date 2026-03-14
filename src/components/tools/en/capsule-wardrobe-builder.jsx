'use client';
import { useState, useRef } from "react";

const CLIMATES = [
  { id: "cold_spring", label: "Cold Spring", emoji: "🧣", desc: "Still chilly, 35-55°F", layers: "heavy" },
  { id: "cool_spring", label: "Cool Spring", emoji: "🌤️", desc: "Mild, 50-65°F", layers: "medium" },
  { id: "warm_spring", label: "Warm Spring", emoji: "☀️", desc: "Getting warm, 60-75°F", layers: "light" },
  { id: "hot_spring", label: "Hot Spring", emoji: "🔥", desc: "Already hot, 75°F+", layers: "minimal" },
];

const STYLES = [
  { id: "classic", label: "Classic / Timeless", emoji: "👔", desc: "Clean lines, neutral tones, never out of style" },
  { id: "casual", label: "Casual / Relaxed", emoji: "👕", desc: "Comfortable, easy-going, weekend vibes" },
  { id: "trendy", label: "Trendy / Fashion-Forward", emoji: "✨", desc: "Current trends, bold choices, statement pieces" },
  { id: "minimal", label: "Minimalist", emoji: "⬜", desc: "Simple, monochrome, less is more" },
  { id: "boho", label: "Boho / Free Spirit", emoji: "🌻", desc: "Flowy, earthy, prints and textures" },
  { id: "preppy", label: "Preppy / Polished", emoji: "⛵", desc: "Crisp, put-together, smart-casual" },
];

const BUDGETS = [
  { id: "thrift", label: "Thrifty", emoji: "💰", desc: "Under $200 total", perItem: "$10-25" },
  { id: "moderate", label: "Moderate", emoji: "💳", desc: "$200-500 total", perItem: "$25-60" },
  { id: "invest", label: "Investment", emoji: "💎", desc: "$500+ total", perItem: "$60-150+" },
];

const GENDER = [
  { id: "women", label: "Women's", emoji: "👩" },
  { id: "men", label: "Men's", emoji: "👨" },
  { id: "neutral", label: "Gender Neutral", emoji: "🧑" },
];

const CAPSULE_DATA = {
  women: {
    classic: {
      tops: [
        { name: "White button-down shirt", essential: true, color: "white", versatility: "Tuck into jeans, layer under blazer, tie at waist", care: "Machine wash cold, hang dry" },
        { name: "Breton stripe top", essential: true, color: "navy/white", versatility: "Jeans, skirts, under blazer — effortlessly chic", care: "Machine wash, reshape while damp" },
        { name: "Fitted crew-neck tee (white)", essential: true, color: "white", versatility: "The foundation piece — goes with literally everything", care: "Machine wash cold" },
        { name: "Fitted crew-neck tee (navy)", essential: false, color: "navy", versatility: "Swap with white tee for variety", care: "Machine wash cold" },
        { name: "Silk or satin camisole", essential: false, color: "blush/cream", versatility: "Layer under blazer for evening, pair with wide-leg pants", care: "Hand wash or delicate cycle" },
      ],
      bottoms: [
        { name: "Straight-leg mid-rise jeans", essential: true, color: "medium wash", versatility: "Your daily workhorse — dress up or down", care: "Wash inside out, cold, infrequently" },
        { name: "Tailored wide-leg trousers", essential: true, color: "khaki/beige", versatility: "Office, brunch, date night — incredibly versatile", care: "Machine wash or dry clean" },
        { name: "A-line midi skirt", essential: false, color: "olive or navy", versatility: "Tee + sneakers casual, blouse + heels dressy", care: "Machine wash cold" },
      ],
      layers: [
        { name: "Cotton or linen blazer", essential: true, color: "beige/tan", versatility: "Instantly elevates any outfit — jeans to dresses", care: "Dry clean or steam at home" },
        { name: "Lightweight knit cardigan", essential: true, color: "cream/oatmeal", versatility: "Office AC, cool mornings, cozy evenings", care: "Hand wash, lay flat to dry" },
        { name: "Denim jacket", essential: false, color: "medium wash", versatility: "The casual layer — dresses, skirts, tees", care: "Machine wash cold, infrequently" },
      ],
      dresses: [
        { name: "Wrap dress or shirt dress", essential: true, color: "solid or subtle print", versatility: "One piece outfit — add sneakers or heels", care: "Machine wash, hang dry" },
      ],
      shoes: [
        { name: "White leather sneakers", essential: true, color: "white", versatility: "Jeans, dresses, skirts — the universal shoe", care: "Wipe clean, magic eraser for scuffs" },
        { name: "Nude or tan ballet flats", essential: true, color: "nude/tan", versatility: "Polished but comfortable — elongates the leg", care: "Leather conditioner quarterly" },
        { name: "Low-heel ankle boots", essential: false, color: "tan or black", versatility: "Jeans, dresses, skirts — cooler day essential", care: "Weatherproof spray, leather conditioner" },
      ],
      accessories: [
        { name: "Structured tote bag", essential: true, color: "cognac/tan", versatility: "Work, errands, travel — carries everything", care: "Leather conditioner, stuff when storing" },
        { name: "Lightweight scarf", essential: false, color: "print or solid accent", versatility: "Neck, hair, bag — instant outfit upgrade", care: "Hand wash or dry clean" },
        { name: "Simple gold or silver jewelry set", essential: true, color: "gold or silver", versatility: "Small hoops + pendant necklace + thin bracelet", care: "Store separately, avoid moisture" },
      ],
    },
    casual: {
      tops: [
        { name: "Oversized cotton tee (white)", essential: true, color: "white", versatility: "Front tuck, knot, or loose — always works", care: "Machine wash cold" },
        { name: "Relaxed linen button-up", essential: true, color: "light blue or sage", versatility: "Open over tank, tied at waist, tucked into shorts", care: "Machine wash, embrace the wrinkles" },
        { name: "Graphic tee (vintage style)", essential: false, color: "any", versatility: "Band tee or retro print — adds personality", care: "Wash inside out to protect print" },
        { name: "Ribbed tank top", essential: true, color: "black or white", versatility: "Base layer or standalone — simple and essential", care: "Machine wash cold" },
        { name: "French terry sweatshirt", essential: false, color: "heather grey", versatility: "The elevated loungewear piece — looks put together", care: "Machine wash cold, tumble dry low" },
      ],
      bottoms: [
        { name: "High-waist mom jeans", essential: true, color: "light wash", versatility: "Cuff them, belt them — spring denim staple", care: "Wash inside out, infrequently" },
        { name: "Drawstring linen pants", essential: true, color: "natural/sand", versatility: "Airy and relaxed — errands to beach", care: "Machine wash, line dry" },
        { name: "Denim shorts (mid-length)", essential: false, color: "medium wash", versatility: "For warmer days — any top works", care: "Machine wash cold" },
      ],
      layers: [
        { name: "Oversized denim jacket", essential: true, color: "medium wash", versatility: "The ultimate casual layer — never wrong", care: "Machine wash cold, air dry" },
        { name: "Lightweight hoodie (zip-up)", essential: false, color: "sage or dusty rose", versatility: "Morning walks, evening chill, travel layer", care: "Machine wash cold" },
        { name: "Utility/field jacket", essential: true, color: "olive/army green", versatility: "Tee + jeans + this = perfect spring outfit", care: "Machine wash, hang dry" },
      ],
      dresses: [
        { name: "Cotton t-shirt dress", essential: true, color: "stripe or solid", versatility: "One and done — add sneakers and go", care: "Machine wash cold" },
      ],
      shoes: [
        { name: "Canvas sneakers (Converse-style)", essential: true, color: "white or natural", versatility: "Jeans, dresses, shorts — the casual classic", care: "Spot clean, machine wash occasionally" },
        { name: "Slide sandals", essential: true, color: "tan/brown", versatility: "The warm-day easy shoe — effortless", care: "Wipe clean" },
        { name: "Retro running sneakers", essential: false, color: "neutral with color pop", versatility: "Athleisure to casual — trendy comfort", care: "Spot clean, air dry" },
      ],
      accessories: [
        { name: "Canvas tote bag", essential: true, color: "natural or stripe", versatility: "Farmers market, beach, daily carry", care: "Machine wash" },
        { name: "Baseball cap or bucket hat", essential: false, color: "washed denim or neutral", versatility: "Sun protection + instant cool factor", care: "Spot clean" },
        { name: "Simple stacking bracelets", essential: false, color: "mixed metals or beaded", versatility: "Adds personality without trying too hard", care: "Remove before water" },
      ],
    },
    trendy: {
      tops: [
        { name: "Cropped cardigan (worn as top)", essential: true, color: "butter yellow or lavender", versatility: "Buttoned up as a top or layered open", care: "Hand wash cold" },
        { name: "Ribbed mock-neck top", essential: true, color: "cream or black", versatility: "Sleek base for statement bottoms", care: "Machine wash cold" },
        { name: "Puff-sleeve blouse", essential: true, color: "white or ditsy floral", versatility: "Dresses up jeans instantly — feminine touch", care: "Machine wash delicate" },
        { name: "Mesh or sheer layer top", essential: false, color: "black", versatility: "Layer over bralette for evening/going out", care: "Hand wash" },
        { name: "Boxy crop tee", essential: false, color: "pastel tie-dye or solid", versatility: "High-waist bottoms — shows just a sliver", care: "Machine wash cold" },
      ],
      bottoms: [
        { name: "Wide-leg jeans", essential: true, color: "medium or dark wash", versatility: "The It silhouette — balances fitted tops", care: "Wash inside out, cold" },
        { name: "Tailored bermuda shorts", essential: false, color: "ecru or light khaki", versatility: "Elevated shorts — blazer + these = spring power move", care: "Machine wash cold" },
        { name: "Satin midi skirt", essential: true, color: "champagne or sage", versatility: "Day to night — tee for casual, blouse for evening", care: "Dry clean or hand wash" },
      ],
      layers: [
        { name: "Oversized blazer", essential: true, color: "check pattern or bold color", versatility: "The statement piece — transforms any outfit", care: "Dry clean or steam" },
        { name: "Cropped trench coat", essential: false, color: "classic tan or unexpected color", versatility: "The spring outerwear moment", care: "Dry clean" },
        { name: "Knit vest", essential: true, color: "cream or argyle", versatility: "Over button-down or tee — layering star", care: "Hand wash, lay flat" },
      ],
      dresses: [
        { name: "Cut-out midi dress", essential: true, color: "bold solid or abstract print", versatility: "Head-turner — minimal accessories needed", care: "Check label — varies" },
      ],
      shoes: [
        { name: "Chunky platform sneakers", essential: true, color: "white or cream", versatility: "Height + comfort + style", care: "Spot clean" },
        { name: "Strappy kitten heels", essential: true, color: "metallic or bold color", versatility: "Elevates jeans, perfects dresses", care: "Store with tissue, leather conditioner" },
        { name: "Slingback flats", essential: false, color: "patent or two-tone", versatility: "The elevated flat — polished and current", care: "Wipe clean" },
      ],
      accessories: [
        { name: "Statement sunglasses", essential: true, color: "acetate — bold shape", versatility: "Face jewelry — the instant outfit maker", care: "Use a case, clean with microfiber" },
        { name: "Chain-link or sculptural bag", essential: true, color: "silver or gold-toned", versatility: "Small but mighty — the finishing touch", care: "Store stuffed, avoid scratches" },
        { name: "Layered gold necklaces", essential: false, color: "gold", versatility: "Choker + pendant + long chain — neck party", care: "Remove before shower" },
      ],
    },
    minimal: {
      tops: [
        { name: "Perfect white tee (quality cotton)", essential: true, color: "white", versatility: "The uniform base — invest in a great one", care: "Machine wash cold, hang dry" },
        { name: "Black fitted turtleneck (lightweight)", essential: true, color: "black", versatility: "Sleek foundation — trousers, jeans, skirts", care: "Machine wash cold" },
        { name: "Silk button-down", essential: true, color: "ivory or light grey", versatility: "Tucked in or out — quiet luxury", care: "Hand wash or dry clean" },
        { name: "Ribbed long-sleeve tee", essential: false, color: "charcoal", versatility: "Between-season staple — not too hot, not too cold", care: "Machine wash cold" },
      ],
      bottoms: [
        { name: "Straight-leg black trousers", essential: true, color: "black", versatility: "Your most-worn piece — everything matches", care: "Machine wash or dry clean" },
        { name: "Medium-wash slim jeans", essential: true, color: "medium indigo", versatility: "The one pair of jeans you need", care: "Wash rarely, inside out" },
        { name: "Tailored shorts", essential: false, color: "black or navy", versatility: "Warm days — same clean aesthetic", care: "Machine wash cold" },
      ],
      layers: [
        { name: "Unstructured wool blazer", essential: true, color: "charcoal or camel", versatility: "The only layer you need — refined and easy", care: "Dry clean or steam" },
        { name: "Cashmere crewneck sweater", essential: true, color: "grey or camel", versatility: "Shoulders-draped or worn straight — always right", care: "Hand wash cold, lay flat" },
      ],
      dresses: [
        { name: "Column midi dress", essential: true, color: "black or navy", versatility: "Clean silhouette — sneakers or heels", care: "Machine wash cold" },
      ],
      shoes: [
        { name: "Leather loafers", essential: true, color: "black", versatility: "The minimalist's statement shoe", care: "Leather conditioner, shoe trees" },
        { name: "White leather sneakers", essential: true, color: "white", versatility: "Clean lines — the only casual shoe needed", care: "Magic eraser, wipe often" },
      ],
      accessories: [
        { name: "Structured leather bag", essential: true, color: "black", versatility: "One perfect bag — no logo, clean design", care: "Leather conditioner quarterly" },
        { name: "One quality watch or bracelet", essential: true, color: "silver or gold", versatility: "The only jewelry piece — make it count", care: "Store in box" },
      ],
    },
    boho: {
      tops: [
        { name: "Embroidered peasant blouse", essential: true, color: "white with color embroidery", versatility: "The boho signature — jeans, skirts, shorts", care: "Hand wash or delicate cycle" },
        { name: "Flowy cami with lace trim", essential: true, color: "terracotta or rust", versatility: "Layer under kimono or wear solo", care: "Hand wash cold" },
        { name: "Oversized linen shirt", essential: true, color: "natural/undyed", versatility: "Beach cover-up, open layer, or tucked in", care: "Machine wash, air dry" },
        { name: "Tie-front crop top", essential: false, color: "mustard or sage", versatility: "High-waist skirts and pants — effortless", care: "Machine wash cold" },
        { name: "Crochet or knit tank", essential: false, color: "cream or multi", versatility: "Festival-ready or beach-day perfect", care: "Hand wash, lay flat" },
      ],
      bottoms: [
        { name: "High-waist flare jeans", essential: true, color: "dark or medium wash", versatility: "The boho jean — elongates, flows beautifully", care: "Wash inside out, cold" },
        { name: "Printed maxi skirt", essential: true, color: "paisley or floral mix", versatility: "The statement bottom — simple top is all you need", care: "Machine wash cold" },
        { name: "Relaxed wide-leg pants", essential: false, color: "olive or terracotta", versatility: "Breezy alternative to jeans on warm days", care: "Machine wash" },
      ],
      layers: [
        { name: "Fringed kimono", essential: true, color: "print or solid earth tone", versatility: "THE boho layer — over everything", care: "Hand wash or dry clean" },
        { name: "Suede or faux-suede vest", essential: false, color: "tan or brown", versatility: "70s vibes — adds dimension to any outfit", care: "Spot clean only" },
        { name: "Lightweight crochet cardigan", essential: true, color: "cream or multi", versatility: "Airy layer that doesn't hide the outfit", care: "Hand wash, lay flat" },
      ],
      dresses: [
        { name: "Tiered maxi dress", essential: true, color: "floral print", versatility: "One piece magic — sandals and done", care: "Machine wash cold" },
      ],
      shoes: [
        { name: "Leather or suede ankle boots", essential: true, color: "tan/cognac", versatility: "The boho essential — dresses, jeans, skirts", care: "Weatherproof, condition leather" },
        { name: "Woven slide sandals", essential: true, color: "natural/tan", versatility: "Warm-day go-to — artisan feel", care: "Wipe clean, air dry" },
        { name: "Embroidered mules", essential: false, color: "multi/colorful", versatility: "The fun shoe — plain outfit + these = done", care: "Spot clean" },
      ],
      accessories: [
        { name: "Woven or macramé crossbody", essential: true, color: "natural/multi", versatility: "Hands-free and bohemian — markets, walks, festivals", care: "Spot clean" },
        { name: "Layered necklaces (mixed metals/stones)", essential: true, color: "gold + turquoise or amber", versatility: "The boho signature accessory", care: "Remove before water" },
        { name: "Wide-brim sun hat", essential: false, color: "natural straw", versatility: "Sun protection + ultimate boho accessory", care: "Store on hat form, spot clean" },
      ],
    },
    preppy: {
      tops: [
        { name: "Oxford button-down (fitted)", essential: true, color: "light blue", versatility: "Under sweater, with chinos, with skirt — the prep staple", care: "Machine wash, iron or steam" },
        { name: "Fitted polo shirt", essential: true, color: "white or navy", versatility: "Chinos, jeans, or tennis skirt", care: "Machine wash cold" },
        { name: "Striped boat-neck top", essential: true, color: "navy/white stripe", versatility: "Nautical charm — jeans to shorts", care: "Machine wash cold" },
        { name: "Pastel crewneck tee", essential: false, color: "mint or blush", versatility: "Layer under blazer or pair with white jeans", care: "Machine wash cold" },
      ],
      bottoms: [
        { name: "Chino pants (slim fit)", essential: true, color: "khaki/camel", versatility: "The preppy workhorse — blazer or polo", care: "Machine wash, iron for crispness" },
        { name: "Dark straight-leg jeans", essential: true, color: "dark indigo", versatility: "Dressed-up denim — blazer + loafers", care: "Wash inside out, rarely" },
        { name: "Pleated tennis skirt or A-line", essential: false, color: "white or navy", versatility: "Playful but polished — polo + this = classic", care: "Machine wash cold" },
      ],
      layers: [
        { name: "Cotton or linen blazer", essential: true, color: "navy", versatility: "THE preppy layer — over everything", care: "Dry clean or steam" },
        { name: "V-neck cotton sweater", essential: true, color: "cable knit cream or pastel", versatility: "Over button-down or on its own", care: "Hand wash, lay flat" },
        { name: "Quilted vest", essential: false, color: "navy or hunter green", versatility: "Weekend layer — active prep vibes", care: "Machine wash, hang dry" },
      ],
      dresses: [
        { name: "Fit-and-flare shirt dress", essential: true, color: "stripe or gingham", versatility: "Belt it, add flats — instant polish", care: "Machine wash cold" },
      ],
      shoes: [
        { name: "Leather loafers or penny loafers", essential: true, color: "cognac or burgundy", versatility: "Chinos, jeans, skirts — the prep essential", care: "Leather conditioner, shoe trees" },
        { name: "Classic white sneakers (leather)", essential: true, color: "white", versatility: "Tennis-inspired — keeps it sporty-smart", care: "Wipe clean regularly" },
        { name: "Boat shoes or espadrilles", essential: false, color: "tan/navy", versatility: "Weekend and coastal vibes", care: "Spot clean, air dry" },
      ],
      accessories: [
        { name: "Leather belt with brass buckle", essential: true, color: "cognac or navy ribbon", versatility: "Finishes every outfit — don't skip this", care: "Leather conditioner" },
        { name: "Pearl studs or simple gold hoops", essential: true, color: "pearl or gold", versatility: "Understated elegance — daily wear", care: "Store in jewelry box" },
        { name: "Structured crossbody or satchel", essential: false, color: "tan or navy", versatility: "Polished and practical", care: "Leather conditioner" },
      ],
    },
  },
  men: {
    classic: {
      tops: [
        { name: "White Oxford button-down", essential: true, color: "white", versatility: "Tuck, roll sleeves, layer — the essential shirt", care: "Machine wash, iron" },
        { name: "Light blue dress shirt", essential: true, color: "light blue", versatility: "Slightly less formal than white — just as versatile", care: "Machine wash, iron" },
        { name: "Crew-neck tee (white)", essential: true, color: "white", versatility: "Under everything or standalone — get 2-3", care: "Machine wash cold" },
        { name: "Crew-neck tee (navy)", essential: false, color: "navy", versatility: "The dark tee option — chinos or jeans", care: "Machine wash cold" },
        { name: "Henley (long-sleeve)", essential: false, color: "heather grey", versatility: "One step up from a tee — rolled sleeves for spring", care: "Machine wash cold" },
      ],
      bottoms: [
        { name: "Slim straight dark jeans", essential: true, color: "dark indigo", versatility: "Dress up or down — the one jean you need", care: "Wash inside out, rarely" },
        { name: "Chinos", essential: true, color: "khaki/sand", versatility: "Office, date night, weekend — all-purpose", care: "Machine wash cold, iron" },
        { name: "Chino shorts (9\" inseam)", essential: false, color: "navy or khaki", versatility: "Warm days — polo or tee + these", care: "Machine wash cold" },
      ],
      layers: [
        { name: "Unstructured cotton blazer", essential: true, color: "navy", versatility: "Jeans + tee + this = instant upgrade", care: "Dry clean or steam" },
        { name: "Lightweight crewneck sweater", essential: true, color: "grey or camel", versatility: "Over button-down or tee — spring layering king", care: "Hand wash, lay flat" },
        { name: "Cotton bomber or Harrington jacket", essential: false, color: "olive or navy", versatility: "The casual spring outer layer", care: "Machine wash cold" },
      ],
      shoes: [
        { name: "White leather sneakers", essential: true, color: "white", versatility: "Chinos, jeans, even with a blazer", care: "Wipe clean, magic eraser" },
        { name: "Leather desert boots", essential: true, color: "tan suede", versatility: "The bridge between casual and dressed up", care: "Suede brush, waterproof spray" },
        { name: "Brown leather loafers", essential: false, color: "brown", versatility: "No-socks spring look with chinos", care: "Leather conditioner, shoe trees" },
      ],
      accessories: [
        { name: "Leather belt", essential: true, color: "brown", versatility: "Match to shoes roughly — one good belt goes far", care: "Leather conditioner yearly" },
        { name: "Quality sunglasses", essential: true, color: "tortoise or matte black", versatility: "Wayfarers or aviators — timeless shapes", care: "Use a case always" },
        { name: "Simple watch", essential: false, color: "leather strap or steel", versatility: "The one accessory every man should own", care: "Service every few years" },
      ],
    },
    casual: {
      tops: [
        { name: "Washed cotton tee (white)", essential: true, color: "white", versatility: "Soft, broken-in feel — daily uniform", care: "Machine wash cold" },
        { name: "Short-sleeve camp collar shirt", essential: true, color: "sage, dusty blue, or muted print", versatility: "The cool casual shirt — untucked, relaxed", care: "Machine wash, hang dry" },
        { name: "Vintage-wash graphic tee", essential: false, color: "any", versatility: "Band, retro, or surf — personality piece", care: "Wash inside out" },
        { name: "Linen blend short-sleeve shirt", essential: true, color: "natural or light olive", versatility: "Beach to bar to backyard — breezy and cool", care: "Machine wash, embrace wrinkles" },
        { name: "French terry crewneck", essential: false, color: "heather grey or washed navy", versatility: "Elevated sweats energy — looks put together", care: "Machine wash cold" },
      ],
      bottoms: [
        { name: "Relaxed taper jeans", essential: true, color: "light wash or faded", versatility: "Modern casual fit — comfortable but intentional", care: "Wash inside out, rarely" },
        { name: "Drawstring chinos or jogger pants", essential: true, color: "olive or sand", versatility: "Comfort of sweats, look of pants", care: "Machine wash cold" },
        { name: "6-7\" swim-to-street shorts", essential: false, color: "navy or terracotta", versatility: "Pool, beach, or just hanging out", care: "Rinse after salt/chlorine" },
      ],
      layers: [
        { name: "Trucker denim jacket", essential: true, color: "medium wash", versatility: "The casual MVP — tee + jeans + this forever", care: "Machine wash cold, air dry" },
        { name: "Lightweight zip hoodie", essential: true, color: "charcoal or olive", versatility: "Morning runs, evening fires, travel layer", care: "Machine wash cold" },
        { name: "Coaches jacket or windbreaker", essential: false, color: "navy or black", versatility: "Rain protection without bulk", care: "Machine wash, hang dry" },
      ],
      shoes: [
        { name: "Retro running sneakers", essential: true, color: "grey/navy with gum sole", versatility: "New Balance, Saucony vibes — comfort + style", care: "Spot clean" },
        { name: "Canvas slip-ons", essential: true, color: "natural or navy", versatility: "The no-effort shoe — shorts and tees", care: "Machine wash" },
        { name: "Suede Birkenstock-style sandals", essential: false, color: "taupe", versatility: "Warm-day essential — socks optional (but trendy)", care: "Suede brush" },
      ],
      accessories: [
        { name: "Woven fabric belt", essential: false, color: "olive or multi", versatility: "Casual alternative to leather — relaxed feel", care: "Machine wash" },
        { name: "Dad cap / baseball hat", essential: true, color: "washed denim or earth tone", versatility: "Bad hair day hero + sun protection", care: "Spot clean" },
        { name: "Everyday sunglasses", essential: true, color: "matte black or tortoise", versatility: "Don't overthink it — just wear them daily", care: "Use a case" },
      ],
    },
  },
  neutral: {
    classic: {
      tops: [
        { name: "Relaxed Oxford button-down", essential: true, color: "white", versatility: "Size-inclusive staple — tuck or untuck", care: "Machine wash, iron" },
        { name: "Fitted crew-neck tee (2-pack)", essential: true, color: "white + black", versatility: "Foundation pieces — layer or wear solo", care: "Machine wash cold" },
        { name: "Breton stripe top", essential: true, color: "navy/white", versatility: "Timeless pattern that works on everyone", care: "Machine wash cold" },
        { name: "Chambray button-down", essential: false, color: "light indigo", versatility: "Softer than denim, more casual than Oxford", care: "Machine wash cold" },
      ],
      bottoms: [
        { name: "Straight-leg jeans", essential: true, color: "medium wash", versatility: "Universal fit — works on every body", care: "Wash inside out, cold" },
        { name: "Relaxed chinos", essential: true, color: "khaki or olive", versatility: "Dressier than jeans, still comfortable", care: "Machine wash cold" },
        { name: "Elastic-waist tailored pants", essential: false, color: "black or navy", versatility: "Comfort meets polish — hidden elastic is genius", care: "Machine wash" },
      ],
      layers: [
        { name: "Unstructured blazer", essential: true, color: "navy or charcoal", versatility: "Elevates everything — no shoulder pads needed", care: "Dry clean or steam" },
        { name: "Crewneck knit sweater", essential: true, color: "oatmeal or grey", versatility: "The cozy-but-polished layer", care: "Hand wash, lay flat" },
        { name: "Chore coat / utility jacket", essential: false, color: "olive or tan", versatility: "Structured but relaxed — great pockets too", care: "Machine wash cold" },
      ],
      shoes: [
        { name: "White leather sneakers", essential: true, color: "white", versatility: "Goes with literally everything", care: "Wipe clean regularly" },
        { name: "Chelsea boots", essential: true, color: "black or tan", versatility: "Pull-on, gender-neutral, effortlessly cool", care: "Leather conditioner, weatherproof" },
        { name: "Birkenstock-style sandals", essential: false, color: "black or taupe", versatility: "Warm-day essential — comfort is king", care: "Wipe clean" },
      ],
      accessories: [
        { name: "Minimalist leather bag", essential: true, color: "black or tan", versatility: "Crossbody or tote — clean lines, no logos", care: "Leather conditioner" },
        { name: "Simple watch", essential: false, color: "black or silver", versatility: "One timepiece, always appropriate", care: "Store in box" },
        { name: "Quality sunglasses", essential: true, color: "black or tortoise", versatility: "Classic shape — wayfarers are universally flattering", care: "Always use a case" },
      ],
    },
  },
};

const COLD_ADDITIONS = [
  { name: "Wool or cashmere beanie", color: "grey or black", reason: "Keeps you warm without ruining your hair (much)" },
  { name: "Lightweight down vest", color: "navy or black", reason: "Core warmth without restricting arms — perfect transitional piece" },
  { name: "Merino wool base layer", color: "black", reason: "Invisible warmth layer under everything — not bulky" },
  { name: "Leather gloves (lined)", color: "brown or black", reason: "For those still-freezing mornings" },
];

const HOT_ADDITIONS = [
  { name: "Linen everything", color: "white, natural", reason: "Swap cotton for linen where possible — breathability is key" },
  { name: "Wide-brim hat", color: "straw or light", reason: "Sun protection that actually looks good" },
  { name: "Performance fabric undershirts", color: "skin tone", reason: "Moisture-wicking invisible layer — prevents sweat-throughs" },
];

function getCapsule(gender, style) {
  const genderData = CAPSULE_DATA[gender];
  if (!genderData) {
    const fallback = CAPSULE_DATA.neutral;
    return fallback.classic || fallback[Object.keys(fallback)[0]];
  }
  return genderData[style] || genderData.classic || genderData[Object.keys(genderData)[0]];
}

function countItems(capsule) {
  return Object.values(capsule).reduce((sum, items) => sum + items.length, 0);
}

const CATEGORY_META = {
  tops: { label: "Tops", emoji: "👕" },
  bottoms: { label: "Bottoms", emoji: "👖" },
  layers: { label: "Layers", emoji: "🧥" },
  dresses: { label: "Dresses", emoji: "👗" },
  shoes: { label: "Shoes", emoji: "👟" },
  accessories: { label: "Accessories", emoji: "👜" },
};

export default function CapsuleWardrobeBuilder() {
  const [climate, setClimate] = useState("");
  const [style, setStyle] = useState("");
  const [budget, setBudget] = useState("");
  const [gender, setGender] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [owned, setOwned] = useState({});
  const [expandedCat, setExpandedCat] = useState("tops");
  const resultRef = useRef(null);

  const downloadPDF = (element, filename) => {
    import('html2pdf.js').then((html2pdfModule) => {
      const html2pdf = html2pdfModule.default;
      html2pdf().set({
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(element).save();
    });
  };

  const generate = () => {
    setShowResult(true);
    setOwned({});
    setExpandedCat("tops");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const toggleOwned = (key) => {
    setOwned((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const capsule = showResult ? getCapsule(gender, style) : null;
  const totalItems = capsule ? countItems(capsule) : 0;
  const ownedCount = Object.values(owned).filter(Boolean).length;
  const canGenerate = climate && style && budget && gender;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(155deg, #fce4ec 0%, #fff3e0 25%, #fffde7 50%, #f3e5f5 80%, #e8eaf6 100%)",
        fontFamily: "'Nunito', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap" rel="stylesheet" />

      {["👗", "👟", "🌸", "✨", "🧥", "💐"].map((e, i) => (
        <div key={i} style={{ position: "absolute", top: `${5 + i * 15}%`, [i % 2 ? "right" : "left"]: `${2 + (i % 3) * 2}%`, fontSize: 22, opacity: 0.1, pointerEvents: "none" }}>{e}</div>
      ))}

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>👗🌸✨</div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(26px, 5vw, 38px)", color: "#ad1457", margin: "0 0 8px", textShadow: "2px 2px 0 rgba(255,255,255,0.7)" }}>
            Spring Capsule Wardrobe
          </h1>
          <p style={{ color: "#ec407a", fontSize: 15, margin: 0, fontWeight: 600 }}>
            Build a mix-and-match wardrobe with fewer pieces that work harder
          </p>
        </div>

        <Section num="1" title="Your spring climate?" color="#ad1457">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {CLIMATES.map((c) => (
              <Btn key={c.id} active={climate === c.id} onClick={() => setClimate(c.id)} color="#ad1457">
                <div style={{ fontSize: 22 }}>{c.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{c.label}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{c.desc}</div>
              </Btn>
            ))}
          </div>
        </Section>

        <Section num="2" title="What's your vibe?" color="#ad1457">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {STYLES.map((s) => (
              <Btn key={s.id} active={style === s.id} onClick={() => setStyle(s.id)} color="#ad1457">
                <div style={{ fontSize: 22 }}>{s.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{s.label}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{s.desc}</div>
              </Btn>
            ))}
          </div>
        </Section>

        <Section num="3" title="Budget range?" color="#ad1457">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {BUDGETS.map((b) => (
              <Btn key={b.id} active={budget === b.id} onClick={() => setBudget(b.id)} color="#ad1457" wide>
                <span style={{ fontSize: 22, marginRight: 12 }}>{b.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800 }}>{b.label} — {b.desc}</div>
                  <div style={{ fontSize: 12, opacity: 0.65 }}>~{b.perItem} per piece</div>
                </div>
              </Btn>
            ))}
          </div>
        </Section>

        <Section num="4" title="Shopping for?" color="#ad1457">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {GENDER.map((g) => (
              <Btn key={g.id} active={gender === g.id} onClick={() => setGender(g.id)} color="#ad1457">
                <div style={{ fontSize: 24 }}>{g.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{g.label}</div>
              </Btn>
            ))}
          </div>
        </Section>

        {canGenerate && (
          <button onClick={generate} style={{
            width: "100%", padding: "16px", borderRadius: 16, border: "none",
            background: "linear-gradient(135deg, #ad1457, #ec407a)", color: "#fff",
            fontFamily: "'Fredoka One', cursive", fontSize: 20, cursor: "pointer",
            marginBottom: 24, boxShadow: "0 4px 20px rgba(173,20,87,0.3)", transition: "transform 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            👗 Build My Capsule Wardrobe!
          </button>
        )}

        {showResult && capsule && (
          <div ref={resultRef}>
            <button
              onClick={() => downloadPDF(resultRef.current, 'capsule-wardrobe.pdf')}
              style={{
                width: "100%",
                marginBottom: 16,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #ad1457, #ec407a)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: "0 4px 15px rgba(173,20,87,0.3)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📥 Download as PDF
            </button>
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "20px 24px", marginBottom: 20, border: "2px solid #f8bbd0" }}>
              <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                <MiniStat emoji="👕" value={totalItems} label="Total Pieces" />
                <MiniStat emoji="✅" value={ownedCount} label="Already Own" />
                <MiniStat emoji="🛒" value={totalItems - ownedCount} label="Need to Buy" />
                <MiniStat emoji="🔄" value={`${Math.round(totalItems * (totalItems - 1) * 0.6)}+`} label="Outfit Combos" />
              </div>
              <div style={{ background: "#fce4ec", borderRadius: 10, height: 14, overflow: "hidden" }}>
                <div style={{
                  width: `${totalItems > 0 ? (ownedCount / totalItems) * 100 : 0}%`, height: "100%",
                  background: "linear-gradient(90deg, #ec407a, #ad1457)", borderRadius: 10, transition: "width 0.4s",
                }} />
              </div>
              <p style={{ textAlign: "center", fontSize: 12, color: "#999", margin: "8px 0 0", fontWeight: 600 }}>
                Check off items you already own to see your shopping list
              </p>
            </div>

            {Object.entries(capsule).map(([catKey, items]) => {
              const meta = CATEGORY_META[catKey];
              if (!meta || !items || items.length === 0) return null;
              const isExpanded = expandedCat === catKey;

              return (
                <div key={catKey} style={{ marginBottom: 10 }}>
                  <div
                    onClick={() => setExpandedCat(isExpanded ? null : catKey)}
                    style={{
                      padding: "14px 18px", borderRadius: isExpanded ? "14px 14px 0 0" : 14,
                      background: isExpanded ? "#fce4ec" : "rgba(255,255,255,0.88)",
                      border: isExpanded ? "2px solid #f48fb1" : "2px solid rgba(173,20,87,0.06)",
                      borderBottom: isExpanded ? "none" : undefined,
                      cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: 800, color: isExpanded ? "#ad1457" : "#666", fontSize: 16 }}>
                      {meta.emoji} {meta.label} <span style={{ fontSize: 13, fontWeight: 600, color: "#bbb" }}>({items.length})</span>
                    </span>
                    <span style={{ color: "#ccc", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                  </div>

                  {isExpanded && (
                    <div style={{ border: "2px solid #f48fb1", borderTop: "none", borderRadius: "0 0 14px 14px", padding: "14px 18px", background: "#fffafe" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {items.map((item, i) => {
                          const key = `${catKey}-${i}`;
                          const isOwned = owned[key];

                          return (
                            <div
                              key={i}
                              style={{
                                padding: "14px 16px", borderRadius: 14,
                                background: isOwned ? "#f3e5f5" : "#fff",
                                border: isOwned ? "2px solid #ce93d8" : item.essential ? "2px solid #f8bbd0" : "2px solid #f0f0f0",
                                transition: "all 0.2s",
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontWeight: 800, color: isOwned ? "#999" : "#333", fontSize: 14, textDecoration: isOwned ? "line-through" : "none" }}>
                                      {item.name}
                                    </span>
                                    {item.essential && !isOwned && (
                                      <span style={{ fontSize: 10, fontWeight: 800, color: "#ad1457", background: "#fce4ec", padding: "2px 8px", borderRadius: 6 }}>ESSENTIAL</span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                                    <span style={{ fontWeight: 700, color: "#888" }}>Color:</span> {item.color}
                                  </div>
                                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>
                                    <span style={{ fontWeight: 700 }}>Styling:</span> {item.versatility}
                                  </div>
                                  <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>
                                    <span style={{ fontWeight: 700 }}>Care:</span> {item.care}
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleOwned(key)}
                                  style={{
                                    width: 32, height: 32, borderRadius: "50%",
                                    border: isOwned ? "2px solid #ab47bc" : "2px dashed #e0e0e0",
                                    background: isOwned ? "#ab47bc" : "#fff",
                                    color: isOwned ? "#fff" : "#ddd", fontSize: 14, fontWeight: 800,
                                    cursor: "pointer", display: "flex", alignItems: "center",
                                    justifyContent: "center", flexShrink: 0, marginLeft: 12,
                                  }}
                                  title={isOwned ? "Unmark as owned" : "Mark as owned"}
                                >
                                  {isOwned ? "✓" : ""}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Climate adjustments */}
            {(climate === "cold_spring" || climate === "hot_spring") && (
              <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "22px", marginTop: 16, border: "2px solid #f8bbd0" }}>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", color: "#ad1457", margin: "0 0 12px", fontSize: 18 }}>
                  {climate === "cold_spring" ? "🧣 Cold Spring Add-Ons" : "☀️ Hot Spring Swaps"}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(climate === "cold_spring" ? COLD_ADDITIONS : HOT_ADDITIONS).map((item, i) => (
                    <div key={i} style={{ padding: "10px 14px", background: "#fce4ec", borderRadius: 10, fontSize: 13 }}>
                      <div style={{ fontWeight: 800, color: "#ad1457" }}>{item.name} <span style={{ fontWeight: 600, color: "#999" }}>— {item.color}</span></div>
                      <div style={{ color: "#888", marginTop: 2 }}>{item.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shopping tip */}
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "22px", marginTop: 16, border: "2px solid #e1bee7" }}>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", color: "#7b1fa2", margin: "0 0 12px", fontSize: 18 }}>
                💡 Shopping Strategy
              </h3>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}>
                {budget === "thrift" && (
                  <div>
                    <div style={{ fontWeight: 700, color: "#7b1fa2", marginBottom: 4 }}>Best places for budget capsule pieces:</div>
                    <div>ThriftUp, Goodwill, Poshmark, and Mercari for secondhand finds. Uniqlo, H&M Basics, and Target's A New Day line for affordable new. Focus on essential pieces first — buy the "nice to haves" only after your core wardrobe is set. Check for spring sales in March/April.</div>
                  </div>
                )}
                {budget === "moderate" && (
                  <div>
                    <div style={{ fontWeight: 700, color: "#7b1fa2", marginBottom: 4 }}>Smart moderate spending tips:</div>
                    <div>Invest more in layers and shoes (cost-per-wear is lowest). Save on basics like tees and tanks. Everlane, COS, & Other Stories, and Madewell offer great quality at mid-range prices. Wait for end-of-season sales to stock up on next year's neutrals.</div>
                  </div>
                )}
                {budget === "invest" && (
                  <div>
                    <div style={{ fontWeight: 700, color: "#7b1fa2", marginBottom: 4 }}>Investment wardrobe strategy:</div>
                    <div>Prioritize: shoes, blazer, and bag — these pieces show quality most visibly. Theory, Vince, Reiss, and APC for elevated basics. One luxury piece (a great bag or shoes) anchors the whole wardrobe. Focus on materials: wool, silk, quality leather, and premium cotton will last years.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#f48fb1", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>👗🌸✨</div>
          Spring Capsule Wardrobe — Less closet stress, more outfit confidence!
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, color, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "22px 24px", marginBottom: 20, boxShadow: "0 3px 16px rgba(173,20,87,0.06)", border: "2px solid rgba(173,20,87,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, #ec407a)`, color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{num}</div>
        <h3 style={{ margin: 0, color, fontWeight: 800, fontSize: 16 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Btn({ active, onClick, children, color, wide }) {
  return (
    <button onClick={onClick} style={{
      padding: wide ? "14px 18px" : "14px 10px", borderRadius: 14,
      border: active ? `2px solid ${color}` : "2px solid #e0e0e0",
      background: active ? `${color}10` : "rgba(255,255,255,0.85)",
      color: active ? color : "#777", fontWeight: 700, fontSize: 13,
      cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
      textAlign: wide ? "left" : "center", display: wide ? "flex" : "block", alignItems: "center",
    }}>{children}</button>
  );
}

function MiniStat({ emoji, value, label }) {
  return (
    <div style={{ textAlign: "center", minWidth: 70 }}>
      <div style={{ fontSize: 18 }}>{emoji}</div>
      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: "#ad1457" }}>{value}</div>
      <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>{label}</div>
    </div>
  );
}
