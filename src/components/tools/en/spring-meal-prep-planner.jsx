'use client';
import { useState, useRef } from "react";

const DIETS = [
  { id: "none", label: "No Restrictions", emoji: "🍽️" },
  { id: "vegetarian", label: "Vegetarian", emoji: "🥦" },
  { id: "vegan", label: "Vegan", emoji: "🌱" },
  { id: "glutenfree", label: "Gluten-Free", emoji: "🌾" },
  { id: "lowcarb", label: "Low Carb", emoji: "🥩" },
  { id: "dairy_free", label: "Dairy-Free", emoji: "🥛" },
];

const HOUSEHOLD = [
  { id: "1", label: "Just me", emoji: "🧑" },
  { id: "2", label: "2 people", emoji: "👫" },
  { id: "4", label: "Family (3-4)", emoji: "👨‍👩‍👧" },
  { id: "6", label: "Big family (5+)", emoji: "👨‍👩‍👧‍👦" },
];

const COOKING = [
  { id: "minimal", label: "Minimal Cooking", emoji: "⚡", desc: "15 min max, mostly assembly" },
  { id: "moderate", label: "Moderate", emoji: "🍳", desc: "30 min, some real cooking" },
  { id: "ambitious", label: "Love to Cook", emoji: "👨‍🍳", desc: "45+ min, bring it on" },
];

const BUDGET = [
  { id: "budget", label: "Budget-Friendly", emoji: "💰", desc: "~$50-80/week for 2" },
  { id: "moderate", label: "Moderate", emoji: "💳", desc: "~$80-120/week for 2" },
  { id: "premium", label: "Premium", emoji: "💎", desc: "~$120+/week for 2" },
];

const SPRING_PRODUCE = {
  vegetables: ["asparagus", "artichokes", "peas", "radishes", "spinach", "arugula", "spring onions", "snap peas", "fava beans", "new potatoes", "fennel", "watercress", "ramps", "baby carrots", "leeks"],
  fruits: ["strawberries", "rhubarb", "apricots", "cherries", "blood oranges"],
  herbs: ["chives", "mint", "dill", "parsley", "cilantro", "tarragon"],
};

