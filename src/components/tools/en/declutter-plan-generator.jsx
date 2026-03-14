'use client';
import { useState, useRef } from "react";

const ROOMS = [
  { id: "bedroom", name: "Bedroom", emoji: "🛏️" },
  { id: "closet", name: "Closet", emoji: "👗" },
  { id: "kitchen", name: "Kitchen", emoji: "🍳" },
  { id: "bathroom", name: "Bathroom", emoji: "🚿" },
  { id: "living", name: "Living Room", emoji: "🛋️" },
  { id: "office", name: "Home Office", emoji: "💼" },
  { id: "garage", name: "Garage", emoji: "🚗" },
  { id: "basement", name: "Basement / Attic", emoji: "📦" },
  { id: "kids", name: "Kids' Room", emoji: "🧸" },
  { id: "dining", name: "Dining Room", emoji: "🍽️" },
  { id: "laundry", name: "Laundry Room", emoji: "🧺" },
  { id: "entryway", name: "Entryway / Mudroom", emoji: "🚪" },
];

const TIME_OPTIONS = [
  { id: "15", label: "15 min/day", emoji: "⚡", desc: "Micro sessions" },
  { id: "30", label: "30 min/day", emoji: "🕐", desc: "Quick & steady" },
  { id: "60", label: "1 hour/day", emoji: "💪", desc: "Solid progress" },
  { id: "120", label: "2+ hours/day", emoji: "🔥", desc: "All in!" },
];

const CLUTTER_LEVELS = [
  { id: "light", label: "Light", emoji: "🌤️", desc: "Mostly organized, just needs a tune-up", mult: 0.6 },
  { id: "moderate", label: "Moderate", emoji: "⛅", desc: "Stuff has piled up, drawers are full", mult: 1.0 },
  { id: "heavy", label: "Heavy", emoji: "🌧️", desc: "Overwhelmed — don't know where to start", mult: 1.5 },
];

