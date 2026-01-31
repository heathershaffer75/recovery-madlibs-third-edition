(function(){
  const $ = (q) => document.querySelector(q);
  const h = (tag, attrs={}, ...children) => {
    const el = document.createElement(tag);
    for (const [k,v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v;
      else if (k === 'for') el.htmlFor = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k,v);
    }
    for (const c of children) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    return el;
  };
  const rand = (arr) => arr[Math.floor(Math.random()*arr.length)];
  const toTitle = (s) => s.replace(/[-_]/g,' ').replace(/\b\w/g, m => m.toUpperCase());

  // --- Pools (used for Random Fill + 🎯 Suggest)
  const pools = {
    patientNames: ["Alex","Jordan","Taylor","Sam","Riley","Casey","Morgan","Blake","Quinn","Drew","Avery","Reese"],
    staffNames: ["Pat","Lee","Avery","Chris","Jamie","Cameron","Dana","Rowan","Sky","Jordan"],
    staffRoles: ["counselor","tech","nurse","case manager","facilitator","therapist","supervisor"],
    emotions: ["annoyed","panicked","hopeful","spicy","overwhelmed","embarrassed","ashamed","relieved","irritated","weirdly calm","defensive","sad"],
    adjectives: ["chaotic","sparkly","mysterious","crispy","dizzy","zen-ish","dramatic","mellow","unhinged","suspicious","elite","tragic"],
    buzzword: ["radical acceptance","HALT","pink cloud","sponsor call","values in action","urge surfing","distress tolerance","CBT worksheet","accountability buddy","mindful breathing","dopamine detox","SMART goal","gratitude list","opposite action","nervous system reset"],
    catchphrase: ["We do hard things!","Not today, chaos!","Progress, not perfection!","Say less—recover more!","Still here, still sober!","Breathe it out!","I am choosing peace!"],
    funnyObject: ["emotional support stapler","glittery stress potato","therapy kazoo","rubber chicken","pocket gong","dramatic cape","mini traffic cone","foam sword","mystery whistle"],
    pluralNoun: ["coping skills","snacks","affirmations","plush llamas","group notebooks","invisible trophies","sticky notes","wellness stickers","chair squeaks","emotional plot twists"],
    object: ["clipboard","whiteboard marker","yoga block","traffic cone","ring light","folding chair","extension cord","glitter jar","megaphone","paper crown","tumbler cup"],
    animals: ["squirrel","pigeon","goose","cat","goldfish","hamster","chinchilla","raccoon"],
    liquids: ["emotional espresso","sparkling pickle juice","glow-stick soup","sparkle water","unicorn latte","accountability broth"],
    drinks: ["lukewarm coffee","electrolyte juice","mystery tea","herbal turbo tea","seltzer with vibes"],
    locations: ["the lobby","the group room","the hallway","the nurses' station","the parking lot","the vending machines","the art room","the smoke pit"],
    timeOfDay: ["this morning","after lunch","at 2:47pm","right before group","at 4:53am","during dinner"],
    bodyParts: ["left eyebrow","right pinky toe","core","hip flexor","shoulder","jaw"],
    snacks: ["a granola bar","a protein shake","a bag of chips","a suspicious brownie","a banana","a cookie"],
    verbs: ["debate","sidestep","moonwalk","murmur","power-walk","air-drum","panic-text","overexplain","spiral","freeze"],
    verbIng: ["over-explaining","dramatic sighing","interpretive dancing","speed-walking","micro-napping","panic-texting","doomscrolling","rehearsing arguments"],
    phrases: ["We’re just noticing patterns.","Name it to tame it.","Stay in the room.","Let’s keep it simple.","Do the next right thing.","Breathe, then speak.","That’s a nervous system moment."],
    stores: ["Walmart","Target","Kroger","Meijer","Dollar General"],
    aisles: ["snack aisle","coffee aisle","cleaning aisle","cereal aisle","frozen section"]
  };

  const chipList = [
    ...pools.buzzword.slice(0,10),
    ...pools.catchphrase.slice(0,5),
    "urge surfing","values in action","radical acceptance","opposite action","anchor breath","grounding list","gratitude rampage"
  ];

  // --- Suggestion rules by placeholder key
  // Goal: Random Fill should fill *every* field so nothing looks "broken" on the TV.
  function suggestFor(key){
    const k = (key||"").toLowerCase();

    // names
    if (/^patient\d$/.test(k)) return rand(pools.patientNames);
    if (/^staff\d$/.test(k)) return rand(pools.staffNames);

    // numbers / timing
    if (k.includes("number") || k.includes("seconds") || k.includes("minutes") || k.includes("days") || k.includes("weeks")) {
      return String(rand([2,3,4,5,7,9,12,15,20,30,45,60]));
    }
    if (k.includes("time_of_day") || (k.includes("time") && !k.includes("timeframe"))) return rand(pools.timeOfDay);
    if (k.includes("timeframe")) return rand(["today","this week","by Friday","in 24 hours","in the next 10 minutes","before lunch"]);

    // vibe words
    if (k.includes("emotion")) return rand(pools.emotions);
    if (k.includes("adjective") || k.includes("trait") || k.includes("negative_trait")) return rand(pools.adjectives);
    if (k.includes("buzzword") || k.includes("coping") || k.includes("concept")) return rand(pools.buzzword);
    if (k.includes("catchphrase")) return rand(pools.catchphrase);
    if (k.includes("staff_phrase") || k.includes("self_talk") || k.includes("reality_statement") || k.includes("polite_phrase") || k.includes("acceptance_sentence") || k.includes("simpler_sentence")) return rand(pools.phrases);

    // actions
    if (k.includes("verb_ing")) return rand(pools.verbIng);
    if (k === "verb" || k.includes("verb_")) return rand(pools.verbs);

    // places / things
    if (k.includes("location") || k.includes("other_location") || k.includes("place")) return rand(pools.locations);
    if (k.includes("store")) return rand(pools.stores);
    if (k.includes("aisle")) return rand(pools.aisles);

    // objects / sensory
    if (k.includes("snack") || k.includes("small_reward")) return rand(pools.snacks);
    if (k.includes("drink")) return rand(pools.drinks);
    if (k.includes("liquid")) return rand(pools.liquids);
    if (k.includes("animal")) return rand(pools.animals);
    if (k.includes("body_part") || k.includes("physical")) return rand(pools.bodyParts);
    if (k.includes("object")) return rand(pools.object);
    if (k.includes("random_object") || k.includes("funny_object")) return rand(pools.funnyObject);
    if (k.includes("plural")) return rand(pools.pluralNoun);

    // roles / people
    if (k.includes("staff_role") || k.includes("another_staff_role") || k.includes("random_staff_role")) return rand(pools.staffRoles);
    if (k.includes("person_name") || k.includes("secondary_person") || k.includes("family_member")) return rand(["Chris","Jamie","Alexis","Taylor","Jordan","Casey","Riley","Morgan","Aunt Linda","Uncle Mike","My cousin"]);
    if (k.includes("other_patient_name")) return rand(pools.patientNames);

    // message-y fields
    if (k.includes("text") || k.includes("line") || k.includes("sentence") || k.includes("response") || k.includes("comment") || k.includes("comeback")) {
      return rand([
        "I’m trying, okay?",
        "Respectfully, no.",
        "I hear you… and I’m still not doing that.",
        "That’s not a boundary, that’s a hostage note.",
        "Thanks for the feedback. I will ignore it responsibly.",
        "I’m choosing peace… aggressively."
      ]);
    }

    // topics / triggers / items
    if (k.includes("topic") || k.includes("group_topic") || k.includes("neutral_topic")) return rand(["boundaries","trust","cravings","stress","family stuff","identity","accountability"]);
    if (k.includes("trigger")) return rand(["a smell from the old days","a specific song","a text from the past","seeing someone who reminds me of using","the words 'you should'"]);
    if (k.includes("item_to_buy")) return rand(["eggs","coffee","laundry detergent","toothpaste","a salad I won’t eat"]);
    if (k.includes("weird_food")) return rand(["anchovy cupcakes","pepperoni popsicles","broccoli brownies","pineapple pickles"]);

    // ultimate fallback: never return blank (so buttons feel reliable)
    return rand([
      "something suspicious",
      "a deeply unnecessary detail",
      "a chaotic little moment",
      "an emotional plot twist",
      "a normal thing that my brain made dramatic",
      "a regret I’ll replay later"
    ]);
  }


  const data = window.APP_DATA;
  if (!data || !data.editions) {
    alert("Missing data.js. Make sure data.js is in the same folder as index.html.");
    return;
  }

  const editionSel = $("#edition");
  const storySel = $("#story");
  const inputsWrap = $("#inputs");

  const outTitle = $("#outTitle");
  const outBody = $("#outBody");

  const storyTitle = $("#storyTitle");
  const storyMeta = $("#storyMeta");

  const chipsWrap = $("#chips");

  function collectPlaceholders(paragraphs){
    const set = new Set();
    const re = /{{(.*?)}}/g;
    for (const p of paragraphs) {
      let m; while ((m = re.exec(p))) set.add(m[1]);
    }
    return Array.from(set).sort((a,b)=> a.localeCompare(b));
  }

  function getEdition(){
    const key = editionSel.value;
    return data.editions.find(e => e.key === key) || data.editions[0];
  }

  function getStory(){
    const ed = getEdition();
    return ed.stories[storySel.value|0] || ed.stories[0];
  }

  function renderEditionOptions(){
    editionSel.innerHTML = "";
    data.editions.forEach((e)=> editionSel.appendChild(h("option",{value:e.key}, e.label)));
  }

  function renderStoryOptions(){
    const ed = getEdition();
    storySel.innerHTML = "";
    ed.stories.forEach((s,i)=> storySel.appendChild(h("option",{value:i}, `${i+1}. ${s.title}`)));
    storySel.value = 0;
  }

  function renderForm(){
    const s = getStory();
    storyTitle.textContent = s.title;
    storyMeta.textContent = s.meta;

    inputsWrap.innerHTML = "";
    const keys = collectPlaceholders(s.paragraphs);

    for (const k of keys) {
      const id = "fld_"+k;
      const label = toTitle(k)
        .replace(/^Patient\d$/i, (m)=> m.replace("patient","Patient "))
        .replace(/^Staff\d$/i, (m)=> m.replace("staff","Staff "));

      const row = h("div",{class:"input-row"},
        h("label",{for:id}, label),
        h("input",{id, type:"text", placeholder:"Type here…"}),
        h("button",{class:"ghost", title:"Suggest value", onclick: () => { document.getElementById(id).value = suggestFor(k); }}, "🎯")
      );
      inputsWrap.appendChild(row);
    }

    const first = inputsWrap.querySelector("input");
    if (first) first.focus();
    outTitle.textContent = "Your Story Will Appear Here";
    outBody.innerHTML = "";
  }

  function fillRandom(){
    inputsWrap.querySelectorAll("input").forEach(inp => {
      const key = inp.id.replace("fld_","");
      const v = suggestFor(key);
      inp.value = v || inp.value || "";
    });
  }

  function clearAll(){
    inputsWrap.querySelectorAll("input").forEach(inp => inp.value="");
    outTitle.textContent = "Your Story Will Appear Here";
    outBody.innerHTML = "";
  }

  function renderStory(){
    const s = getStory();
    const values = {};
    inputsWrap.querySelectorAll("input").forEach(inp => {
      const key = inp.id.replace("fld_","");
      values[key] = inp.value || suggestFor(key) || "";
    });

    const re = /{{(.*?)}}/g;
    const paras = s.paragraphs.map(p => p.replace(re, (_,k)=> values[k] ?? ""));
    outTitle.textContent = s.title;

    outBody.innerHTML = "";
    for (const pa of paras) outBody.appendChild(h("div",{class:"para"}, pa));
    outBody.scrollIntoView({behavior:"smooth"});
  }

  async function copyOut(){
    const title = outTitle.textContent.trim();
    const paras = Array.from(document.querySelectorAll("#outBody .para")).map(p => p.textContent.trim());
    if (!title || paras.length === 0){ alert("Generate a story first, then copy."); return; }
    const payload = `# ${title}\n\n` + paras.map(p => p + "\n").join("\n");
    try {
      await navigator.clipboard.writeText(payload);
      alert("Story copied to clipboard!");
    } catch(e){
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(outBody);
      sel.removeAllRanges();
      sel.addRange(range);
      alert("Select & copy (Ctrl/Cmd+C).");
    }
  }

  // Chips
  chipList.forEach(txt => chipsWrap.appendChild(h("span",{class:"chip"}, txt)));

  // Events
  editionSel.addEventListener("change", () => {
    renderStoryOptions();
    renderForm();
  });
  storySel.addEventListener("change", renderForm);

  $("#randomBtn").addEventListener("click", fillRandom);
  $("#clearBtn").addEventListener("click", clearAll);
  $("#generateBtn").addEventListener("click", renderStory);
  $("#copyBtn").addEventListener("click", copyOut);

  // Init
  console.log('Recovery Mad Libs app loaded:', data.editions.map(e=>e.label).join(' + '));
  renderEditionOptions();
  editionSel.value = "third";
  renderStoryOptions();
  renderForm();
})();