const MEAL_DATABASE = {
  none: {
    minimal: {
      breakfasts: [
        { name: "Strawberry Overnight Oats", time: "5 min prep", seasonal: ["strawberries"], ingredients: ["rolled oats", "milk", "yogurt", "strawberries", "honey", "chia seeds"], instructions: "Mix oats, milk, yogurt, chia seeds. Top with sliced strawberries and honey. Refrigerate overnight. Grab and go!", calories: 380, protein: "14g" },
        { name: "Spring Veggie Egg Muffins", time: "10 min prep, make ahead", seasonal: ["spinach", "spring onions"], ingredients: ["eggs", "spinach", "spring onions", "cheese", "salt", "pepper"], instructions: "Whisk eggs with chopped spinach and spring onions. Pour into muffin tin, top with cheese. Bake 375°F for 20 min. Make 12, eat all week!", calories: 210, protein: "16g" },
        { name: "Avocado Toast with Radish", time: "5 min", seasonal: ["radishes"], ingredients: ["bread", "avocado", "radishes", "lemon", "red pepper flakes", "salt"], instructions: "Toast bread. Mash avocado with lemon and salt. Top with thinly sliced radishes and red pepper flakes.", calories: 320, protein: "8g" },
        { name: "Greek Yogurt Parfait", time: "3 min", seasonal: ["strawberries"], ingredients: ["Greek yogurt", "granola", "strawberries", "honey"], instructions: "Layer yogurt, granola, and sliced strawberries. Drizzle honey. Done!", calories: 350, protein: "20g" },
        { name: "Peanut Butter Banana Smoothie", time: "3 min", seasonal: [], ingredients: ["banana", "peanut butter", "milk", "oats", "honey"], instructions: "Blend everything until smooth. Pour and go.", calories: 420, protein: "16g" },
      ],
      lunches: [
        { name: "Spring Pea & Mint Wrap", time: "10 min", seasonal: ["peas", "mint"], ingredients: ["tortillas", "peas", "mint", "feta", "lemon", "arugula"], instructions: "Mash peas with mint, lemon, and feta. Spread on tortilla, add arugula, roll up. Easy to pack!", calories: 380, protein: "15g" },
        { name: "Strawberry Spinach Salad", time: "10 min", seasonal: ["strawberries", "spinach"], ingredients: ["spinach", "strawberries", "pecans", "goat cheese", "balsamic vinaigrette"], instructions: "Toss spinach with sliced strawberries, pecans, and crumbled goat cheese. Dress with balsamic vinaigrette.", calories: 340, protein: "12g" },
        { name: "Asparagus & White Bean Bowl", time: "12 min", seasonal: ["asparagus"], ingredients: ["asparagus", "white beans", "cherry tomatoes", "feta", "lemon", "olive oil", "rice or quinoa"], instructions: "Roast or sauté asparagus 5 min. Toss with beans, tomatoes, feta, lemon, and olive oil over grain.", calories: 420, protein: "18g" },
        { name: "Turkey & Arugula Sandwich", time: "5 min", seasonal: ["arugula"], ingredients: ["bread", "turkey", "arugula", "tomato", "mustard", "provolone"], instructions: "Layer turkey, provolone, arugula, tomato on bread. Add mustard. Classic!", calories: 380, protein: "28g" },
        { name: "Spring Roll Bowl (deconstructed)", time: "10 min", seasonal: ["snap peas", "mint", "cilantro"], ingredients: ["rice noodles", "snap peas", "carrots", "cucumber", "mint", "cilantro", "peanut sauce"], instructions: "Cook rice noodles. Top with sliced veggies and herbs. Drizzle peanut sauce.", calories: 390, protein: "12g" },
      ],
      dinners: [
        { name: "Lemon Herb Chicken with Asparagus", time: "15 min", seasonal: ["asparagus"], ingredients: ["chicken breast", "asparagus", "lemon", "garlic", "olive oil", "herbs"], instructions: "Season chicken with lemon, garlic, herbs. Pan-sear 6 min per side. Sauté asparagus alongside. Serve together.", calories: 420, protein: "38g" },
        { name: "Spring Pea Risotto (cheater's version)", time: "15 min", seasonal: ["peas", "parsley"], ingredients: ["arborio rice", "chicken broth", "peas", "parmesan", "butter", "parsley"], instructions: "Toast rice in butter 2 min. Add broth 1 cup at a time, stirring. Add peas last 3 min. Finish with parmesan and parsley.", calories: 480, protein: "16g" },
        { name: "Salmon with Radish & Snap Peas", time: "12 min", seasonal: ["radishes", "snap peas"], ingredients: ["salmon fillets", "snap peas", "radishes", "soy sauce", "sesame oil", "rice"], instructions: "Pan-sear salmon 4 min per side. Sauté snap peas and radishes 3 min. Serve over rice with soy-sesame drizzle.", calories: 520, protein: "36g" },
        { name: "One-Pan Sausage & Spring Veggies", time: "10 min prep", seasonal: ["new potatoes", "asparagus", "spring onions"], ingredients: ["sausages", "new potatoes", "asparagus", "spring onions", "olive oil", "herbs"], instructions: "Halve potatoes, cut asparagus. Toss everything on sheet pan with oil and herbs. Roast 400°F 25 min.", calories: 520, protein: "24g" },
        { name: "Shrimp Stir-Fry with Snap Peas", time: "12 min", seasonal: ["snap peas", "spring onions"], ingredients: ["shrimp", "snap peas", "spring onions", "garlic", "ginger", "soy sauce", "rice"], instructions: "Stir-fry shrimp 2 min, remove. Cook snap peas and spring onions 2 min. Combine with garlic, ginger, soy sauce. Serve over rice.", calories: 410, protein: "32g" },
      ],
    },
    moderate: {
      breakfasts: [
        { name: "Spring Frittata", time: "25 min", seasonal: ["asparagus", "peas", "chives"], ingredients: ["eggs", "asparagus", "peas", "chives", "goat cheese", "olive oil", "salt", "pepper"], instructions: "Sauté chopped asparagus 3 min. Beat 8 eggs with peas and chives. Pour over asparagus, dot with goat cheese. Cook stovetop 5 min, then broil 3 min until set. Slice for the week!", calories: 340, protein: "22g" },
        { name: "Strawberry Rhubarb Compote on Toast", time: "20 min", seasonal: ["strawberries", "rhubarb"], ingredients: ["strawberries", "rhubarb", "sugar", "lemon", "thick bread", "ricotta"], instructions: "Simmer chopped rhubarb and strawberries with sugar and lemon 15 min. Cool. Spread ricotta on toast, top with compote. Makes a jar for the week!", calories: 360, protein: "12g" },
        { name: "Spinach & Feta Breakfast Quesadilla", time: "10 min", seasonal: ["spinach"], ingredients: ["tortillas", "eggs", "spinach", "feta", "sun-dried tomatoes", "butter"], instructions: "Scramble eggs with spinach. Fill tortilla with eggs, feta, sun-dried tomatoes. Pan-crisp both sides.", calories: 420, protein: "24g" },
        { name: "Lemon Ricotta Pancakes", time: "20 min", seasonal: [], ingredients: ["ricotta", "eggs", "flour", "lemon zest", "baking powder", "butter", "maple syrup"], instructions: "Mix ricotta, eggs, flour, lemon zest, baking powder. Cook small pancakes in butter. Serve with maple syrup and fresh fruit.", calories: 450, protein: "18g" },
        { name: "Spring Green Smoothie Bowl", time: "10 min", seasonal: ["spinach", "strawberries", "mint"], ingredients: ["spinach", "banana", "strawberries", "mint", "yogurt", "granola", "coconut"], instructions: "Blend spinach, banana, strawberries, mint, yogurt until thick. Pour in bowl, top with granola, coconut, extra fruit.", calories: 380, protein: "14g" },
      ],
      lunches: [
        { name: "Asparagus Soup with Crusty Bread", time: "25 min", seasonal: ["asparagus", "leeks"], ingredients: ["asparagus", "leeks", "potato", "chicken broth", "cream", "bread"], instructions: "Sauté leeks 5 min. Add chopped asparagus, potato, broth. Simmer 15 min. Blend until smooth, add splash of cream. Serve with crusty bread.", calories: 340, protein: "12g" },
        { name: "Mediterranean Grain Bowl", time: "20 min", seasonal: ["arugula", "radishes"], ingredients: ["farro or quinoa", "arugula", "radishes", "chickpeas", "cucumber", "feta", "lemon-herb dressing"], instructions: "Cook grain. Top with arugula, sliced radishes, chickpeas, cucumber, feta. Dress with lemon-herb vinaigrette.", calories: 460, protein: "18g" },
        { name: "Spring Pesto Pasta Salad", time: "20 min", seasonal: ["peas", "arugula", "basil"], ingredients: ["pasta", "peas", "arugula", "cherry tomatoes", "mozzarella", "pesto"], instructions: "Cook pasta, toss with peas last 2 min. Drain, cool. Mix with arugula, tomatoes, mozzarella, pesto. Great cold for lunches!", calories: 480, protein: "20g" },
        { name: "Chicken & Snap Pea Lettuce Wraps", time: "15 min", seasonal: ["snap peas", "mint", "cilantro"], ingredients: ["chicken (cooked)", "snap peas", "carrots", "mint", "cilantro", "peanut sauce", "butter lettuce"], instructions: "Shred chicken, slice snap peas and carrots. Mix with herbs and peanut sauce. Spoon into lettuce cups.", calories: 350, protein: "30g" },
        { name: "Smashed New Potato & Spring Onion Flatbread", time: "25 min", seasonal: ["new potatoes", "spring onions"], ingredients: ["flatbread/naan", "new potatoes", "spring onions", "sour cream", "cheese", "chives"], instructions: "Boil potatoes, smash. Spread sour cream on flatbread, top with smashed potatoes, spring onions, cheese. Bake 400°F 12 min.", calories: 440, protein: "14g" },
      ],
      dinners: [
        { name: "Herb-Crusted Salmon with Pea Purée", time: "25 min", seasonal: ["peas", "mint", "dill"], ingredients: ["salmon", "peas", "mint", "dill", "lemon", "breadcrumbs", "olive oil"], instructions: "Blend peas with mint and lemon for purée. Press herb breadcrumbs onto salmon. Bake 400°F 15 min. Serve on pea purée.", calories: 520, protein: "40g" },
        { name: "Spring Chicken Stir-Fry", time: "20 min", seasonal: ["snap peas", "baby carrots", "spring onions"], ingredients: ["chicken thighs", "snap peas", "baby carrots", "spring onions", "garlic", "ginger", "teriyaki sauce", "rice"], instructions: "Slice chicken, stir-fry 5 min. Add veggies 3 min. Add garlic, ginger, teriyaki. Serve over rice.", calories: 480, protein: "34g" },
        { name: "Lemon Artichoke Pasta", time: "25 min", seasonal: ["artichokes", "parsley"], ingredients: ["pasta", "artichoke hearts", "garlic", "lemon", "parmesan", "white wine", "parsley", "olive oil"], instructions: "Cook pasta. Sauté garlic and artichokes in olive oil. Add white wine, lemon juice, reduce. Toss with pasta, parmesan, parsley.", calories: 520, protein: "18g" },
        { name: "Sheet Pan Chicken Thighs with Spring Veggies", time: "30 min", seasonal: ["asparagus", "new potatoes", "radishes"], ingredients: ["chicken thighs", "asparagus", "new potatoes", "radishes", "lemon", "herbs", "olive oil"], instructions: "Arrange chicken and halved potatoes on pan. Roast 400°F 15 min. Add asparagus and radishes, roast 15 more. Squeeze lemon over.", calories: 540, protein: "36g" },
        { name: "Fennel & Sausage Baked Rigatoni", time: "30 min", seasonal: ["fennel", "spinach"], ingredients: ["rigatoni", "Italian sausage", "fennel", "spinach", "marinara", "mozzarella", "parmesan"], instructions: "Cook pasta. Brown sausage with sliced fennel. Mix with spinach, marinara, and pasta. Top with cheese. Bake 375°F 15 min.", calories: 580, protein: "28g" },
      ],
    },
    ambitious: {
      breakfasts: [
        { name: "Asparagus & Gruyère Quiche", time: "45 min", seasonal: ["asparagus", "chives"], ingredients: ["pie crust", "eggs", "cream", "asparagus", "gruyère", "chives", "nutmeg"], instructions: "Blind bake crust 10 min. Whisk eggs, cream, nutmeg. Layer asparagus and gruyère in crust. Pour egg mixture. Bake 375°F 30 min. Slice for the week!", calories: 420, protein: "20g" },
        { name: "Ricotta Stuffed French Toast with Strawberries", time: "25 min", seasonal: ["strawberries"], ingredients: ["thick bread", "ricotta", "eggs", "cream", "vanilla", "strawberries", "powdered sugar", "maple syrup"], instructions: "Slice bread thick, cut pocket, stuff with ricotta. Dip in egg-cream-vanilla mixture. Cook in butter until golden. Top with macerated strawberries.", calories: 520, protein: "22g" },
        { name: "Spring Shakshuka", time: "30 min", seasonal: ["peas", "spinach", "dill"], ingredients: ["eggs", "peas", "spinach", "tomato sauce", "feta", "dill", "cumin", "bread"], instructions: "Simmer tomato sauce with cumin. Add spinach and peas. Make wells, crack eggs in. Cover, cook 8 min. Top with feta and dill. Serve with crusty bread.", calories: 380, protein: "24g" },
        { name: "Homemade Spring Herb Granola", time: "35 min", seasonal: ["mint"], ingredients: ["oats", "nuts", "seeds", "honey", "coconut oil", "dried strawberries", "mint", "vanilla"], instructions: "Mix oats, nuts, seeds with melted honey and coconut oil. Spread on pan. Bake 300°F 25 min, stirring halfway. Cool, add dried fruit. Lasts 2 weeks!", calories: 380, protein: "10g" },
      ],
      lunches: [
        { name: "Homemade Spring Minestrone", time: "35 min", seasonal: ["peas", "asparagus", "spinach", "leeks"], ingredients: ["leeks", "carrots", "celery", "asparagus", "peas", "spinach", "white beans", "small pasta", "chicken broth", "parmesan rind"], instructions: "Sauté leeks, carrots, celery 5 min. Add broth and parmesan rind, simmer 15 min. Add pasta and asparagus, cook 8 min. Add peas and spinach last minute. A pot lasts 4 lunches!", calories: 340, protein: "16g" },
        { name: "Spring Tart with Ricotta & Veggies", time: "40 min", seasonal: ["asparagus", "peas", "radishes"], ingredients: ["puff pastry", "ricotta", "asparagus", "peas", "radishes", "lemon zest", "egg", "herbs"], instructions: "Roll puff pastry. Spread ricotta mixed with lemon zest and herbs. Arrange asparagus, peas, sliced radishes. Brush edges with egg. Bake 400°F 25 min.", calories: 420, protein: "16g" },
        { name: "Falafel Bowl with Spring Tabbouleh", time: "35 min", seasonal: ["parsley", "mint", "radishes"], ingredients: ["chickpeas", "herbs", "garlic", "cumin", "bulgur", "parsley", "mint", "tomatoes", "radishes", "lemon", "tahini"], instructions: "Make falafel: blend chickpeas, herbs, garlic, cumin. Form patties, pan-fry. Make tabbouleh with bulgur, parsley, mint, tomatoes, radishes, lemon. Serve with tahini.", calories: 500, protein: "22g" },
        { name: "Vietnamese Spring Rolls (fresh)", time: "30 min", seasonal: ["mint", "cilantro"], ingredients: ["rice paper", "shrimp or tofu", "rice noodles", "lettuce", "cucumber", "mint", "cilantro", "carrots", "peanut dipping sauce"], instructions: "Soak rice paper, fill with noodles, protein, veggies, herbs. Roll tightly. Make 8-10 for the week. Serve with peanut sauce.", calories: 320, protein: "18g" },
      ],
      dinners: [
        { name: "Braised Chicken with Artichokes & Olives", time: "50 min", seasonal: ["artichokes"], ingredients: ["chicken thighs", "artichoke hearts", "olives", "white wine", "lemon", "garlic", "herbs", "chicken broth"], instructions: "Sear chicken 4 min per side. Remove. Sauté garlic, add artichokes, olives, wine, broth, lemon. Return chicken. Cover, braise 30 min. Fresh herbs to finish.", calories: 520, protein: "38g" },
        { name: "Homemade Spring Pea Ravioli", time: "60 min", seasonal: ["peas", "mint", "parsley"], ingredients: ["pasta dough or wonton wrappers", "peas", "ricotta", "mint", "parmesan", "butter", "sage"], instructions: "Blend peas with ricotta, mint, parmesan for filling. Use wonton wrappers as shortcut. Fill, seal, boil 3 min. Toss in browned butter with sage.", calories: 540, protein: "24g" },
        { name: "Lamb Chops with Mint Chimichurri", time: "25 min", seasonal: ["mint", "parsley"], ingredients: ["lamb chops", "mint", "parsley", "garlic", "red wine vinegar", "olive oil", "red pepper flakes", "roasted potatoes"], instructions: "Blend mint, parsley, garlic, vinegar, oil, pepper flakes for chimichurri. Season and sear lamb chops 3-4 min per side. Rest 5 min. Spoon chimichurri over. Serve with roasted potatoes.", calories: 580, protein: "36g" },
        { name: "Miso Glazed Cod with Spring Slaw", time: "30 min", seasonal: ["radishes", "snap peas", "cilantro"], ingredients: ["cod fillets", "white miso", "mirin", "sesame oil", "radishes", "snap peas", "cabbage", "cilantro", "rice vinegar", "rice"], instructions: "Marinate cod in miso-mirin-sesame mix. Broil 8 min. Shred radishes, snap peas, cabbage, cilantro. Dress with rice vinegar and sesame oil. Serve fish over rice with slaw.", calories: 460, protein: "34g" },
        { name: "Stuffed Bell Peppers with Spring Herbs", time: "45 min", seasonal: ["parsley", "dill", "spring onions"], ingredients: ["bell peppers", "ground turkey or beef", "rice", "spring onions", "parsley", "dill", "tomato sauce", "feta"], instructions: "Mix cooked rice, browned meat, spring onions, herbs, and tomato sauce. Stuff halved peppers. Top with feta. Bake 375°F 30 min.", calories: 480, protein: "28g" },
      ],
    },
  },
  vegetarian: {
    minimal: {
      breakfasts: [
        { name: "Avocado Toast with Everything Seasoning", time: "5 min", seasonal: ["radishes"], ingredients: ["bread", "avocado", "everything seasoning", "lemon", "radishes"], instructions: "Toast bread. Mash avocado with lemon. Spread, sprinkle everything seasoning, top with sliced radishes.", calories: 320, protein: "8g" },
        { name: "Berry Overnight Oats", time: "5 min prep", seasonal: ["strawberries"], ingredients: ["oats", "yogurt", "milk", "strawberries", "maple syrup", "chia seeds"], instructions: "Combine oats, yogurt, milk, chia seeds, maple syrup. Top with berries. Refrigerate overnight.", calories: 380, protein: "14g" },
        { name: "Peanut Butter Banana Toast", time: "3 min", seasonal: [], ingredients: ["bread", "peanut butter", "banana", "honey", "cinnamon"], instructions: "Toast bread, spread PB, add banana slices, drizzle honey, dust with cinnamon.", calories: 400, protein: "12g" },
      ],
      lunches: [
        { name: "Caprese Grain Bowl", time: "10 min", seasonal: ["arugula"], ingredients: ["quinoa or farro", "mozzarella", "cherry tomatoes", "arugula", "basil", "balsamic glaze"], instructions: "Top cooked grain with torn mozzarella, halved tomatoes, arugula, basil. Drizzle balsamic glaze.", calories: 440, protein: "20g" },
        { name: "Hummus & Veggie Wrap", time: "5 min", seasonal: ["spinach", "radishes"], ingredients: ["tortilla", "hummus", "spinach", "radishes", "cucumber", "carrots", "feta"], instructions: "Spread hummus on tortilla. Layer veggies and feta. Roll up tight.", calories: 380, protein: "14g" },
        { name: "Spring Pea & Ricotta Toast", time: "10 min", seasonal: ["peas", "mint"], ingredients: ["thick bread", "ricotta", "peas", "mint", "lemon", "olive oil", "red pepper flakes"], instructions: "Warm peas, mash lightly with mint and lemon. Toast bread, spread ricotta, top with peas and olive oil.", calories: 360, protein: "16g" },
      ],
      dinners: [
        { name: "Veggie Quesadilla with Spinach & Beans", time: "10 min", seasonal: ["spinach"], ingredients: ["tortillas", "black beans", "spinach", "corn", "cheese", "salsa", "sour cream"], instructions: "Fill tortilla with beans, spinach, corn, cheese. Pan-crisp both sides. Serve with salsa and sour cream.", calories: 460, protein: "20g" },
        { name: "Mushroom & Asparagus Stir-Fry", time: "12 min", seasonal: ["asparagus", "spring onions"], ingredients: ["mushrooms", "asparagus", "spring onions", "tofu", "soy sauce", "garlic", "ginger", "rice"], instructions: "Stir-fry cubed tofu until crisp. Add sliced mushrooms and asparagus. Season with garlic, ginger, soy sauce. Serve over rice.", calories: 400, protein: "22g" },
        { name: "One-Pot Pasta Primavera", time: "15 min", seasonal: ["peas", "asparagus", "spinach"], ingredients: ["pasta", "peas", "asparagus", "spinach", "garlic", "parmesan", "lemon", "olive oil"], instructions: "Cook pasta. Last 3 min add asparagus and peas. Drain, toss with spinach (it wilts), garlic oil, lemon, parmesan.", calories: 480, protein: "18g" },
      ],
    },
  },
  vegan: {
    minimal: {
      breakfasts: [
        { name: "Chia Pudding with Mango", time: "5 min prep", seasonal: [], ingredients: ["chia seeds", "oat milk", "maple syrup", "mango", "coconut flakes"], instructions: "Mix chia seeds with oat milk and maple syrup. Refrigerate overnight. Top with mango and coconut.", calories: 340, protein: "8g" },
        { name: "PB & Banana Smoothie", time: "3 min", seasonal: [], ingredients: ["banana", "peanut butter", "oat milk", "oats", "maple syrup"], instructions: "Blend everything until smooth.", calories: 420, protein: "14g" },
        { name: "Avocado Toast with White Beans", time: "5 min", seasonal: ["arugula"], ingredients: ["bread", "avocado", "white beans", "lemon", "arugula", "red pepper flakes"], instructions: "Toast bread. Mash avocado and beans together with lemon. Top with arugula and red pepper flakes.", calories: 380, protein: "14g" },
      ],
      lunches: [
        { name: "Buddha Bowl", time: "10 min", seasonal: ["spinach", "radishes"], ingredients: ["quinoa", "chickpeas", "spinach", "radishes", "avocado", "tahini dressing"], instructions: "Assemble quinoa, roasted chickpeas, spinach, sliced radishes, avocado. Drizzle tahini dressing.", calories: 460, protein: "18g" },
        { name: "Spring Roll Bowl", time: "10 min", seasonal: ["snap peas", "mint", "cilantro"], ingredients: ["rice noodles", "snap peas", "carrots", "cucumber", "mint", "cilantro", "peanut sauce"], instructions: "Cook noodles. Top with sliced veggies and herbs. Drizzle peanut sauce.", calories: 390, protein: "12g" },
        { name: "Lentil & Arugula Salad", time: "10 min", seasonal: ["arugula"], ingredients: ["lentils (precooked)", "arugula", "sun-dried tomatoes", "red onion", "lemon vinaigrette"], instructions: "Toss lentils with arugula, sun-dried tomatoes, red onion. Dress with lemon vinaigrette.", calories: 380, protein: "20g" },
      ],
      dinners: [
        { name: "Coconut Curry with Spring Veggies", time: "15 min", seasonal: ["peas", "snap peas", "spinach"], ingredients: ["coconut milk", "curry paste", "tofu", "peas", "snap peas", "spinach", "rice"], instructions: "Simmer coconut milk with curry paste. Add cubed tofu, peas, snap peas. Cook 5 min. Stir in spinach. Serve over rice.", calories: 480, protein: "20g" },
        { name: "Black Bean Tacos with Spring Slaw", time: "12 min", seasonal: ["radishes", "cilantro"], ingredients: ["black beans", "taco shells", "cabbage", "radishes", "cilantro", "lime", "avocado"], instructions: "Warm seasoned black beans. Shred cabbage and radishes for slaw, dress with lime. Fill tacos with beans, slaw, avocado, cilantro.", calories: 440, protein: "16g" },
        { name: "Peanut Noodles with Snap Peas", time: "12 min", seasonal: ["snap peas", "spring onions"], ingredients: ["noodles", "peanut butter", "soy sauce", "lime", "garlic", "snap peas", "spring onions", "sesame seeds"], instructions: "Cook noodles. Whisk peanut butter, soy sauce, lime, garlic. Toss noodles with sauce, sautéed snap peas, spring onions. Top with sesame seeds.", calories: 500, protein: "18g" },
      ],
    },
  },
};