const ROOM_TASKS = {
  bedroom: {
    zones: [
      {
        name: "Nightstands & Surfaces",
        tasks: [
          "Remove everything from nightstand surfaces",
          "Sort items: keep daily essentials only (phone charger, lamp, one book)",
          "Toss trash, expired meds, old receipts",
          "Wipe surfaces clean before replacing items",
          "One nightstand drawer: remove all, keep only what you use at bedtime",
        ],
      },
      {
        name: "Under the Bed",
        tasks: [
          "Pull everything out from under the bed",
          "Sort into keep, donate, and trash piles",
          "Vacuum under the bed while it's clear",
          "Only put back intentional storage (bins with lids)",
          "If you forgot it was there, you don't need it — donate it",
        ],
      },
      {
        name: "Dresser & Drawers",
        tasks: [
          "Empty one drawer at a time onto the bed",
          "Remove anything stained, torn, or that doesn't fit",
          "Fold and organize remaining items (KonMari or roll method)",
          "Clear dresser top — keep only 2-3 intentional items",
          "Repeat for each drawer before moving on",
        ],
      },
      {
        name: "Decor & Walls",
        tasks: [
          "Assess wall art and decor — does it still spark joy?",
          "Remove anything you're keeping 'just because'",
          "Consolidate trinkets — one small tray or display only",
          "Check for dusty fake plants, broken frames, outdated photos",
        ],
      },
    ],
  },
  closet: {
    zones: [
      {
        name: "Hanging Clothes",
        tasks: [
          "Face all hangers one direction (the hanger trick starts now!)",
          "Remove anything you haven't worn in 12+ months",
          "Pull out anything that doesn't fit — be honest",
          "Remove damaged, stained, or worn-out items",
          "Group remaining by type: tops, bottoms, dresses, jackets",
        ],
      },
      {
        name: "Shelves & Folded Items",
        tasks: [
          "Pull everything off shelves",
          "Sort: keep, donate, trash",
          "Refold neatly — use shelf dividers if you have them",
          "Store off-season items separately (vacuum bags work great)",
          "Keep frequently used items at eye level",
        ],
      },
      {
        name: "Shoes & Accessories",
        tasks: [
          "Pull out all shoes — lay them out",
          "Toss any that are damaged, uncomfortable, or unworn for a year",
          "Pair everything up — lone shoes get tossed",
          "Organize accessories: belts, scarves, hats — keep what you actually wear",
          "Use a door organizer or clear bins for visibility",
        ],
      },
      {
        name: "Closet Floor & Top Shelf",
        tasks: [
          "Clear the closet floor completely",
          "Vacuum or wipe the floor",
          "Top shelf: pull everything down, sort, only keep seasonal/rare items",
          "Use labeled bins for top shelf storage",
          "Nothing should be just 'shoved up there'",
        ],
      },
    ],
  },
  kitchen: {
    zones: [
      {
        name: "Countertops",
        tasks: [
          "Remove everything from countertops",
          "Only put back daily-use appliances (coffee maker, toaster)",
          "Find cabinet homes for occasional appliances",
          "Toss or relocate decor that just collects grease",
          "Wipe everything down — enjoy the clear space",
        ],
      },
      {
        name: "Pantry & Food Storage",
        tasks: [
          "Pull everything out of the pantry",
          "Check expiration dates — toss anything expired",
          "Consolidate duplicates (3 open bags of rice = 1)",
          "Group by category: baking, cans, snacks, grains",
          "Use clear containers or bins for better visibility",
        ],
      },
      {
        name: "Cabinets & Dishes",
        tasks: [
          "Open every cabinet — assess what you actually use",
          "Remove chipped mugs, mismatched lids, single-use gadgets",
          "Stack smartly — daily dishes front, special occasion back",
          "The 'would I buy this again?' test: if no, donate it",
          "Consolidate food storage containers — match lids to bases, toss orphans",
        ],
      },
      {
        name: "Under the Sink & Junk Drawer",
        tasks: [
          "Pull everything from under the sink",
          "Toss old sponges, expired cleaners, mystery bottles",
          "Organize with a small bin or tension rod",
          "The junk drawer: empty it completely",
          "Keep: scissors, tape, pens, menus. Toss: everything else",
        ],
      },
    ],
  },
  bathroom: {
    zones: [
      {
        name: "Medicine Cabinet & Counter",
        tasks: [
          "Remove everything from the medicine cabinet",
          "Check expiration dates on ALL medications and products",
          "Toss dried-up, expired, or almost-empty products",
          "Keep counter to essentials: soap, toothbrush holder, one lotion",
          "Wipe shelves before replacing items",
        ],
      },
      {
        name: "Under the Sink",
        tasks: [
          "Pull everything out",
          "Toss: old hair products, sample-size bottles you'll never use",
          "Consolidate backstock — do you really need 6 conditioners?",
          "Organize with small bins or a lazy susan",
          "Keep cleaning supplies together, personal care together",
        ],
      },
      {
        name: "Shower & Tub Area",
        tasks: [
          "Remove all bottles from shower",
          "Toss anything nearly empty, expired, or unused",
          "Keep only what you actively use — max 4-5 products",
          "Clean shower caddy or shelf",
          "Replace old loofahs, razors, and shower curtain if needed",
        ],
      },
      {
        name: "Linens & Towels",
        tasks: [
          "Pull out all towels and washcloths",
          "Keep 2 bath towels per person + 2-3 hand towels",
          "Donate or repurpose old, thin, or stained towels (animal shelters love these!)",
          "Fold neatly and organize by type",
          "Store extras in a separate linen closet if possible",
        ],
      },
    ],
  },
  living: {
    zones: [
      {
        name: "Coffee Table & Surfaces",
        tasks: [
          "Clear everything off the coffee table",
          "Keep max 2-3 items: a plant, a candle, one book/remote holder",
          "Sort through magazines, remotes, coasters — keep only current",
          "Do the same for side tables and console tables",
          "Flat surfaces attract clutter — less is more",
        ],
      },
      {
        name: "Entertainment Center / TV Area",
        tasks: [
          "Untangle and organize cables (velcro ties are your friend)",
          "Remove old DVDs, games, or media you'll never use again",
          "Dust and wipe all electronics",
          "Consolidate remotes — do you really need 4?",
          "Clear off any clutter that's migrated to the TV stand",
        ],
      },
      {
        name: "Bookshelves & Display",
        tasks: [
          "Pull all books off — dust the shelves",
          "Sort books: keep favorites, donate read-and-done",
          "Curate decor — less crowded shelves look way better",
          "Use the one-in-one-out rule going forward",
          "Group books by color or size for visual appeal",
        ],
      },
      {
        name: "Couch & Hidden Spots",
        tasks: [
          "Check between and under all cushions (treasure hunt!)",
          "Remove items stored behind furniture or in corners",
          "Sort throw blankets and pillows — keep 2-3 max",
          "Vacuum couch and under furniture",
          "If you have a storage ottoman, declutter its contents",
        ],
      },
    ],
  },
  office: {
    zones: [
      {
        name: "Desk Surface",
        tasks: [
          "Remove absolutely everything from your desk",
          "Wipe it clean — enjoy the empty desk for a moment",
          "Only put back: computer, lamp, one pen holder, and one personal item",
          "Everything else needs a drawer or shelf home",
          "If it's not used daily, it doesn't live on the desk",
        ],
      },
      {
        name: "Papers & Files",
        tasks: [
          "Gather ALL loose papers into one pile",
          "Sort: action needed, to file, to shred/recycle",
          "Shred old bills, statements, and docs you don't need",
          "Go digital where possible — scan important documents",
          "Create a simple filing system: 5-10 categories max",
        ],
      },
      {
        name: "Desk Drawers",
        tasks: [
          "Empty one drawer at a time",
          "Toss: dried pens, old sticky notes, random cables, mystery items",
          "Keep supplies you actually use in the top drawer",
          "Use small organizers or dividers",
          "One drawer for tech, one for supplies, one for personal",
        ],
      },
      {
        name: "Digital Declutter",
        tasks: [
          "Clear your desktop — file or delete loose files",
          "Unsubscribe from 10 email newsletters you never read",
          "Delete unused apps and bookmarks",
          "Organize downloads folder (or just nuke it)",
          "Empty trash on all devices",
        ],
      },
    ],
  },
  garage: {
    zones: [
      {
        name: "Floor & Walkways",
        tasks: [
          "Clear the garage floor completely (yes, everything)",
          "Sweep or hose down the floor",
          "Only put back what has a designated spot",
          "Create clear walkways and access to car",
          "If it's been on the floor for months, decide now: keep or go",
        ],
      },
      {
        name: "Tools & Equipment",
        tasks: [
          "Gather all tools into one area",
          "Check for duplicates — you don't need 4 hammers",
          "Toss broken or rusted tools",
          "Install pegboard or wall hooks for organization",
          "Group by type: hand tools, power tools, garden tools",
        ],
      },
      {
        name: "Seasonal & Sports Gear",
        tasks: [
          "Pull out all seasonal items (holiday decor, camping, etc.)",
          "Assess: did you use it last season? If not, donate",
          "Label all bins clearly with contents and season",
          "Sports gear audit: toss broken/outgrown equipment",
          "Store seasonal items on high shelves or in back",
        ],
      },
      {
        name: "The 'I Might Need This' Pile",
        tasks: [
          "Be honest: that pile of 'maybe' stuff? Go through it today",
          "If you haven't used it in 2 years, let it go",
          "Old paint cans: keep one touch-up can per room color, dispose of rest",
          "Random hardware, screws, parts: consolidate into one labeled container",
          "Take a photo of sentimental items if you can't keep the item itself",
        ],
      },
    ],
  },
  basement: {
    zones: [
      {
        name: "Storage Boxes & Bins",
        tasks: [
          "Pull out every unlabeled box",
          "Open each one — decide: keep, donate, trash",
          "Relabel everything clearly with contents",
          "Stack by category, not by 'when I put it down here'",
          "If a box hasn't been opened in 3+ years, seriously reconsider it",
        ],
      },
      {
        name: "Sentimental Items",
        tasks: [
          "Give yourself permission: it's OK to let go of some things",
          "Keep your favorite 10-20%, not all of it",
          "Photograph items you want to remember but don't need to keep",
          "Create one 'memory box' per family member — that's the limit",
          "Yearbooks, trophies, old projects: pick the highlights",
        ],
      },
      {
        name: "Old Electronics & Misc",
        tasks: [
          "Gather old electronics: phones, cables, chargers, mystery adapters",
          "Recycle at an e-waste center (don't trash them)",
          "Old VHS tapes, CDs, DVDs: digitize favorites, donate or recycle the rest",
          "Furniture stored 'in case': if it's been here 2+ years, donate",
          "Mystery items: if you can't identify it, you don't need it",
        ],
      },
      {
        name: "Maintenance Check",
        tasks: [
          "While it's cleared out, check for moisture, mold, or pests",
          "Ensure stored items are off the floor (on shelves or pallets)",
          "Check that any stored clothing is in sealed containers",
          "Make sure walkways and access points are clear",
          "Label zones: holiday, sports, keepsakes, tools, etc.",
        ],
      },
    ],
  },
  kids: {
    zones: [
      {
        name: "Toys & Games",
        tasks: [
          "Pull all toys into the center of the room",
          "Sort: actively played with, outgrown, broken",
          "Donate outgrown toys (involve kids if old enough!)",
          "Toss broken toys and games with missing pieces",
          "Use bins with picture labels for younger kids",
        ],
      },
      {
        name: "Clothes & Shoes",
        tasks: [
          "Try everything on (or check sizes) — kids grow fast!",
          "Remove anything too small, stained, or damaged",
          "Organize by type and season",
          "Store next-size-up hand-me-downs in a labeled bin",
          "Keep 7-10 outfits for daily wear — that's plenty",
        ],
      },
      {
        name: "Books & Art Supplies",
        tasks: [
          "Sort books: favorites, outgrown, damaged",
          "Donate age-inappropriate or never-read books",
          "Gather all art supplies — toss dried markers, broken crayons",
          "Consolidate into one art bin or caddy",
          "Display or photograph favorite artwork, then recycle the rest",
        ],
      },
      {
        name: "Stuffed Animals & Collections",
        tasks: [
          "The great stuffed animal audit: keep the top 10 favorites",
          "Let kids pick their 'team' — the rest get donated",
          "Collections (rocks, cards, figurines): set a boundary — one bin max",
          "Rotate toys monthly to keep things feeling fresh",
          "Create a 'goodbye box' — if they don't ask for it in a month, donate",
        ],
      },
    ],
  },
  dining: {
    zones: [
      {
        name: "Table & Surfaces",
        tasks: [
          "Clear the dining table completely — it's for dining!",
          "Remove mail piles, keys, schoolwork, miscellaneous clutter",
          "Designate a landing zone elsewhere for that stuff",
          "Keep centerpiece simple: one item only",
          "Wipe down table and chairs",
        ],
      },
      {
        name: "China Cabinet / Sideboard",
        tasks: [
          "Open up and assess: what do you actually use for entertaining?",
          "Remove chipped, mismatched, or never-used serving pieces",
          "Consolidate candles, linens, and place settings",
          "Dust and reorganize — display your favorites, store the rest",
          "If you haven't hosted with it in 3 years, you probably won't",
        ],
      },
    ],
  },
  laundry: {
    zones: [
      {
        name: "Products & Supplies",
        tasks: [
          "Check all bottles — toss empty, nearly-empty, and products you don't use",
          "Consolidate duplicates (how many stain removers do you need?)",
          "Wipe shelves and reorganize",
          "Keep daily-use items at arm's reach, specialty items higher up",
          "Toss that pile of single socks that's been growing — they're gone",
        ],
      },
      {
        name: "The Laundry Pile Zone",
        tasks: [
          "Sort through any clothes pile that's been 'there a while'",
          "Items you hate ironing: rehome or switch to wrinkle-free",
          "Set up a simple sort system: darks, lights, delicates",
          "Clean out lint trap and wipe dryer exhaust",
          "Add a small trash bin if you don't have one — game changer",
        ],
      },
    ],
  },
  entryway: {
    zones: [
      {
        name: "Shoes & Outerwear",
        tasks: [
          "Pull out all shoes from the entryway",
          "Keep only current-season shoes here (3-4 pairs per person max)",
          "Store off-season shoes elsewhere",
          "Thin out coat rack/hooks: current season only",
          "Toss or donate worn-out shoes, jackets you never wear",
        ],
      },
      {
        name: "Keys, Mail & Landing Zone",
        tasks: [
          "Designate ONE spot for keys (hook, bowl, or tray)",
          "Sort through any mail pile — recycle junk immediately",
          "Set up a 'launch pad': keys, wallet, bag — one small area",
          "Add a small bin for outgoing items (returns, letters)",
          "Wipe down the area — first impression matters!",
        ],
      },
    ],
  },
};

