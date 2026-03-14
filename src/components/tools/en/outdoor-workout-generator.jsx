'use client';
import { useState, useRef } from "react";

const FITNESS_LEVELS = [
  { id: "beginner", label: "Beginner", emoji: "🌱", desc: "New to exercise or getting back into it" },
  { id: "intermediate", label: "Intermediate", emoji: "💪", desc: "Workout regularly, decent fitness" },
  { id: "advanced", label: "Advanced", emoji: "🔥", desc: "Very fit, want a real challenge" },
];

const EQUIPMENT = [
  { id: "none", label: "No Equipment", emoji: "🙌" },
  { id: "bands", label: "Resistance Bands", emoji: "🟡" },
  { id: "dumbbells", label: "Dumbbells", emoji: "🏋️" },
  { id: "kettlebell", label: "Kettlebell", emoji: "🔔" },
  { id: "pullup_bar", label: "Pull-Up Bar / Playground", emoji: "🏗️" },
  { id: "jump_rope", label: "Jump Rope", emoji: "🪢" },
];

const DURATION = [
  { id: "15", label: "15 min", emoji: "⚡", desc: "Quick burner" },
  { id: "25", label: "25 min", emoji: "🕐", desc: "Solid session" },
  { id: "40", label: "40 min", emoji: "💪", desc: "Full workout" },
  { id: "60", label: "60 min", emoji: "🔥", desc: "Beast mode" },
];

const FOCUS = [
  { id: "full", label: "Full Body", emoji: "🏋️" },
  { id: "upper", label: "Upper Body", emoji: "💪" },
  { id: "lower", label: "Lower Body", emoji: "🦵" },
  { id: "core", label: "Core", emoji: "🎯" },
  { id: "cardio", label: "Cardio / HIIT", emoji: "❤️‍🔥" },
  { id: "flexibility", label: "Stretch / Mobility", emoji: "🧘" },
];