function getMeals(diet, cooking) {
  const dietKey = ["none", "vegetarian", "vegan"].includes(diet) ? diet : "none";
  const cookKey = ["minimal", "moderate", "ambitious"].includes(cooking) ? cooking : "minimal";
  const dietMeals = MEAL_DATABASE[dietKey];
  if (!dietMeals) return MEAL_DATABASE.none.minimal;
  return dietMeals[cookKey] || dietMeals.minimal || MEAL_DATABASE.none.minimal;
}

function generateWeek(meals) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const b = meals.breakfasts || [];
  const l = meals.lunches || [];
  const d = meals.dinners || [];

  return days.map((day, i) => ({
    day,
    breakfast: b[i % b.length],
    lunch: l[i % l.length],
    dinner: d[i % d.length],
  }));
}

function buildGroceryList(weekPlan) {
  const all = {};
  weekPlan.forEach((day) => {
    [day.breakfast, day.lunch, day.dinner].forEach((meal) => {
      if (!meal) return;
      meal.ingredients.forEach((ing) => {
        const key = ing.toLowerCase();
        all[key] = (all[key] || 0) + 1;
      });
    });
  });
  return Object.entries(all).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
}

export default function MealPrepPlanner() {
  const [diet, setDiet] = useState("");
  const [household, setHousehold] = useState("");
  const [cooking, setCooking] = useState("");
  const [budget, setBudget] = useState("");
  const [weekPlan, setWeekPlan] = useState(null);
  const [groceryList, setGroceryList] = useState([]);
  const [expandedDay, setExpandedDay] = useState({});
  const [checked, setChecked] = useState({});
  const [showGrocery, setShowGrocery] = useState(false);
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
    const meals = getMeals(diet, cooking);
    const week = generateWeek(meals);
    setWeekPlan(week);
    setGroceryList(buildGroceryList(week));
    setChecked({});
    setExpandedDay({"Monday": true});
    setShowGrocery(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const toggleCheck = (key) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  const canGenerate = diet && household && cooking && budget;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #e8f5e9 0%, #fffde7 30%, #fff3e0 60%, #fce4ec 100%)",
      fontFamily: "'Nunito', sans-serif", position: "relative", overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap" rel="stylesheet" />
      {["🥗", "🍓", "🌿", "🥕", "🍋", "🫛"].map((e, i) => (
        <div key={i} style={{ position: "absolute", top: `${5 + i * 15}%`, [i % 2 ? "right" : "left"]: `${2 + (i % 3) * 2}%`, fontSize: 22, opacity: 0.1, pointerEvents: "none" }}>{e}</div>
      ))}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🥗🍓🌿</div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(26px, 5vw, 38px)", color: "#e65100", margin: "0 0 8px", textShadow: "2px 2px 0 rgba(255,255,255,0.7)" }}>Spring Meal Prep Planner</h1>
          <p style={{ color: "#ff8a65", fontSize: 15, margin: 0, fontWeight: 600 }}>Seasonal recipes, zero decision fatigue — your week of meals, planned!</p>
        </div>

        {/* Spring produce highlight */}
        <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 16, padding: "16px 20px", marginBottom: 20, border: "2px solid #c8e6c9" }}>
          <div style={{ fontWeight: 800, color: "#2e7d32", fontSize: 14, marginBottom: 8 }}>🌱 What's in season this spring:</div>
          <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>
            <span style={{ fontWeight: 700, color: "#558b2f" }}>Veggies:</span> {SPRING_PRODUCE.vegetables.slice(0, 8).join(", ")} · <span style={{ fontWeight: 700, color: "#c62828" }}>Fruits:</span> {SPRING_PRODUCE.fruits.join(", ")} · <span style={{ fontWeight: 700, color: "#2e7d32" }}>Herbs:</span> {SPRING_PRODUCE.herbs.join(", ")}
          </div>
        </div>

        <Section num="1" title="Dietary preferences?" color="#e65100">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
            {DIETS.map((d) => (<Btn key={d.id} active={diet === d.id} onClick={() => setDiet(d.id)} color="#e65100"><div style={{ fontSize: 22 }}>{d.emoji}</div><div style={{ fontWeight: 700, fontSize: 12 }}>{d.label}</div></Btn>))}
          </div>
        </Section>
        <Section num="2" title="Household size?" color="#e65100">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
            {HOUSEHOLD.map((h) => (<Btn key={h.id} active={household === h.id} onClick={() => setHousehold(h.id)} color="#e65100"><div style={{ fontSize: 22 }}>{h.emoji}</div><div style={{ fontWeight: 800, fontSize: 13 }}>{h.label}</div></Btn>))}
          </div>
        </Section>
        <Section num="3" title="Cooking comfort level?" color="#e65100">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {COOKING.map((c) => (<Btn key={c.id} active={cooking === c.id} onClick={() => setCooking(c.id)} color="#e65100" wide><span style={{ fontSize: 22, marginRight: 12 }}>{c.emoji}</span><div><div style={{ fontWeight: 800 }}>{c.label}</div><div style={{ fontSize: 12, opacity: 0.65 }}>{c.desc}</div></div></Btn>))}
          </div>
        </Section>
        <Section num="4" title="Weekly grocery budget?" color="#e65100">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {BUDGET.map((b) => (<Btn key={b.id} active={budget === b.id} onClick={() => setBudget(b.id)} color="#e65100" wide><span style={{ fontSize: 22, marginRight: 12 }}>{b.emoji}</span><div><div style={{ fontWeight: 800 }}>{b.label}</div><div style={{ fontSize: 12, opacity: 0.65 }}>{b.desc}</div></div></Btn>))}
          </div>
        </Section>

        {canGenerate && (
          <button onClick={generate} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #e65100, #ff8a65)", color: "#fff", fontFamily: "'Fredoka One', cursive", fontSize: 20, cursor: "pointer", marginBottom: 24, boxShadow: "0 4px 20px rgba(230,81,0,0.3)", transition: "transform 0.15s" }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
            🥗 Plan My Week!
          </button>
        )}

        {weekPlan && (
          <div ref={resultRef}>
            <button
              onClick={() => downloadPDF(resultRef.current, 'meal-prep-plan.pdf')}
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
            {/* Toggle tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button onClick={() => setShowGrocery(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: !showGrocery ? "2px solid #e65100" : "2px solid #e0e0e0", background: !showGrocery ? "#fff3e0" : "#fff", fontWeight: 800, fontSize: 14, color: !showGrocery ? "#e65100" : "#999", cursor: "pointer", fontFamily: "inherit" }}>📅 Meal Plan</button>
              <button onClick={() => setShowGrocery(true)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: showGrocery ? "2px solid #e65100" : "2px solid #e0e0e0", background: showGrocery ? "#fff3e0" : "#fff", fontWeight: 800, fontSize: 14, color: showGrocery ? "#e65100" : "#999", cursor: "pointer", fontFamily: "inherit" }}>🛒 Grocery List ({groceryList.length} items)</button>
            </div>

            {!showGrocery ? (
              <div>
                {weekPlan.map((day) => {
                  const isExpanded = !!expandedDay[day.day];
                  return (
                    <div key={day.day} style={{ marginBottom: 8 }}>
                      <div onClick={() => setExpandedDay(prev => ({...prev, [day.day]: !prev[day.day]}))} style={{ padding: "14px 18px", borderRadius: isExpanded ? "14px 14px 0 0" : 14, background: isExpanded ? "#fff3e0" : "rgba(255,255,255,0.88)", border: isExpanded ? "2px solid #ffcc80" : "2px solid rgba(230,81,0,0.06)", borderBottom: isExpanded ? "none" : undefined, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontWeight: 800, color: isExpanded ? "#e65100" : "#555", fontSize: 15 }}>{day.day}</span>
                          {!isExpanded && <span style={{ fontSize: 12, color: "#bbb", marginLeft: 10 }}>{day.breakfast?.name} · {day.lunch?.name} · {day.dinner?.name}</span>}
                        </div>
                        <span style={{ color: "#ccc", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                      </div>
                      {isExpanded && (
                        <div style={{ border: "2px solid #ffcc80", borderTop: "none", borderRadius: "0 0 14px 14px", padding: "16px 18px", background: "#fffaf3" }}>
                          {[
                            { label: "🌅 Breakfast", meal: day.breakfast },
                            { label: "☀️ Lunch", meal: day.lunch },
                            { label: "🌙 Dinner", meal: day.dinner },
                          ].map(({ label, meal }) => meal && (
                            <div key={label} style={{ marginBottom: 16, padding: "14px 16px", background: "#fff", borderRadius: 12, border: "1.5px solid #f0f0f0" }}>
                              <div style={{ fontSize: 12, color: "#e65100", fontWeight: 800, marginBottom: 4 }}>{label}</div>
                              <div style={{ fontWeight: 800, color: "#333", fontSize: 16, marginBottom: 6 }}>{meal.name}</div>
                              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                                <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>⏱️ {meal.time}</span>
                                <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>🔥 {meal.calories} cal</span>
                                <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>💪 {meal.protein} protein</span>
                              </div>
                              {meal.seasonal?.length > 0 && (
                                <div style={{ fontSize: 11, color: "#43a047", fontWeight: 700, marginBottom: 6 }}>🌱 Seasonal: {meal.seasonal.join(", ")}</div>
                              )}
                              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 8 }}>
                                <span style={{ fontWeight: 700 }}>How to make it:</span> {meal.instructions}
                              </div>
                              <div style={{ fontSize: 12, color: "#999" }}>
                                <span style={{ fontWeight: 700 }}>Ingredients:</span> {meal.ingredients.join(", ")}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "22px", border: "2px solid #ffcc80" }}>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", color: "#e65100", margin: "0 0 4px", fontSize: 18 }}>🛒 Weekly Grocery List</h3>
                <p style={{ fontSize: 12, color: "#999", margin: "0 0 16px", fontWeight: 600 }}>
                  Scaled for {HOUSEHOLD.find(h => h.id === household)?.label || "your household"} · Check off as you shop!
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {groceryList.map((item, i) => {
                    const key = `grocery-${i}`;
                    const done = checked[key];
                    return (
                      <div key={i} onClick={() => toggleCheck(key)} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10,
                        background: done ? "#e8f5e9" : "#fafafa", cursor: "pointer", transition: "all 0.2s",
                        border: done ? "1.5px solid #a5d6a7" : "1.5px solid transparent",
                      }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 5,
                          border: done ? "2px solid #66bb6a" : "2px solid #ddd",
                          background: done ? "#66bb6a" : "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, color: "#fff", fontWeight: 800, flexShrink: 0,
                        }}>{done ? "✓" : ""}</div>
                        <span style={{ fontSize: 14, color: done ? "#999" : "#444", textDecoration: done ? "line-through" : "none", fontWeight: done ? 400 : 600, flex: 1 }}>
                          {item.name}
                        </span>
                        {item.count > 1 && (
                          <span style={{ fontSize: 11, color: "#bbb", fontWeight: 700 }}>×{item.count} meals</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <button
              onClick={() => downloadPDF(resultRef.current, 'meal-prep-plan.pdf')}
              style={{
                width: "100%",
                marginTop: 16,
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
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#ffcc80", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🥗🍓🌿</div>
          Spring Meal Prep Planner — Eat seasonal, save time, feel great!
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, color, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "22px 24px", marginBottom: 20, boxShadow: "0 3px 16px rgba(230,81,0,0.06)", border: "2px solid rgba(230,81,0,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, #ff8a65)`, color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{num}</div>
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