function generatePlan(selectedRooms, minutesPerDay, clutterLevel) {
  const clutter = CLUTTER_LEVELS.find((c) => c.id === clutterLevel);
  const minsPerZone = Math.round(25 * clutter.mult);
  const mins = parseInt(minutesPerDay);

  const allZones = [];
  selectedRooms.forEach((roomId) => {
    const room = ROOMS.find((r) => r.id === roomId);
    const roomData = ROOM_TASKS[roomId];
    if (!roomData) return;
    roomData.zones.forEach((zone) => {
      allZones.push({ roomId, roomEmoji: room.emoji, roomName: room.name, ...zone });
    });
  });

  const days = [];
  let currentDay = [];
  let currentDayMins = 0;

  allZones.forEach((zone) => {
    if (currentDayMins + minsPerZone > mins && currentDay.length > 0) {
      days.push([...currentDay]);
      currentDay = [];
      currentDayMins = 0;
    }
    currentDay.push(zone);
    currentDayMins += minsPerZone;
  });
  if (currentDay.length > 0) days.push(currentDay);

  const weeks = [];
  for (let i = 0; i < days.length; i += 5) {
    weeks.push(days.slice(i, i + 5));
  }

  return { weeks, totalDays: days.length, totalWeeks: weeks.length, totalZones: allZones.length };
}