const EXERCISES = {
  upper: {
    none: {
      beginner: [
        { name: "Incline Push-Ups (on bench)", reps: "10", sets: 3, rest: "45s", tip: "Hands on bench, lower chest to edge. Easier than floor push-ups — great starting point." },
        { name: "Tricep Dips (on bench)", reps: "8", sets: 3, rest: "45s", tip: "Hands on bench edge behind you, lower body down. Keep elbows pointing back, not out." },
        { name: "Arm Circles", reps: "20 each direction", sets: 3, rest: "30s", tip: "Small circles, then big. Sounds easy — your shoulders will disagree." },
        { name: "Plank Shoulder Taps", reps: "10 each side", sets: 3, rest: "45s", tip: "In plank, tap opposite shoulder. Keep hips as still as possible." },
        { name: "Commandos (Plank to Push-up)", reps: "8", sets: 3, rest: "60s", tip: "Forearm plank → push up to hands one arm at a time. Alternate leading arm." },
      ],
      intermediate: [
        { name: "Push-Ups", reps: "15", sets: 4, rest: "45s", tip: "Full range of motion. Chest touches the ground. No sagging hips." },
        { name: "Diamond Push-Ups", reps: "10", sets: 3, rest: "45s", tip: "Hands together under chest. Elbows stay close to body. Tricep destroyer." },
        { name: "Pike Push-Ups", reps: "10", sets: 3, rest: "60s", tip: "Hips up high, head goes toward ground. Targets shoulders like an overhead press." },
        { name: "Bench Dips (legs extended)", reps: "12", sets: 4, rest: "45s", tip: "Straighten legs for more challenge. Deep dip, full lockout." },
        { name: "Decline Push-Ups (feet on bench)", reps: "12", sets: 3, rest: "45s", tip: "Feet elevated, targets upper chest and front delts." },
        { name: "Plank Up-Downs", reps: "12", sets: 3, rest: "45s", tip: "Forearm to hand plank, controlled. Your arms will be cooked." },
      ],
      advanced: [
        { name: "Archer Push-Ups", reps: "8 each side", sets: 4, rest: "60s", tip: "Wide push-up, shift weight to one arm. Working toward one-arm push-up." },
        { name: "Handstand Hold (wall-assisted)", reps: "20-30 sec", sets: 4, rest: "60s", tip: "Kick up to wall, hold. Build to freestanding. Shoulder strength like nothing else." },
        { name: "Explosive Push-Ups (clap optional)", reps: "10", sets: 4, rest: "60s", tip: "Push off the ground explosively. Clap if you can, land soft." },
        { name: "Pseudo Planche Push-Ups", reps: "8", sets: 3, rest: "60s", tip: "Hands by waist, lean forward. Targets front delts and chest insanely." },
        { name: "L-Sit Hold (on parallel surfaces)", reps: "15-20 sec", sets: 4, rest: "60s", tip: "Use two benches or parallel bars. Legs straight out. Core and triceps on fire." },
        { name: "Hindu Push-Ups", reps: "12", sets: 4, rest: "45s", tip: "Dive down and through like scooping. Full body movement — chest, shoulders, back." },
      ],
    },
    bands: {
      beginner: [
        { name: "Banded Pull-Aparts", reps: "15", sets: 3, rest: "30s", tip: "Arms straight out, pull band apart to chest. Upper back and rear delts." },
        { name: "Banded Bicep Curls", reps: "12", sets: 3, rest: "30s", tip: "Stand on band, curl handles up. Slow negative for extra burn." },
        { name: "Banded Overhead Press", reps: "12", sets: 3, rest: "45s", tip: "Stand on band, press up. Keep core tight — no arching the back." },
        { name: "Banded Tricep Extensions", reps: "12", sets: 3, rest: "30s", tip: "Anchor band high, extend arms down. Squeeze at the bottom." },
        { name: "Banded Face Pulls", reps: "15", sets: 3, rest: "30s", tip: "Anchor at face height, pull toward face with elbows high. Posture gold." },
      ],
      intermediate: [
        { name: "Banded Push-Up (band across back)", reps: "12", sets: 4, rest: "45s", tip: "Loop band across upper back, hold ends under hands. Added resistance at the top." },
        { name: "Banded Overhead Press", reps: "12", sets: 4, rest: "45s", tip: "Stand on band, press overhead. Pause at top." },
        { name: "Banded Bent-Over Row", reps: "12 each arm", sets: 3, rest: "45s", tip: "Step on band, hinge at hips, row to ribcage." },
        { name: "Banded Pull-Aparts (3 angles)", reps: "10 each angle", sets: 3, rest: "30s", tip: "High, mid, low — hits entire upper back." },
        { name: "Banded Lateral Raises", reps: "12", sets: 3, rest: "30s", tip: "Stand on band, raise arms to sides. Controlled — no swinging." },
        { name: "Banded Tricep Kickbacks", reps: "12 each arm", sets: 3, rest: "30s", tip: "Hinge forward, extend arm back. Squeeze at full extension." },
      ],
    },
    dumbbells: {
      beginner: [
        { name: "Dumbbell Overhead Press", reps: "10", sets: 3, rest: "45s", tip: "Seated or standing. Press up, full lockout, controlled lower." },
        { name: "Dumbbell Bent-Over Row", reps: "10 each arm", sets: 3, rest: "45s", tip: "One hand on bench, row to hip. Squeeze shoulder blade at top." },
        { name: "Dumbbell Bicep Curls", reps: "12", sets: 3, rest: "30s", tip: "Slow and controlled. No swinging — if you're swinging, go lighter." },
        { name: "Dumbbell Lateral Raises", reps: "10", sets: 3, rest: "30s", tip: "Slight bend in elbows, raise to shoulder height. Pause at top." },
        { name: "Dumbbell Tricep Overhead Extension", reps: "10", sets: 3, rest: "30s", tip: "Both hands on one dumbbell, lower behind head, extend up." },
      ],
      intermediate: [
        { name: "Dumbbell Push Press", reps: "10", sets: 4, rest: "45s", tip: "Small dip with knees, drive weights overhead. More weight than strict press." },
        { name: "Renegade Rows", reps: "8 each side", sets: 4, rest: "60s", tip: "Plank on dumbbells, row one at a time. Anti-rotation core work + back." },
        { name: "Dumbbell Chest Press (on ground)", reps: "12", sets: 4, rest: "45s", tip: "Lie on ground, press up. Ground limits range but great for outdoor training." },
        { name: "Arnold Press", reps: "10", sets: 3, rest: "45s", tip: "Start palms facing you, rotate as you press up. Hits all three delt heads." },
        { name: "Hammer Curls to Press", reps: "10", sets: 3, rest: "45s", tip: "Curl with neutral grip, then press overhead. Compound movement — efficient." },
        { name: "Dumbbell Skull Crushers (on ground)", reps: "10", sets: 3, rest: "45s", tip: "Lie back, lower dumbbells to temples, extend. Tricep isolation." },
      ],
    },
    pullup_bar: {
      beginner: [
        { name: "Dead Hangs", reps: "20-30 sec", sets: 4, rest: "45s", tip: "Just hang! Builds grip strength and decompresses spine. Harder than it sounds." },
        { name: "Negative Pull-Ups", reps: "5", sets: 4, rest: "60s", tip: "Jump up, lower yourself as slowly as possible. 5 second negatives build real strength." },
        { name: "Scapular Pull-Ups", reps: "8", sets: 3, rest: "45s", tip: "Hang, pull shoulder blades down and together without bending arms. Activates the right muscles." },
        { name: "Incline Push-Ups (on bar)", reps: "12", sets: 3, rest: "45s", tip: "Hands on low bar, push-up motion. Great push balance to your pulls." },
        { name: "Hanging Knee Raises", reps: "8", sets: 3, rest: "45s", tip: "Hang from bar, raise knees to chest. No swinging!" },
      ],
      intermediate: [
        { name: "Pull-Ups", reps: "8-10", sets: 4, rest: "60s", tip: "Full dead hang to chin over bar. The king of upper body exercises." },
        { name: "Chin-Ups", reps: "10", sets: 4, rest: "60s", tip: "Palms facing you. More bicep involvement — great complement to pull-ups." },
        { name: "Hanging Leg Raises", reps: "10", sets: 3, rest: "45s", tip: "Straight legs to 90°. Control the negative — no swinging." },
        { name: "Muscle-Up Negatives", reps: "3-5", sets: 3, rest: "90s", tip: "Get above bar however you can, lower slowly through the transition. Building to muscle-ups." },
        { name: "Typewriter Pull-Ups", reps: "4 each side", sets: 3, rest: "60s", tip: "Pull up, shift weight side to side at top. Brutal and effective." },
        { name: "Toes to Bar", reps: "8", sets: 3, rest: "45s", tip: "Hang, raise toes all the way to bar. Full core engagement." },
      ],
      advanced: [
        { name: "Muscle-Ups", reps: "5", sets: 5, rest: "90s", tip: "Explosive pull, transition over bar, press up. The ultimate bar move." },
        { name: "Weighted Pull-Ups", reps: "6-8", sets: 4, rest: "90s", tip: "Use a backpack with weight. Game changer for strength." },
        { name: "L-Sit Pull-Ups", reps: "6", sets: 4, rest: "60s", tip: "Hold legs straight out at 90° while doing pull-ups. Core and lats screaming." },
        { name: "Around the Worlds", reps: "4 each direction", sets: 3, rest: "60s", tip: "Circle around the bar in a pull-up motion. Full lat sweep." },
        { name: "Front Lever Progressions", reps: "10-15 sec holds", sets: 4, rest: "90s", tip: "Tuck, advanced tuck, single leg — work toward full front lever." },
        { name: "Windshield Wipers", reps: "6 each side", sets: 3, rest: "60s", tip: "Hang from bar, raise legs and rotate side to side. Advanced core insanity." },
      ],
    },
  },
  lower: {
    none: {
      beginner: [
        { name: "Bodyweight Squats", reps: "15", sets: 3, rest: "45s", tip: "Feet shoulder width, sit back like a chair. Knees track over toes." },
        { name: "Walking Lunges", reps: "10 each leg", sets: 3, rest: "45s", tip: "Long stride, back knee nearly touches ground. Stand tall." },
        { name: "Glute Bridges", reps: "15", sets: 3, rest: "30s", tip: "Lie on back, drive hips up. Squeeze glutes hard at top." },
        { name: "Calf Raises (on a step)", reps: "15", sets: 3, rest: "30s", tip: "Heels off edge, lower below step level for full stretch." },
        { name: "Step-Ups (on bench)", reps: "10 each leg", sets: 3, rest: "45s", tip: "Drive through heel, don't push off back foot. All front leg." },
      ],
      intermediate: [
        { name: "Bulgarian Split Squats (back foot on bench)", reps: "10 each leg", sets: 4, rest: "60s", tip: "The single best leg exercise. Period. Deep stretch, explosive up." },
        { name: "Jump Squats", reps: "12", sets: 4, rest: "45s", tip: "Deep squat, explode up. Land soft, immediately into next rep." },
        { name: "Single-Leg Glute Bridges", reps: "12 each leg", sets: 3, rest: "45s", tip: "One leg extended, drive up with working leg. Glute isolation." },
        { name: "Reverse Lunges", reps: "12 each leg", sets: 3, rest: "45s", tip: "Step back instead of forward — easier on knees." },
        { name: "Lateral Lunges", reps: "10 each side", sets: 3, rest: "45s", tip: "Step wide to side, sit back into hip. Works inner thighs and glutes." },
        { name: "Wall Sit", reps: "45 sec hold", sets: 3, rest: "60s", tip: "Back flat on wall, thighs parallel. It gets real around 30 seconds." },
      ],
      advanced: [
        { name: "Pistol Squats (or assisted)", reps: "6 each leg", sets: 4, rest: "60s", tip: "Single-leg squat to full depth. Use a post for balance if needed." },
        { name: "Box Jump Burpees", reps: "10", sets: 4, rest: "60s", tip: "Burpee + jump onto bench. Explosive full body cardio-strength combo." },
        { name: "Skater Jumps", reps: "15 each side", sets: 4, rest: "45s", tip: "Lateral bound, land on one leg. Athletic and dynamic." },
        { name: "Nordic Curl Negatives (partner or anchored)", reps: "5", sets: 4, rest: "60s", tip: "Knees on ground, slowly lower yourself forward. Hamstring destroyer." },
        { name: "Single-Leg Box Squats", reps: "8 each leg", sets: 4, rest: "60s", tip: "Sit to bench on one leg, stand up. Builds toward pistol squats." },
        { name: "Sprint Intervals (20m)", reps: "8 sprints", sets: 1, rest: "45s between", tip: "All-out sprint 20m, walk back. The ultimate leg and cardio finisher." },
      ],
    },
  },
  core: {
    none: {
      beginner: [
        { name: "Dead Bugs", reps: "10 each side", sets: 3, rest: "30s", tip: "Lie on back, opposite arm/leg extend. Keep lower back pressed to ground." },
        { name: "Plank Hold", reps: "30 sec", sets: 3, rest: "45s", tip: "Elbows under shoulders, straight line head to heels. Don't hold your breath!" },
        { name: "Bird Dogs", reps: "10 each side", sets: 3, rest: "30s", tip: "On all fours, extend opposite arm/leg. Pause at top. Stability gold." },
        { name: "Bicycle Crunches", reps: "12 each side", sets: 3, rest: "30s", tip: "Opposite elbow to knee, slow and controlled. No yanking on your neck." },
        { name: "Lying Leg Raises", reps: "10", sets: 3, rest: "30s", tip: "Hands under butt for support. Lower legs slowly — that's where the magic is." },
      ],
      intermediate: [
        { name: "Plank Hold", reps: "60 sec", sets: 3, rest: "45s", tip: "Squeeze everything — glutes, quads, core. Make 60 seconds feel like work." },
        { name: "Mountain Climbers", reps: "20 each leg", sets: 4, rest: "30s", tip: "Drive knees to chest fast. Keep hips low and core tight." },
        { name: "V-Ups", reps: "12", sets: 3, rest: "45s", tip: "Legs and arms meet at the top. Straight limbs for full challenge." },
        { name: "Russian Twists", reps: "15 each side", sets: 3, rest: "30s", tip: "Feet off ground, lean back, rotate. Add a weight for extra spice." },
        { name: "Plank to Pike", reps: "10", sets: 3, rest: "45s", tip: "From plank, pike hips high, return. Hits deep core muscles." },
        { name: "Side Plank (each side)", reps: "30 sec each", sets: 3, rest: "30s", tip: "Stack feet, hips high. Drop hip to ground and raise for extra reps." },
      ],
      advanced: [
        { name: "Dragon Flags (on bench)", reps: "6", sets: 4, rest: "60s", tip: "Hold bench behind head, raise body straight, lower slowly. Bruce Lee's favorite." },
        { name: "Ab Wheel Rollouts (or towel on grass)", reps: "10", sets: 4, rest: "60s", tip: "Roll out as far as possible, pull back. Use a towel on wet grass if no wheel." },
        { name: "L-Sit Hold", reps: "15-20 sec", sets: 4, rest: "60s", tip: "On parallel surfaces, legs straight. Insane core and hip flexor work." },
        { name: "Hollow Body Hold", reps: "30-45 sec", sets: 4, rest: "45s", tip: "Gymnast foundation. Arms overhead, legs out, low back pressed down." },
        { name: "Hanging Windshield Wipers", reps: "6 each side", sets: 3, rest: "60s", tip: "Hang from bar, raise legs, rotate side to side. Peak core performance." },
        { name: "Plank Pull-Throughs", reps: "10 each side", sets: 3, rest: "45s", tip: "Plank position, reach under and across body. Anti-rotation at its finest." },
      ],
    },
  },
  cardio: {
    none: {
      beginner: [
        { name: "High Knees", reps: "20 sec on, 20 sec rest", sets: 6, rest: "—", tip: "Drive knees to waist height. Pump your arms. Easy pace to start." },
        { name: "Jumping Jacks", reps: "30 sec", sets: 4, rest: "30s", tip: "Full range — arms overhead, feet wide. Old school but effective." },
        { name: "Butt Kicks", reps: "20 sec", sets: 4, rest: "20s", tip: "Run in place, heels to glutes. Light cardio warmup or filler." },
        { name: "Step-Ups (fast, on bench)", reps: "30 sec each leg", sets: 3, rest: "30s", tip: "Quick feet, drive that knee up. Gets the heart rate moving." },
        { name: "Squat Jacks", reps: "12", sets: 3, rest: "30s", tip: "Jumping jack but squat at the bottom. Legs + cardio in one." },
      ],
      intermediate: [
        { name: "Burpees", reps: "10", sets: 4, rest: "45s", tip: "Full burpee — chest to ground, jump at top. Love to hate 'em." },
        { name: "Sprint Intervals (30 sec)", reps: "30 sec sprint / 30 sec walk", sets: 8, rest: "—", tip: "All-out effort on sprints. Walk to recover. 8 rounds = done." },
        { name: "Mountain Climber Sprints", reps: "20 sec on, 10 sec rest", sets: 8, rest: "—", tip: "Tabata style. Drive knees as fast as possible. 4 minutes of pain." },
        { name: "Tuck Jumps", reps: "10", sets: 4, rest: "45s", tip: "Jump and bring knees to chest at peak. Land softly." },
        { name: "Broad Jumps", reps: "8", sets: 4, rest: "45s", tip: "Explosive forward jump from standing. Walk back, repeat." },
        { name: "Bear Crawls (20m)", reps: "4 lengths", sets: 3, rest: "60s", tip: "On all fours, knees 1 inch off ground, crawl forward. Deceptively brutal." },
      ],
      advanced: [
        { name: "Burpee Box Jumps", reps: "8", sets: 5, rest: "60s", tip: "Burpee + jump onto bench or ledge. Full body explosive power." },
        { name: "Sprint Intervals (uphill if possible)", reps: "20 sec sprint / 40 sec walk", sets: 10, rest: "—", tip: "Find a hill. Sprint up, walk down. 10 rounds. Leg-burning cardio." },
        { name: "Alternating Lunge Jumps", reps: "20 total", sets: 4, rest: "45s", tip: "Lunge, jump, switch legs mid-air. Explosive and athletic." },
        { name: "Lateral Bound Sprints", reps: "10 bounds + 20m sprint", sets: 4, rest: "60s", tip: "Bound side to side 10 times then immediately sprint. Sport-specific cardio." },
        { name: "Man Makers (with push-up and burpee)", reps: "8", sets: 4, rest: "60s", tip: "Burpee + push-up + jump. Repeat without stopping. Welcome to the pain cave." },
        { name: "400m Repeats", reps: "4 rounds", sets: 1, rest: "90s between", tip: "Run 400m (one lap) hard, rest 90s. Classic track workout." },
      ],
    },
    jump_rope: {
      beginner: [
        { name: "Basic Jump Rope", reps: "30 sec on, 30 sec rest", sets: 6, rest: "—", tip: "Small jumps, wrists do the work. Just find a rhythm first." },
        { name: "Alternating Foot Jump", reps: "30 sec", sets: 4, rest: "30s", tip: "Like running in place over the rope. Lighter on joints than double-foot." },
        { name: "Slow Single-Unders", reps: "50 total", sets: 3, rest: "45s", tip: "Count to 50 without tripping. Reset if you miss — it's great practice." },
      ],
      intermediate: [
        { name: "Jump Rope Tabata", reps: "20 sec on / 10 sec rest", sets: 8, rest: "—", tip: "All-out jumping for 20s, rest 10s. 4 minutes of cardio excellence." },
        { name: "High Knee Jump Rope", reps: "30 sec", sets: 6, rest: "20s", tip: "Drive knees up while jumping rope. Double the cardio intensity." },
        { name: "Criss-Cross Jump Rope", reps: "30 sec", sets: 4, rest: "30s", tip: "Cross arms in front on alternate jumps. Coordination + cardio." },
        { name: "Double-Under Practice", reps: "5 sets of max reps", sets: 5, rest: "45s", tip: "Spin rope twice per jump. The CrossFit classic. Patience required." },
      ],
    },
  },
  full: {
    none: {
      beginner: [
        { name: "Bodyweight Squats", reps: "12", sets: 3, rest: "30s", tip: "Sit back, chest up, drive through heels." },
        { name: "Push-Ups (incline if needed)", reps: "8-10", sets: 3, rest: "45s", tip: "Use a bench for incline if full push-ups are too tough." },
        { name: "Walking Lunges", reps: "8 each leg", sets: 3, rest: "30s", tip: "Big steps, upright torso. Don't rush — control matters." },
        { name: "Plank Hold", reps: "30 sec", sets: 3, rest: "30s", tip: "Tight body, breathe steadily." },
        { name: "Glute Bridges", reps: "15", sets: 3, rest: "30s", tip: "Squeeze at the top for 2 seconds." },
        { name: "Jumping Jacks", reps: "30 sec", sets: 3, rest: "30s", tip: "Full range of motion — end on a cardio high." },
      ],
      intermediate: [
        { name: "Jump Squats", reps: "12", sets: 4, rest: "30s", tip: "Deep squat, explosive jump. Land soft, repeat immediately." },
        { name: "Push-Ups", reps: "15", sets: 4, rest: "30s", tip: "Full range. Chest to ground, full lockout." },
        { name: "Bulgarian Split Squats", reps: "10 each leg", sets: 3, rest: "45s", tip: "Back foot on bench. Deep stretch at bottom." },
        { name: "Mountain Climbers", reps: "20 each leg", sets: 3, rest: "30s", tip: "Fast knees, tight core, low hips." },
        { name: "Burpees", reps: "10", sets: 3, rest: "45s", tip: "Full burpee — chest down, jump up." },
        { name: "Plank to Push-Up", reps: "10", sets: 3, rest: "30s", tip: "Forearm to hand, alternate leading arm." },
        { name: "Reverse Lunges", reps: "12 each leg", sets: 3, rest: "30s", tip: "Step back, knee hovers ground, drive up." },
        { name: "V-Ups", reps: "12", sets: 3, rest: "30s", tip: "Legs and hands meet at the top. Full body crunch." },
      ],
      advanced: [
        { name: "Burpee to Tuck Jump", reps: "10", sets: 4, rest: "45s", tip: "Full burpee, explode into tuck jump at top. Brutal combo." },
        { name: "Pistol Squats (alternating)", reps: "6 each leg", sets: 4, rest: "60s", tip: "Single-leg squat to full depth. Hold something for balance if needed." },
        { name: "Explosive Push-Ups", reps: "12", sets: 4, rest: "45s", tip: "Hands leave the ground on every rep." },
        { name: "Sprint Intervals (20m)", reps: "6 sprints", sets: 1, rest: "45s between", tip: "All out 20m, walk back." },
        { name: "Dragon Flags (on bench)", reps: "6", sets: 3, rest: "60s", tip: "Full body raise from bench, lower slowly. Elite core." },
        { name: "Skater Jumps", reps: "15 each side", sets: 3, rest: "30s", tip: "Lateral bounds. Athletic, powerful, fun." },
        { name: "Handstand Hold (wall)", reps: "20 sec", sets: 3, rest: "60s", tip: "Kick up, hold. Build pressing strength." },
        { name: "Bear Crawl Sprints (20m)", reps: "4 lengths", sets: 3, rest: "60s", tip: "Full body cardio-strength. Knees 1 inch off ground." },
      ],
    },
  },
  flexibility: {
    none: {
      beginner: [
        { name: "Cat-Cow Stretches", reps: "10 cycles", sets: 1, rest: "—", tip: "On all fours, arch and round spine slowly. Breathe with each movement." },
        { name: "Downward Dog to Cobra Flow", reps: "8 flows", sets: 1, rest: "—", tip: "Flow between poses smoothly. Opens entire front and back body." },
        { name: "World's Greatest Stretch", reps: "5 each side", sets: 1, rest: "—", tip: "Lunge, rotate, reach. Hits everything — hips, thoracic, hamstrings." },
        { name: "Standing Quad Stretch", reps: "30 sec each leg", sets: 2, rest: "—", tip: "Hold foot behind, knee pointing down. Use a tree or post for balance." },
        { name: "Pigeon Pose (each side)", reps: "45 sec each", sets: 2, rest: "—", tip: "Deep hip opener. Go to your comfortable edge, breathe, let gravity work." },
        { name: "Seated Forward Fold", reps: "45 sec", sets: 2, rest: "—", tip: "Legs straight, reach for toes. Breathe into the stretch — don't bounce." },
        { name: "Lying Spinal Twist", reps: "30 sec each side", sets: 2, rest: "—", tip: "Knees to one side, look opposite. Decompresses spine beautifully." },
        { name: "Child's Pose", reps: "60 sec", sets: 1, rest: "—", tip: "Arms extended, breathe deep into lower back. The perfect closer." },
      ],
    },
  },
};

function getWorkout(focus, equipment, fitness, duration) {
  const focusExercises = EXERCISES[focus];
  if (!focusExercises) return [];

  const equipKey = Object.keys(focusExercises).includes(equipment) ? equipment : "none";
  const equipExercises = focusExercises[equipKey];
  if (!equipExercises) return [];

  const levelExercises = equipExercises[fitness] || equipExercises.beginner || [];

  const mins = parseInt(duration) || 25;
  const count = Math.min(levelExercises.length, Math.max(4, Math.floor(mins / 5)));

  const shuffled = [...levelExercises].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function OutdoorWorkoutGenerator() {
  const [fitness, setFitness] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [duration, setDuration] = useState("");
  const [focus, setFocus] = useState("");
  const [workout, setWorkout] = useState(null);
  const [completed, setCompleted] = useState({});
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

  const toggleEquip = (id) => setEquipment((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);
  const toggleComplete = (i) => setCompleted((prev) => ({ ...prev, [i]: !prev[i] }));

  const generate = () => {
    const mainEquip = equipment.length > 0 ? equipment[Math.floor(Math.random() * equipment.length)] : "none";
    const exercises = getWorkout(focus, mainEquip, fitness, duration);
    setWorkout({ exercises, equip: mainEquip, focus, fitness, duration });
    setCompleted({});
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const canGenerate = fitness && duration && focus;
  const doneCount = Object.values(completed).filter(Boolean).length;

  const focusColors = { full: "#2e7d32", upper: "#1565c0", lower: "#6a1b9a", core: "#e65100", cardio: "#c62828", flexibility: "#00838f" };
  const activeColor = focusColors[focus] || "#2e7d32";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #e8f5e9 0%, #e0f7fa 25%, #fffde7 50%, #fff3e0 80%, #fce4ec 100%)",
      fontFamily: "'Nunito', sans-serif", position: "relative", overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap" rel="stylesheet" />
      {["💪", "🌳", "☀️", "🏋️", "🌸", "🏃"].map((e, i) => (
        <div key={i} style={{ position: "absolute", top: `${5 + i * 15}%`, [i % 2 ? "right" : "left"]: `${2 + (i % 3) * 2}%`, fontSize: 22, opacity: 0.1, pointerEvents: "none" }}>{e}</div>
      ))}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🏋️☀️🌳</div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(26px, 5vw, 40px)", color: "#2e7d32", margin: "0 0 8px", textShadow: "2px 2px 0 rgba(255,255,255,0.7)" }}>Outdoor Workout Generator</h1>
          <p style={{ color: "#66bb6a", fontSize: 15, margin: 0, fontWeight: 600 }}>Fresh air + fresh workout every time — no gym needed</p>
        </div>

        <Section num="1" title="Fitness level?" color="#2e7d32">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FITNESS_LEVELS.map((f) => (<Btn key={f.id} active={fitness === f.id} onClick={() => setFitness(f.id)} color="#2e7d32" wide><span style={{ fontSize: 22, marginRight: 12 }}>{f.emoji}</span><div><div style={{ fontWeight: 800 }}>{f.label}</div><div style={{ fontSize: 12, opacity: 0.65 }}>{f.desc}</div></div></Btn>))}
          </div>
        </Section>

        <Section num="2" title="What equipment do you have?" color="#2e7d32" subtitle="Select all — or none for bodyweight only">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
            {EQUIPMENT.map((e) => (<Btn key={e.id} active={equipment.includes(e.id)} onClick={() => toggleEquip(e.id)} color="#2e7d32"><div style={{ fontSize: 22 }}>{e.emoji}</div><div style={{ fontWeight: 700, fontSize: 12 }}>{e.label}</div></Btn>))}
          </div>
        </Section>

        <Section num="3" title="How long?" color="#2e7d32">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {DURATION.map((d) => (<Btn key={d.id} active={duration === d.id} onClick={() => setDuration(d.id)} color="#2e7d32"><div style={{ fontSize: 18 }}>{d.emoji}</div><div style={{ fontWeight: 800, fontSize: 14 }}>{d.label}</div><div style={{ fontSize: 11, opacity: 0.6 }}>{d.desc}</div></Btn>))}
          </div>
        </Section>

        <Section num="4" title="What's the focus?" color="#2e7d32">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
            {FOCUS.map((f) => (<Btn key={f.id} active={focus === f.id} onClick={() => setFocus(f.id)} color={focusColors[f.id] || "#2e7d32"}><div style={{ fontSize: 22 }}>{f.emoji}</div><div style={{ fontWeight: 800, fontSize: 13 }}>{f.label}</div></Btn>))}
          </div>
        </Section>

        {canGenerate && (
          <button onClick={generate} style={{
            width: "100%", padding: "16px", borderRadius: 16, border: "none",
            background: `linear-gradient(135deg, ${activeColor}, ${activeColor}aa)`, color: "#fff",
            fontFamily: "'Fredoka One', cursive", fontSize: 20, cursor: "pointer",
            marginBottom: 24, boxShadow: `0 4px 20px ${activeColor}40`, transition: "transform 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
            {workout ? "🔄 Generate New Workout!" : "💪 Generate My Workout!"}
          </button>
        )}

        {workout && (
          <div ref={resultRef}>
            <button
              onClick={() => downloadPDF(resultRef.current, 'outdoor-workout.pdf')}
              style={{
                width: "100%",
                marginBottom: 16,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: `linear-gradient(135deg, ${activeColor}, ${activeColor}bb)`,
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: `0 4px 15px ${activeColor}40`,
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📥 Download as PDF
            </button>
            <button
              onClick={() => {
                setFitness("");
                setEquipment([]);
                setDuration("");
                setFocus("");
                setWorkout(null);
                setCompleted({});
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                width: "100%",
                marginBottom: 16,
                padding: "12px",
                borderRadius: 12,
                border: "2px solid #e0e0e0",
                background: "#fff",
                color: "#888",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.color = "#555"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#888"; }}
            >
              🔄 Start Over
            </button>
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "20px 24px", marginBottom: 20, border: `2px solid ${activeColor}30`, position: "sticky", top: 0, zIndex: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                <MiniStat emoji={FOCUS.find(f => f.id === workout.focus)?.emoji || "💪"} value={workout.focus.replace("_", " ")} label="Focus" color={activeColor} />
                <MiniStat emoji="🏋️" value={workout.exercises.length} label="Exercises" color={activeColor} />
                <MiniStat emoji="⏱️" value={`${workout.duration} min`} label="Duration" color={activeColor} />
                <MiniStat emoji="✅" value={`${doneCount}/${workout.exercises.length}`} label="Done" color={activeColor} />
              </div>
              <div style={{ background: `${activeColor}15`, borderRadius: 10, height: 14, overflow: "hidden" }}>
                <div style={{
                  width: `${workout.exercises.length > 0 ? (doneCount / workout.exercises.length) * 100 : 0}%`,
                  height: "100%", background: `linear-gradient(90deg, ${activeColor}, ${activeColor}cc)`,
                  borderRadius: 10, transition: "width 0.4s",
                }} />
              </div>
              {doneCount === workout.exercises.length && workout.exercises.length > 0 && (
                <div style={{ textAlign: "center", marginTop: 10, fontSize: 16, fontWeight: 800, color: activeColor }}>
                  🔥 Workout CRUSHED! You're a beast! 💪
                </div>
              )}
            </div>

            {/* Warm-up reminder */}
            <div style={{ background: "#fff8e1", borderRadius: 14, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#f57f17", fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>🔥</span>
              <span>Warm up first! 5 min light jog, arm circles, leg swings, hip circles. Cold muscles = injury risk.</span>
            </div>

            {/* Exercises */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {workout.exercises.map((ex, i) => {
                const done = completed[i];
                return (
                  <div key={i} style={{
                    background: done ? `${activeColor}08` : "rgba(255,255,255,0.9)",
                    borderRadius: 16, padding: "18px 20px",
                    border: done ? `2px solid ${activeColor}40` : "2px solid rgba(0,0,0,0.04)",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: done ? activeColor : `${activeColor}20`,
                            color: done ? "#fff" : activeColor,
                            fontWeight: 800, fontSize: 13,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>{done ? "✓" : i + 1}</span>
                          <span style={{ fontWeight: 800, color: done ? "#999" : "#333", fontSize: 16, textDecoration: done ? "line-through" : "none" }}>
                            {ex.name}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 16, marginBottom: 8, marginLeft: 38 }}>
                          <span style={{ fontSize: 13, color: activeColor, fontWeight: 700 }}>{ex.reps} reps</span>
                          <span style={{ fontSize: 13, color: "#888", fontWeight: 600 }}>{ex.sets} sets</span>
                          {ex.rest && ex.rest !== "—" && <span style={{ fontSize: 13, color: "#bbb", fontWeight: 600 }}>Rest: {ex.rest}</span>}
                        </div>
                        <div style={{ fontSize: 13, color: "#777", marginLeft: 38, lineHeight: 1.5, fontWeight: 600 }}>
                          💡 {ex.tip}
                        </div>
                      </div>
                      <button onClick={() => toggleComplete(i)} style={{
                        width: 40, height: 40, borderRadius: "50%",
                        border: done ? `2px solid ${activeColor}` : "2px dashed #ddd",
                        background: done ? activeColor : "#fff",
                        color: done ? "#fff" : "#ddd", fontSize: 18, fontWeight: 800,
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "all 0.2s",
                      }}>{done ? "✓" : ""}</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cool-down */}
            <div style={{ background: "#e0f7fa", borderRadius: 14, padding: "14px 18px", marginTop: 16, fontSize: 13, color: "#00838f", fontWeight: 600, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 18 }}>🧘</span>
              <div>
                <div style={{ fontWeight: 800, marginBottom: 4 }}>Cool-down (don't skip!):</div>
                5 min easy walk, then stretch major muscle groups: quads, hamstrings, hip flexors, chest, shoulders, lats. Hold each stretch 30 seconds. Your future self will thank you.
              </div>
            </div>
            <button
              onClick={() => downloadPDF(resultRef.current, 'outdoor-workout.pdf')}
              style={{
                width: "100%",
                marginTop: 16,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: `linear-gradient(135deg, ${activeColor}, ${activeColor}bb)`,
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: `0 4px 15px ${activeColor}40`,
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📥 Download as PDF
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#a5d6a7", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>💪🌳☀️</div>
          Outdoor Workout Generator — Your gym is everywhere!
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, subtitle, color, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "22px 24px", marginBottom: 20, boxShadow: "0 3px 16px rgba(0,0,0,0.04)", border: "2px solid rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: subtitle ? 4 : 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}88)`, color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{num}</div>
        <h3 style={{ margin: 0, color, fontWeight: 800, fontSize: 16 }}>{title}</h3>
      </div>
      {subtitle && <p style={{ margin: "0 0 14px 38px", fontSize: 12, color: "#aaa", fontWeight: 600 }}>{subtitle}</p>}
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

function MiniStat({ emoji, value, label, color }) {
  return (
    <div style={{ textAlign: "center", minWidth: 70 }}>
      <div style={{ fontSize: 18 }}>{emoji}</div>
      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color, textTransform: "capitalize" }}>{value}</div>
      <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>{label}</div>
    </div>
  );
}