export default function DeclutterPlanGenerator() {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [time, setTime] = useState("");
  const [clutter, setClutter] = useState("");
  const [plan, setPlan] = useState(null);
  const [checked, setChecked] = useState({});
  const [expandedDay, setExpandedDay] = useState({});
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

  const toggleRoom = (id) => {
    setSelectedRooms((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const generate = () => {
    if (selectedRooms.length === 0 || !time || !clutter) return;
    const result = generatePlan(selectedRooms, time, clutter);
    setPlan(result);
    setChecked({});
    setExpandedDay({"w0-d0": true});
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const toggleCheck = (key) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalTasks = plan
    ? plan.weeks.flat().flat().reduce((s, zone) => s + zone.tasks.length, 0)
    : 0;
  const doneTasks = Object.values(checked).filter(Boolean).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(155deg, #fff3e0 0%, #fff9c4 25%, #e8f5e9 55%, #e0f7fa 100%)",
        fontFamily: "'Nunito', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap" rel="stylesheet" />

      {["📦", "🗑️", "💝", "🧹", "🌿", "🎁"].map((e, i) => (
        <div key={i} style={{ position: "absolute", top: `${6 + i * 14}%`, [i % 2 ? "right" : "left"]: `${2 + (i % 4)}%`, fontSize: 22, opacity: 0.1, pointerEvents: "none" }}>{e}</div>
      ))}

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>📦✨🌸</div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(26px, 5vw, 40px)", color: "#e65100", margin: "0 0 8px", textShadow: "2px 2px 0 rgba(255,255,255,0.7)" }}>
            Declutter Plan Generator
          </h1>
          <p style={{ color: "#ff8a65", fontSize: 15, margin: 0, fontWeight: 600 }}>
            Pick your spaces, set your pace, and get a structured plan to finally clear the clutter
          </p>
        </div>

        {/* Rooms */}
        <Section num="1" title="Which spaces need decluttering?" color="#e65100" subtitle="Select all that apply">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
            {ROOMS.map((r) => (
              <Btn key={r.id} active={selectedRooms.includes(r.id)} onClick={() => toggleRoom(r.id)} color="#e65100">
                <div style={{ fontSize: 24, marginBottom: 2 }}>{r.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 12 }}>{r.name}</div>
              </Btn>
            ))}
          </div>
          {selectedRooms.length > 0 && (
            <div style={{ marginTop: 10, fontSize: 13, color: "#bf360c", fontWeight: 700 }}>
              {selectedRooms.length} space{selectedRooms.length > 1 ? "s" : ""} selected
            </div>
          )}
        </Section>

        {/* Time */}
        <Section num="2" title="How much time per day?" color="#e65100">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {TIME_OPTIONS.map((t) => (
              <Btn key={t.id} active={time === t.id} onClick={() => setTime(t.id)} color="#e65100">
                <div style={{ fontSize: 22 }}>{t.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{t.label}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{t.desc}</div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* Clutter level */}
        <Section num="3" title="How cluttered is it?" color="#e65100">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CLUTTER_LEVELS.map((c) => (
              <Btn key={c.id} active={clutter === c.id} onClick={() => setClutter(c.id)} color="#e65100" wide>
                <span style={{ fontSize: 24, marginRight: 12 }}>{c.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800 }}>{c.label}</div>
                  <div style={{ fontSize: 12, opacity: 0.65 }}>{c.desc}</div>
                </div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* Generate */}
        {selectedRooms.length > 0 && time && clutter && (
          <button
            onClick={generate}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg, #e65100, #ff8a65)",
              color: "#fff",
              fontFamily: "'Fredoka One', cursive",
              fontSize: 20,
              cursor: "pointer",
              marginBottom: 24,
              boxShadow: "0 4px 20px rgba(230,81,0,0.3)",
              transition: "transform 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            📋 Build My Declutter Plan!
          </button>
        )}

        {/* Results */}
        {plan && (
          <div ref={resultRef}>
            <button
              onClick={() => downloadPDF(resultRef.current, 'declutter-plan.pdf')}
              style={{
                width: "100%",
                marginBottom: 16,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #e65100, #ff8a65)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: "0 4px 15px rgba(230,81,0,0.3)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📥 Download as PDF
            </button>
            {/* Summary */}
            <div
              style={{
                background: "rgba(255,255,255,0.9)",
                borderRadius: 18,
                padding: "20px 24px",
                marginBottom: 20,
                border: "2px solid #ffcc80",
                boxShadow: "0 3px 16px rgba(230,81,0,0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                <Stat label="Total Days" value={plan.totalDays} emoji="📅" />
                <Stat label="Weeks" value={plan.totalWeeks} emoji="🗓️" />
                <Stat label="Zones" value={plan.totalZones} emoji="📍" />
                <Stat label="Tasks" value={totalTasks} emoji="✅" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span style={{ fontWeight: 800, color: "#e65100", fontSize: 14 }}>
                  Progress: {doneTasks}/{totalTasks}
                </span>
                <span style={{ fontSize: 12, color: "#aaa" }}>
                  ({totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%)
                </span>
              </div>
              <div style={{ background: "#fff3e0", borderRadius: 10, height: 14, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%`,
                    height: "100%",
                    background: doneTasks === totalTasks && totalTasks > 0
                      ? "linear-gradient(90deg, #66bb6a, #43a047)"
                      : "linear-gradient(90deg, #ff8a65, #e65100)",
                    borderRadius: 10,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              {doneTasks === totalTasks && totalTasks > 0 && (
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 16, fontWeight: 800, color: "#43a047" }}>
                  🎉 You did it! Your spaces are decluttered! Time to enjoy the calm.
                </div>
              )}
            </div>

            {/* Weeks */}
            {plan.weeks.map((week, wi) => (
              <div key={wi} style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", color: "#e65100", fontSize: 20, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ background: "#fff3e0", borderRadius: 10, padding: "4px 12px", fontSize: 14 }}>Week {wi + 1}</span>
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {week.map((day, di) => {
                    const dayKey = `w${wi}-d${di}`;
                    const isExpanded = !!expandedDay[dayKey];
                    const dayTasks = day.flatMap((zone) => zone.tasks);
                    dayTasks.filter((_, ti) => {
                      day.findIndex((z) => z.tasks.includes(dayTasks[ti]));
                      let taskOffset = ti;
                      for (let z = 0; z < day.length; z++) {
                        if (taskOffset < day[z].tasks.length) {
                          return checked[`${dayKey}-z${z}-t${taskOffset}`];
                        }
                        taskOffset -= day[z].tasks.length;
                      }
                      return false;
                    });

                    return (
                      <div
                        key={di}
                        style={{
                          background: "rgba(255,255,255,0.88)",
                          borderRadius: 16,
                          border: isExpanded ? "2px solid #ffcc80" : "2px solid rgba(230,81,0,0.06)",
                          overflow: "hidden",
                          boxShadow: isExpanded ? "0 4px 16px rgba(230,81,0,0.1)" : "0 2px 8px rgba(0,0,0,0.02)",
                        }}
                      >
                        <div
                          onClick={() => setExpandedDay(prev => ({...prev, [dayKey]: !prev[dayKey]}))}
                          style={{
                            padding: "14px 18px",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontWeight: 800, color: "#e65100", fontSize: 15 }}>
                              Day {wi * 5 + di + 1}
                            </span>
                            <span style={{ fontSize: 13, color: "#999" }}>
                              {day.map((z) => z.roomEmoji).filter((v, i, a) => a.indexOf(v) === i).join("")} {day.map((z) => z.name).join(" → ")}
                            </span>
                          </div>
                          <span style={{ fontSize: 18, color: "#ccc", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                        </div>

                        {isExpanded && (
                          <div style={{ padding: "0 18px 18px" }}>
                            {day.map((zone, zi) => (
                              <div key={zi} style={{ marginBottom: zi < day.length - 1 ? 16 : 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 800, color: "#bf360c", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                                  {zone.roomEmoji} {zone.roomName} — {zone.name}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  {zone.tasks.map((task, ti) => {
                                    const key = `${dayKey}-z${zi}-t${ti}`;
                                    const done = checked[key];
                                    return (
                                      <div
                                        key={ti}
                                        onClick={() => toggleCheck(key)}
                                        style={{
                                          display: "flex",
                                          alignItems: "flex-start",
                                          gap: 10,
                                          padding: "8px 12px",
                                          borderRadius: 10,
                                          background: done ? "#e8f5e9" : "#fafafa",
                                          cursor: "pointer",
                                          transition: "all 0.2s",
                                          border: done ? "1.5px solid #a5d6a7" : "1.5px solid transparent",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 5,
                                            border: done ? "2px solid #66bb6a" : "2px solid #ddd",
                                            background: done ? "#66bb6a" : "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 12,
                                            color: "#fff",
                                            fontWeight: 800,
                                            flexShrink: 0,
                                            marginTop: 1,
                                          }}
                                        >
                                          {done ? "✓" : ""}
                                        </div>
                                        <span style={{ fontSize: 13, color: done ? "#999" : "#444", textDecoration: done ? "line-through" : "none", fontWeight: done ? 400 : 600, lineHeight: 1.5 }}>
                                          {task}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#ffcc80", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📦💝🌸</div>
          Declutter Plan Generator — Less stuff, more life!
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, subtitle, color, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "22px 24px", marginBottom: 20, boxShadow: "0 3px 16px rgba(230,81,0,0.06)", border: "2px solid rgba(230,81,0,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: subtitle ? 4 : 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, #ff8a65)`, color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{num}</div>
        <h3 style={{ margin: 0, color, fontWeight: 800, fontSize: 16 }}>{title}</h3>
      </div>
      {subtitle && <p style={{ margin: "0 0 14px 38px", fontSize: 12, color: "#aaa", fontWeight: 600 }}>{subtitle}</p>}
      {children}
    </div>
  );
}

function Btn({ active, onClick, children, color, wide }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: wide ? "14px 18px" : "14px 10px",
        borderRadius: 14,
        border: active ? `2px solid ${color}` : "2px solid #e0e0e0",
        background: active ? `${color}10` : "rgba(255,255,255,0.85)",
        color: active ? color : "#777",
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s",
        textAlign: wide ? "left" : "center",
        display: wide ? "flex" : "block",
        alignItems: "center",
      }}
    >
      {children}
    </button>
  );
}

function Stat({ label, value, emoji }) {
  return (
    <div style={{ textAlign: "center", flex: 1, minWidth: 80 }}>
      <div style={{ fontSize: 20 }}>{emoji}</div>
      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#e65100" }}>{value}</div>
      <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>{label}</div>
    </div>
  );
}
