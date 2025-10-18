// Utility random helpers
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;

// --- Data Tables ---
const keyWords = [
    "LIFESTEAL",
    "ENCHANTED",
    "PROPERTY",
    "PROPERTIES",
    "FRIEND",
    "AQUATIC",
    "REGEN",
    "HEAL",
    "SHIELD",
    "WEAPON",
    "SMALL",
    "MEDIUM",
    "LARGE",
    "FLYING",
    "FREEZE",
    "AMMO",
    "CORE",
    "DINOSAUR",
    "FOOD",
    "POISON",
    "BURN",
    "POTION",
    "QUEST",
    "RAY",
    "SLOW",
    "HASTE",
    "TECH",
    "TOOL",
    "TOY",
    "VEHICLE",
    "BRONZE",
    "SILVER",
    "GOLD",
    "LEGENDARY",
    "RELOAD",
    "CHARGE",
    "ENCHANT",
    "MULTICAST",
    "SIZE",
    "RARITY",
    "DESTROY",
    "DESTROYED",
    "HEALTH",
    "NEUTRAL",
    "COOLDOWN",
];

function highlightKeywords(html) {
    if (!html) return html;
    // Sort keywords by length (longest first) to avoid substring collisions
    const sortedKeywords = [...keyWords].sort((a, b) => b.length - a.length);
    const escapedKeywords = sortedKeywords.map((k) =>
        k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const regex = new RegExp(`\\b(${escapedKeywords.join("|")})s?\\b`, "gi");
    // Split HTML into text and tags
    const parts = html.split(/(<[^>]*>)/g);
    return parts
        .map((part, index) => {
            // Only process text nodes
            if (index % 2 === 0) {
                return part.replace(regex, (kw) => {
                    // Always add the base class (no trailing s)
                    let base = kw;
                    let classes = [];
                    // Add class for the original matched keyword
                    classes.push(
                        "keyword-" +
                            kw.charAt(0).toUpperCase() +
                            kw.slice(1).toLowerCase()
                    );
                    // If ends with 's', also add class for singular
                    if (/s$/i.test(kw)) {
                        base = kw.replace(/s$/i, "");
                        if (base.length > 0) {
                            classes.push(
                                "keyword-" +
                                    base.charAt(0).toUpperCase() +
                                    base.slice(1).toLowerCase()
                            );
                        }
                    }
                    return `<span class="${classes.join(" ")}">${kw}</span>`;
                });
            }
            return part;
        })
        .join("");
}

const passiveAttributes = [
    "Cooldown",
    "% Cooldown",
    "Regen",
    "Heal",
    "Shield",
    "Damage",
    "Poison",
    "Burn",
];

function generatePassiveValue(attr) {
    let value;

    switch (attr) {
        case "Cooldown":
            // Random between -10% and +10%
            value = Math.floor(Math.random() * 21 - 10);
            if (value > 0) {
                value = "+" + value;
            }
            value = value + "s";
            break;
        case "% Cooldown":
            // Random between -100% and +100%
            value = (Math.random() * 200 - 100).toFixed(1);
            if (value > 0) {
                value = "+" + value;
            }
            break;
        case "Heal":
        case "Shield":
        case "Damage":
            // Random integer between -100 and +100
            value = Math.floor(Math.random() * 201 - 100);
            if (value > 0) {
                value = "+" + value;
            }
            break;
        case "Poison":
        case "Burn":
        case "Regen":
            // Random integer between -10 and +10
            value = Math.floor(Math.random() * 21 - 10);
            if (value > 0) {
                value = "+" + value;
            }
            break;
        default:
            value = 0;
    }

    return value;
}

function generatePassive(tag) {
    // Pick a random attribute
    const attribute = pick(passiveAttributes);

    // Base value
    let value = generatePassiveValue(attribute);

    // Chance to pick a reliant value (e.g., 50%)
    const useReliant = Math.random() < 0.5;
    let reliantText = "";

    if (useReliant) {
        const rel = values[Math.floor(Math.random() * values.length)];

        if (rel.canMultiple) {
            const multiplier = pick(["", "twice", "triple"]);
            reliantText = multiplier ? `${multiplier} ${rel.text}` : rel.text;
        } else {
            reliantText = rel.text;
        }

        if (reliantText) {
            // If we use a reliant value, display it instead of numeric value
            value = reliantText + " as";
        }
    }

    // Build passive object
    let baseText = `${tag} has ${value} ${attribute}`;
    // Ensure first letter is uppercase
    baseText = baseText.charAt(0).toUpperCase() + baseText.slice(1);
    baseText = processText(baseText);
    baseText = highlightKeywords(baseText);
    const passive = {
        id: "PASSIVE_" + attribute.toUpperCase(),
        baseText,
    };
    return passive;
}

const skillTriggers = [
    {
        id: "FIRST_USE_TAG",
        baseText: "When you use {Tag}, ",
        opponentText: "When your opponent uses {Tag}, ",
        baseXText: "The first {Times} you use {Tag} each fight, ",
        opponentXText:
            "The first {Times} your opponent uses {Tag} each fight, ",
    },
    {
        id: "FIGHT_START",
        baseText: "At the start of each fight, ",
        opponentText: "At the start of each fight, ",
        baseXText: "At the start of each fight, ",
        opponentXText: "At the start of each fight, ",
    },
    {
        id: "FIRST_ITEM_USE",
        baseText: "When you use an item, ",
        opponentText: "When your opponent uses an item, ",
        baseXText: "The first {Times} you use items each fight, ",
        opponentXText:
            "The first {Times} your opponent uses items each fight, ",
    },
    {
        id: "FIRST_FLY",
        baseText: "When your items start flying, ",
        opponentText: "When your opponent's items start flying, ",
        baseXText: "The first {Times} your items start flying each fight, ",
        opponentXText:
            "The first {Times} your opponent's items start flying each fight, ",
    },
    {
        id: "FIRST_STOP_FLY",
        baseText: "When your items stop flying, ",
        opponentText: "When your opponent's items stop flying, ",
        baseXText: "The first {Times} your items stop flying each fight, ",
        opponentXText:
            "The first {Times} your opponent's items stop flying each fight, ",
    },
    {
        id: "FIRST_FLY_OR_STOP_FLY",
        baseText: "When your items start or stop flying, ",
        opponentText: "When your opponent's items start or stop flying, ",
        baseXText:
            "The first {Times} your items start or stop flying each fight, ",
        opponentXText:
            "The first {Times} your opponent's items start or stop flying each fight, ",
    },
    {
        id: "FIRST_CRIT",
        baseText: "When you Crit, ",
        opponentText: "When your opponent Crits, ",
        baseXText: "The first {Times} you Crit each fight, ",
        opponentXText: "The first {Times} your opponent Crits each fight, ",
    },
    {
        id: "FIRST_HASTE",
        baseText: "When you Haste, ",
        opponentText: "When your opponent Hastes, ",
        baseXText: "The first {Times} you Haste each fight, ",
        opponentXText: "The first {Times} your opponent Hastes each fight, ",
    },
    {
        id: "FIRST_FREEZE",
        baseText: "When you Freeze, ",
        opponentText: "When your opponent Freezes, ",
        baseXText: "The first {Times} you Freeze each fight, ",
        opponentXText: "The first {Times} your opponent Freezes each fight, ",
    },
    {
        id: "FIRST_SLOW",
        baseText: "When you Slow, ",
        opponentText: "When your opponent Slows, ",
        baseXText: "The first {Times} you Slow each fight, ",
        opponentXText: "The first {Times} your opponent Slows each fight, ",
    },
    {
        id: "FIRST_POISON",
        baseText: "When you Poison, ",
        opponentText: "When your opponent Poisons, ",
        baseXText: "The first {Times} you Poison each fight, ",
        opponentXText: "The first {Times} your opponent Poisons each fight, ",
    },
    {
        id: "FIRST_BURN",
        baseText: "When you Burn, ",
        opponentText: "When your opponent Burns, ",
        baseXText: "The first {Times} you Burn each fight, ",
        opponentXText: "The first {Times} your opponent Burns each fight, ",
    },
    {
        id: "FIRST_SHIELD",
        baseText: "When you Shield, ",
        opponentText: "When your opponent Shields, ",
        baseXText: "The first {Times} you Shield each fight, ",
        opponentXText: "The first {Times} your opponent Shields each fight, ",
    },
    {
        id: "FIRST_HEAL",
        baseText: "When you Heal, ",
        opponentText: "When your opponent Heals, ",
        baseXText: "The first {Times} you Heal each fight, ",
        opponentXText: "The first {Times} your opponent Heals each fight, ",
    },
    {
        id: "FIRST_REGEN",
        baseText: "When you Regen, ",
        opponentText: "When your opponent Regens, ",
        baseXText: "The first {Times} you Regen each fight, ",
        opponentXText: "The first {Times} your opponent Regens each fight, ",
    },
    {
        id: "FIRST_DESTROY",
        baseText: "When you Destroy an item, ",
        opponentText: "When your opponent Destroy an item, ",
        baseXText: "The first {Times} you Destroy an item each fight, ",
        opponentXText:
            "The first {Times} your opponent Destroys an item each fight, ",
    },
    {
        id: "FIRST_SELF_DESTROY",
        baseText: "When your items are Destroyed, ",
        opponentText: "When your opponent's items are Destroyed, ",
        baseXText: "The first {Times} your items are Destroyed each fight, ",
        opponentXText:
            "The first {Times} your opponent's items are Destroyed each fight, ",
    },
    {
        id: "HALF_HEALTH",
        baseText: "When you reach half health, ",
        opponentText: "When your opponent reaches half health, ",
        baseXText: "The first {Times} you reach half health each fight, ",
        opponentXText:
            "The first {Times} your opponent reaches half health each fight, ",
    },
    {
        id: "DEATH",
        baseText: "When you would be defeated, ",
        opponentText: "When your opponent would be defeated, ",
        baseXText: "The first {Times} you would be defeated each fight, ",
        opponentXText:
            "The first {Times} your opponent would be defeated each fight, ",
    },
    {
        id: "USE_AMMO",
        baseText: "When you use ammo, ",
        opponentText: "When your opponent uses ammo, ",
        baseXText: "The first {Times} you use ammo each fight, ",
        opponentXText: "The first {Times} your opponent uses ammo each fight, ",
    },
    {
        id: "RUN_OUT_AMMO",
        baseText: "When you run out of ammo, ",
        opponentText: "When your opponent runs out of ammo, ",
        baseXText: "The first {Times} you run out of ammo each fight, ",
        opponentXText:
            "The first {Times} your opponent runs out of ammo each fight, ",
    },
    {
        id: "CHARGE",
        baseText: "When you Charge, ",
        opponentText: "When your opponent Charges, ",
        baseXText: "The first {Times} you Charge each fight, ",
        opponentXText: "The first {Times} your opponent Charges each fight, ",
    },
];

const effects = [
    { id: "USE", text: "Use {Tag}" },
    { id: "HASTE", text: "Haste {Tag} for {Duration}" },
    { id: "SLOW", text: "Slow a {Tag} for {Duration}" },
    { id: "FREEZE", text: "Freeze {Tag} for {Duration}" },
    { id: "CRIT", text: "{Tag} gains Crit equal to {Value} for the fight" },
    { id: "START_FLY", text: "{Tag} starts Flying" },
    { id: "STOP_FLY", text: "{Tag} stops Flying" },
    { id: "START_STOP_FLY", text: "{Tag} starts or stops Flying" },
    { id: "DESTROY", text: "Destroy {Tag}" },
    {
        id: "CD_FLAT",
        text: "Reduce {Tag}'s Cooldown by {Duration} for the fight",
    },
    {
        id: "CD_PERC",
        text: "Reduce {Tag}'s Cooldown by {Percent} for the fight",
    },
    {
        id: "CD_FLAT_INC",
        text: "Increase {Tag}'s Cooldown by {Duration} for the fight",
    },
    {
        id: "CD_PERC_INC",
        text: "Increase {Tag}'s Cooldown by {Percent} for the fight",
    },
    { id: "BURN", text: "Burn equal to {Value}" },
    { id: "POISON", text: "Poison equal to {Value}" },
    { id: "HEAL", text: "Heal equal to {Value}" },
    { id: "SHIELD", text: "Shield equal to {Value}" },
    { id: "DAMAGE", text: "Deal {Value} as damage" },
    { id: "REGEN", text: "Gain {Value} as Regen" },
    { id: "ENCHANT", text: "Enchant {Tag}" },
    { id: "RELOAD", text: "Reload {Tag} ammo equal to {Value}" },
    { id: "CHARGE", text: "Charge {Tag} equal to {Value}" },
];

const tags = [
    {
        id: "ANY",
        text: "an item",
        plural: "your items",
        enemyText: "an opponent's item",
        enemyPlural: "your opponent's items",
        amount: "{Number} items",
        enemyAmount: "{Number} of your opponent's items",
    },
    {
        id: "LIFESTEAL",
        text: "a Lifesteal item",
        plural: "your Lifesteal items",
        enemyText: "an opponent's Lifesteal item",
        enemyPlural: "your opponent's Lifesteal items",
        amount: "{Number} Lifesteal items",
        enemyAmount: "{Number} of your opponent's Lifesteal items",
    },
    {
        id: "ENCHANTED",
        text: "an Enchanted item",
        plural: "your Enchanted items",
        enemyText: "an opponent's Enchanted item",
        enemyPlural: "your opponent's Enchanted items",
        amount: "{Number} Enchanted items",
        enemyAmount: "{Number} of your opponent's Enchanted items",
    },
    {
        id: "PROPERTY",
        text: "a Property",
        plural: "your Properties",
        enemyText: "an opponent's Property",
        enemyPlural: "your opponent's Properties",
        amount: "{Number} Properties",
        enemyAmount: "{Number} of your opponent's Properties",
    },
    {
        id: "FRIEND",
        text: "a Friend",
        plural: "your Friends",
        enemyText: "an opponent's Friend",
        enemyPlural: "your opponent's Friends",
        amount: "{Number} Friends",
        enemyAmount: "{Number} of your opponent's Friends",
    },
    {
        id: "AQUATIC",
        text: "an Aquatic item",
        plural: "your Aquatic items",
        enemyText: "an opponent's Aquatic item",
        enemyPlural: "your opponent's Aquatic items",
        amount: "{Number} Aquatic items",
        enemyAmount: "{Number} of your opponent's Aquatic items",
    },
    {
        id: "REGEN",
        text: "a Regen item",
        plural: "your Regen items",
        enemyText: "an opponent's Regen item",
        enemyPlural: "your opponent's Regen items",
        amount: "{Number} Regen items",
        enemyAmount: "{Number} of your opponent's Regen items",
    },
    {
        id: "HEAL",
        text: "a Heal item",
        plural: "your Heal items",
        enemyText: "an opponent's Heal item",
        enemyPlural: "your opponent's Heal items",
        amount: "{Number} Heal items",
        enemyAmount: "{Number} of your opponent's Heal items",
    },
    {
        id: "SHIELD",
        text: "a Shield item",
        plural: "your Shield items",
        enemyText: "an opponent's Shield item",
        enemyPlural: "your opponent's Shield items",
        amount: "{Number} Shield items",
        enemyAmount: "{Number} of your opponent's Shield items",
    },
    {
        id: "WEAPON",
        text: "a Weapon",
        plural: "your Weapons",
        enemyText: "an opponent's Weapon",
        enemyPlural: "your opponent's Weapons",
        amount: "{Number} Weapons",
        enemyAmount: "{Number} of your opponent's Weapons",
    },
    {
        id: "SMALL",
        text: "a Small item",
        plural: "your Small items",
        enemyText: "an opponent's Small item",
        enemyPlural: "your opponent's Small items",
        amount: "{Number} Small items",
        enemyAmount: "{Number} of your opponent's Small items",
    },
    {
        id: "MEDIUM",
        text: "a Medium item",
        plural: "your Medium items",
        enemyText: "an opponent's Medium item",
        enemyPlural: "your opponent's Medium items",
        amount: "{Number} Medium items",
        enemyAmount: "{Number} of your opponent's Medium items",
    },
    {
        id: "LARGE",
        text: "a Large item",
        plural: "your Large items",
        enemyText: "an opponent's Large item",
        enemyPlural: "your opponent's Large items",
        amount: "{Number} Large items",
        enemyAmount: "{Number} of your opponent's Large items",
    },
    {
        id: "FLYING",
        text: "a Flying item",
        plural: "your Flying items",
        enemyText: "an opponent's Flying item",
        enemyPlural: "your opponent's Flying items",
        amount: "{Number} Flying items",
        enemyAmount: "{Number} of your opponent's Flying items",
    },
    {
        id: "FREEZE",
        text: "a Freeze item",
        plural: "your Freeze items",
        enemyText: "an opponent's Freeze item",
        enemyPlural: "your opponent's Freeze items",
        amount: "{Number} Freeze items",
        enemyAmount: "{Number} of your opponent's Freeze items",
    },
    {
        id: "AMMO",
        text: "an Ammo item",
        plural: "your Ammo items",
        enemyText: "an opponent's Ammo item",
        enemyPlural: "your opponent's Ammo items",
        amount: "{Number} Ammo items",
        enemyAmount: "{Number} of your opponent's Ammo items",
    },
    {
        id: "CORE",
        text: "a Core",
        plural: "your Cores",
        enemyText: "an opponent's Core",
        enemyPlural: "your opponent's Cores",
        amount: "{Number} Cores",
        enemyAmount: "{Number} of your opponent's Cores",
    },
    {
        id: "DINOSAUR",
        text: "a Dinosaur",
        plural: "your Dinosaurs",
        enemyText: "an opponent's Dinosaur",
        enemyPlural: "your opponent's Dinosaurs",
        amount: "{Number} Dinosaurs",
        enemyAmount: "{Number} of your opponent's Dinosaurs",
    },
    {
        id: "FOOD",
        text: "a Food item",
        plural: "your Food items",
        enemyText: "an opponent's Food item",
        enemyPlural: "your opponent's Food items",
        amount: "{Number} Food items",
        enemyAmount: "{Number} of your opponent's Food items",
    },
    {
        id: "POISON",
        text: "a Poison item",
        plural: "your Poison items",
        enemyText: "an opponent's Poison item",
        enemyPlural: "your opponent's Poison items",
        amount: "{Number} Poison items",
        enemyAmount: "{Number} of your opponent's Poison items",
    },
    {
        id: "BURN",
        text: "a Burn item",
        plural: "your Burn items",
        enemyText: "an opponent's Burn item",
        enemyPlural: "your opponent's Burn items",
        amount: "{Number} Burn items",
        enemyAmount: "{Number} of your opponent's Burn items",
    },
    {
        id: "POTION",
        text: "a Potion",
        plural: "your Potions",
        enemyText: "an opponent's Potion",
        enemyPlural: "your opponent's Potions",
        amount: "{Number} Potions",
        enemyAmount: "{Number} of your opponent's Potions",
    },
    {
        id: "QUEST",
        text: "a Quest item",
        plural: "your Quest items",
        enemyText: "an opponent's Quest item",
        enemyPlural: "your opponent's Quest items",
        amount: "{Number} Quest items",
        enemyAmount: "{Number} of your opponent's Quest items",
    },
    {
        id: "RAY",
        text: "a Ray",
        plural: "your Rays",
        enemyText: "an opponent's Ray",
        enemyPlural: "your opponent's Rays",
        amount: "{Number} Rays",
        enemyAmount: "{Number} of your opponent's Rays",
    },
    {
        id: "SLOW",
        text: "a Slow item",
        plural: "your Slow items",
        enemyText: "an opponent's Slow item",
        enemyPlural: "your opponent's Slow items",
        amount: "{Number} Slow items",
        enemyAmount: "{Number} of your opponent's Slow items",
    },
    {
        id: "HASTE",
        text: "a Haste item",
        plural: "your Haste items",
        enemyText: "an opponent's Haste item",
        enemyPlural: "your opponent's Haste items",
        amount: "{Number} Haste items",
        enemyAmount: "{Number} of your opponent's Haste items",
    },
    {
        id: "TECH",
        text: "a Tech item",
        plural: "your Tech items",
        enemyText: "an opponent's Tech item",
        enemyPlural: "your opponent's Tech items",
        amount: "{Number} Tech items",
        enemyAmount: "{Number} of your opponent's Tech items",
    },
    {
        id: "TOOL",
        text: "a Tool",
        plural: "your Tools",
        enemyText: "an opponent's Tool",
        enemyPlural: "your opponent's Tools",
        amount: "{Number} Tools",
        enemyAmount: "{Number} of your opponent's Tools",
    },
    {
        id: "TOY",
        text: "a Toy",
        plural: "your Toys",
        enemyText: "an opponent's Toy",
        enemyPlural: "your opponent's Toys",
        amount: "{Number} Toys",
        enemyAmount: "{Number} of your opponent's Toys",
    },
    {
        id: "VEHICLE",
        text: "a Vehicle",
        plural: "your Vehicles",
        enemyText: "an opponent's Vehicle",
        enemyPlural: "your opponent's Vehicles",
        amount: "{Number} Vehicles",
        enemyAmount: "{Number} of your opponent's Vehicles",
    },
    {
        id: "OTHER_HERO",
        text: "an item from another Hero",
        plural: "items from other Heroes",
        enemyText: "an opponent's item from another Hero",
        enemyPlural: "opponent's items from another Hero",
        amount: "{Number} items from another Hero",
        enemyAmount: "{Number} opponent's items from another Hero",
    },
    {
        id: "NEUTRAL",
        text: "a Neutral item",
        plural: "your Neutral items",
        enemyText: "an opponent's Neutral item",
        enemyPlural: "your opponent's Neutral items",
        amount: "{Number} Neutral items",
        enemyAmount: "{Number} of your opponent's Neutral items",
    },
    {
        id: "BRONZE",
        text: "a Bronze item",
        plural: "your Bronze items",
        enemyText: "an opponent's Bronze item",
        enemyPlural: "your opponent's Bronze items",
        amount: "{Number} Bronze items",
        enemyAmount: "{Number} of your opponent's Bronze items",
    },
    {
        id: "SILVER",
        text: "a Silver item",
        plural: "your Silver items",
        enemyText: "an opponent's Silver item",
        enemyPlural: "your opponent's Silver items",
        amount: "{Number} Silver items",
        enemyAmount: "{Number} of your opponent's Silver items",
    },
    {
        id: "GOLD",
        text: "a Gold item",
        plural: "your Gold items",
        enemyText: "an opponent's Gold item",
        enemyPlural: "your opponent's Gold items",
        amount: "{Number} Gold items",
        enemyAmount: "{Number} of your opponent's Gold items",
    },
    {
        id: "LEGENDARY",
        text: "a Legendary item",
        plural: "your Legendary items",
        enemyText: "an opponent's Legendary item",
        enemyPlural: "your opponent's Legendary items",
        amount: "{Number} Legendary items",
        enemyAmount: "{Number} of your opponent's Legendary items",
    },
];

// Prepend with ['', 'twice', 'triple'] if canMultiple
const values = [
    {
        id: "NUMBER",
        text: "",
        enemyText: "",
        singleText: "",
    },
    {
        id: "DAMAGE",
        text: "the damage of your weapons",
        enemyText: "the damage of your opponent's weapons",
        singleText: "this item's damage",
        canMultiple: true,
    },
    {
        id: "VALUE",
        text: "the value of your items",
        enemyText: "the value of your opponent's items",
        singleText: "this item's value",
        canMultiple: true,
    },
    {
        id: "MAX_HP",
        text: "{Percent} of your max Health",
        enemyText: "{Percent} of your opponent's max Health",
        singleText: "",
        canMultiple: false,
    },
    {
        id: "LEVEL",
        text: "your level",
        enemyText: "your opponent's level",
        singleText: "",
        canMultiple: true,
    },
    {
        id: "REGEN",
        text: "your Regen",
        enemyText: "your opponent's Regen",
        singleText: "",
        canMultiple: true,
    },
    {
        id: "SHIELD",
        text: "the Shield of your items",
        enemyText: "the Shield of your opponent's items",
        singleText: "this item's Shield",
        canMultiple: true,
    },
    {
        id: "POISON_ITEMS",
        text: "the Poison of your items",
        enemyText: "the Poison of your opponent's items",
        singleText: "this item's Poison",
        canMultiple: true,
    },
    {
        id: "POISON",
        text: "your Poison",
        enemyText: "your opponent's Poison",
        singleText: "",
        canMultiple: true,
    },
    {
        id: "BURN_ITEMS",
        text: "the Burn of your items",
        enemyText: "the Burn of your opponent's items",
        singleText: "this item's Burn",
        canMultiple: true,
    },
    {
        id: "BURN",
        text: "your Burn",
        enemyText: "your opponent's Burn",
        singleText: "",
        canMultiple: true,
    },
    {
        id: "HASTE",
        text: "the amount of Haste on your items",
        enemyText: "the amount of Haste on your opponent's items",
        singleText: "the amount of Haste on this items",
        canMultiple: true,
    },
    {
        id: "SLOW",
        text: "the amount of Slow on your items",
        enemyText: "the amount of Slow on your opponent's items",
        singleText: "the amount of Slow on this items",
        canMultiple: true,
    },
    {
        id: "NUMBER_ITEMS",
        text: "the number of items on your board",
        enemyText: "the number of items on your opponent's board",
        singleText: "",
        canMultiple: true,
    },
];

function getTimesText() {
    // 75% chance to be "1 time" (blank for readability)
    if (chance(0.75)) return "time";
    return Math.floor(Math.random() * 8 + 2).toString() + " times"; // random 2–9
}

function getTagText() {
    let tagText;
    const tag = pick(tags);
    const isOpponent = chance(0.5); // 50% chance to target opponent
    const pluralChance = Math.random();
    if (pluralChance < 0.2) {
        // 20% chance for specific amount like "{X} items"
        const num = Math.floor(Math.random() * 4) + 2; // 2–5
        tagText = isOpponent
            ? tag.enemyAmount.replace("{Number}", num)
            : tag.amount.replace("{Number}", num);
    } else if (pluralChance < 0.6) {
        // 40% chance for plural
        tagText = isOpponent ? tag.enemyPlural : tag.plural;
    } else {
        // 40% chance for single
        tagText = isOpponent ? tag.enemyText : tag.text;
    }
    return tagText;
}

function getDurationText() {
    let durationText = "";

    if (chance(0.9)) {
        // 90% of the time: numeric 0.5–4.0 sec (in 0.5 increments)
        const dur = (Math.floor(Math.random() * 8) + 1) * 0.5; // 0.5 to 4.0
        durationText = dur.toFixed(1) + "s";
    } else {
        // 10% of the time: based on value array
        const durVal = pick(values);
        if (durVal.id === "NUMBER") {
            const randomDurNum = Math.floor(Math.random() * 101);
            durationText = randomDurNum.toString();
        } else {
            durationText = durVal.text;
        }
    }

    return durationText;
}

function getValueText(asFlag = false) {
    const value = pick(values);
    let valueText = "";
    const isOpponent = chance(0.5); // 50% chance to target opponent

    // --- Handle special NUMBER case ---
    if (value.id === "NUMBER") {
        const randomNum = Math.floor(Math.random() * 101);
        valueText = randomNum.toString();

        // If "as" was used in the source text, we remove it entirely
        if (asFlag) {
            // Return the number directly, caller handles removal of "as"
            return { valueText, removeAs: true };
        }
        return { valueText, removeAs: false };
    }

    // --- Handle normal text values ---
    const mult =
        value.canMultiple && chance(0.5) ? pick(["", "twice ", "triple "]) : "";

    if (isOpponent) {
        valueText = mult + value.enemyText;
    } else {
        valueText = mult + value.text;
    }

    return { valueText, removeAs: false };
}

function getPercentageText() {
    let percentText = "";
    // Generate a random integer from 0–100
    const randomPercent = Math.floor(Math.random() * 101);
    percentText = randomPercent + "%";
    return percentText;
}

function generateItemName(effect, itemCd, itemSize, itemRarity) {
    // Extract thematic hints from the effect text
    const lowerEffect = effect.toLowerCase();

    // Expanded theme buckets (avoiding keywords)
    const themes = {
        poison: [
            "Toxin",
            "Vial",
            "Venom",
            "Serpent",
            "Pestle",
            "Plague",
            "Cauldron",
            "Ichor",
            "Spore",
            "Fang",
            "Mire",
            "Miasma",
            "Basilisk",
            "Rot",
            "Brew",
            "Elixir",
            "Scarab",
            "Wisp",
        ],
        burn: [
            "Cinder",
            "Ash",
            "Blaze",
            "Flame",
            "Brand",
            "Coal",
            "Ember",
            "Inferno",
            "Pyre",
            "Torch",
            "Kindle",
            "Scorch",
            "Furnace",
            "Char",
            "Singe",
            "Spark",
            "Soot",
            "Lantern",
        ],
        freeze: [
            "Frost",
            "Shard",
            "Icicle",
            "Snow",
            "Chill",
            "Crystal",
            "Glacier",
            "Hail",
            "Rime",
            "Flake",
            "Drift",
            "Permafrost",
            "Hoarfrost",
            "Winter",
            "Gale",
            "Borealis",
        ],
        haste: [
            "Whirl",
            "Pulse",
            "Spur",
            "Drive",
            "Motor",
            "Wing",
            "Gale",
            "Zephyr",
            "Dash",
            "Surge",
            "Rush",
            "Quiver",
            "Flicker",
            "Breeze",
            "Impulse",
            "Jolt",
            "Leap",
        ],
        slow: [
            "Stone",
            "Anchor",
            "Weight",
            "Tar",
            "Mud",
            "Clock",
            "Boulder",
            "Moss",
            "Sludge",
            "Snail",
            "Tide",
            "Root",
            "Stasis",
            "Mire",
            "Lagoon",
            "Stillness",
        ],
        heal: [
            "Balm",
            "Draught",
            "Lily",
            "Vessel",
            "Remedy",
            "Tonic",
            "Salve",
            "Poultice",
            "Herb",
            "Bloom",
            "Spring",
            "Mender",
            "Elixir",
            "Panacea",
            "Petal",
            "Sap",
            "Dew",
        ],
        shield: [
            "Bulwark",
            "Guard",
            "Barrier",
            "Wall",
            "Aegis",
            "Ward",
            "Bastion",
            "Mantle",
            "Shell",
            "Rampart",
            "Screen",
            "Dome",
            "Plate",
            "Palisade",
            "Cover",
        ],
        default: [
            "Relic",
            "Charm",
            "Echo",
            "Engine",
            "Spindle",
            "Lens",
            "Totem",
            "Sigil",
            "Glyph",
            "Idol",
            "Prism",
            "Matrix",
            "Obelisk",
            "Talisman",
            "Compass",
            "Orb",
            "Crest",
            "Medallion",
            "Fragment",
            "Tablet",
            "Scroll",
            "Crown",
            "Diadem",
            "Band",
            "Loop",
            "Pendant",
            "Brooch",
            "Token",
            "Rune",
            "Mark",
            "Thread",
            "Fiber",
            "Spool",
            "Rod",
            "Wand",
            "Pillar",
            "Spire",
            "Helix",
            "Spool",
            "Node",
            "Focus",
            "Beacon",
            "Spire",
            "Spool",
        ],
    };

    // Expanded rarity-based prefixes (avoiding keywords)
    const rarityPrefixes = {
        Bronze: [
            "Rusty",
            "Old",
            "Cracked",
            "Worn",
            "Dented",
            "Patched",
            "Tarnished",
            "Weathered",
            "Faded",
            "Antique",
            "Dusty",
            "Aged",
            "Battered",
            "Oxidized",
            "Rough",
        ],
        Silver: [
            "Polished",
            "Refined",
            "Noble",
            "Runed",
            "Gleaming",
            "Shining",
            "Lustrous",
            "Etched",
            "Engraved",
            "Sterling",
            "Bright",
            "Mirrored",
            "Chased",
            "Ornate",
            "Elegant",
        ],
        Gold: [
            "Royal",
            "Blessed",
            "Radiant",
            "Empowered",
            "Imbued",
            "Gilded",
            "Luminous",
            "Opulent",
            "Majestic",
            "Glorious",
            "Resplendent",
            "Shimmering",
            "Celestial",
            "Auric",
            "Exalted",
        ],
        Legendary: [
            "The",
            "Ancient",
            "Eternal",
            "Prime",
            "Forbidden",
            "Mythic",
            "Fabled",
            "Lost",
            "Arcane",
            "Primordial",
            "Unbound",
            "Transcendent",
            "Enigmatic",
            "Unseen",
            "Unspoken",
        ],
    };

    // Expanded cooldown adjectives
    let speedAdj = "";
    if (itemCd < 3)
        speedAdj = pick([
            "Swift",
            "Quick",
            "Rapid",
            "Blink",
            "Fleet",
            "Nimble",
            "Brisk",
            "Spry",
            "Zippy",
            "Agile",
            "Snappy",
            "Lively",
        ]);
    else if (itemCd > 10)
        speedAdj = pick([
            "Heavy",
            "Enduring",
            "Slumbering",
            "Stalwart",
            "Massive",
            "Bulky",
            "Lumbering",
            "Sturdy",
            "Solid",
            "Immovable",
        ]);
    else
        speedAdj = pick([
            "Balanced",
            "Attuned",
            "Weighted",
            "Steady",
            "Even",
            "Measured",
            "Poised",
            "Stable",
            "Harmonic",
        ]);

    // Expanded size hints
    const sizeNouns = {
        Small: [
            "Trinket",
            "Charm",
            "Shard",
            "Coin",
            "Pebble",
            "Miniature",
            "Chip",
            "Bead",
            "Droplet",
            "Sprig",
            "Button",
            "Gem",
            "Nugget",
            "Ojime", // Japanese bead
            "Tumi", // Andean ceremonial knife (miniature)
            "Kokoshnik", // Russian headpiece (miniature/ornamental)
            "Fibula", // Ancient brooch (Roman/Greek)
            "Netuké", // Japanese toggle
            "Amulet", // General, but often culturally specific
            "Talisman", // General, but often culturally specific
            "Torii", // Japanese gate (miniature/ornamental)
            "Nazarlik", // Turkish evil eye bead
            "Maneki", // Japanese beckoning cat (miniature)
            "Matryoshka", // Russian nesting doll (smallest)
            "Scarabaeus", // Egyptian scarab (small)
            "Lunula", // Slavic crescent pendant
        ],
        Medium: [
            "Device",
            "Artifact",
            "Focus",
            "Prism",
            "Module",
            "Relic",
            "Stone",
            "Tablet",
            "Medallion",
            "Band",
            "Loop",
            "Crest",
            "Token",
            "Boomerang", // Australian Aboriginal
            "Khopesh", // Egyptian sickle-sword
            "Kora", // West African harp-lute
            "Djembe", // West African drum
            "Didgeridoo", // Australian Aboriginal wind instrument
            "Kylix", // Ancient Greek cup
            "Targe", // Scottish shield
            "Churinga", // Australian Aboriginal sacred object
            "Kundu", // Papua New Guinea drum
            "Censer", // Religious incense burner (various cultures)
            "Astrolabe", // Medieval astronomical instrument
            "Sistrum", // Egyptian rattle
            "Gong", // East Asian percussion instrument
        ],
        Large: [
            "Monolith",
            "Engine",
            "Construct",
            "Beacon",
            "Obelisk",
            "Pillar",
            "Column",
            "Statue",
            "Totem",
            "Spire",
            "Tower",
            "Golem",
            "Boulder",
            "Moai", // Easter Island statue
            "Dolmen", // Megalithic tomb
            "Stupa", // Buddhist monument
            "Torana", // Indian ceremonial gateway
            "Menhir", // Standing stone (Celtic)
            "Oba Head", // Benin bronze sculpture
            "Ziggurat", // Mesopotamian temple
            "Pagoda", // East Asian tower
            "Kurgan", // Eurasian burial mound
            "Sphinx", // Egyptian statue
            "Chorten", // Tibetan stupa
            "Moongate", // Chinese garden arch
            "Stele", // Inscribed stone pillar (various cultures)
        ],
    };

    // Find theme from effect
    let matchedTheme = themes.default;
    for (let key in themes) {
        if (lowerEffect.includes(key)) {
            matchedTheme = themes[key];
            break;
        }
    }

    // Expanded patterns
    const prefix = pick(rarityPrefixes[itemRarity]);
    const noun = pick(matchedTheme);
    const sizeNoun = pick(sizeNouns[itemSize]);
    const pattern = pick([
        `${prefix} ${noun}`,
        `${speedAdj} ${noun}`,
        `${prefix} ${sizeNoun}`,
        `${noun} of ${sizeNoun}`,
        `${prefix} ${noun} of ${sizeNoun}`,
        `${prefix} ${noun}`,
        `${prefix} ${noun} of ${pick([
            "Echoes",
            "Dreams",
            "Dust",
            "Ashes",
            "Legends",
            "Wonders",
            "Secrets",
            "Shadows",
            "Visions",
            "Myths",
            "Stars",
            "Ages",
            "Cycles",
            "Origins",
            "Fates",
            "Hopes",
            "Night",
            "Dawn",
            "Twilight",
            "Storms",
            "Tides",
        ])}"`,
        `${noun} ${pick([
            "Engine",
            "Core",
            "Construct",
            "Matrix",
            "Node",
            "Helix",
            "Array",
            "Frame",
            "Shell",
            "Cage",
            "Sphere",
            "Loop",
            "Lens",
            "Prism",
            "Band",
            "Thread",
            "Fiber",
            "Spool",
        ])}"`,
        `${noun}`,
    ]);

    // Capitalize first letter cleanly
    return pattern.trim().replace(/\s+/g, " ");
}

function generateSkillName(effect) {
    const effectLower = effect.toLowerCase();

    // Expanded adjective/descriptor pools (avoiding keywords)
    const speedDescriptors = [
        "Swift",
        "Rapid",
        "Instant",
        "Quick Strike",
        "Blinding",
        "Lightning",
        "Fleetfoot",
        "Hasty",
        "Blinking",
        "Darting",
        "Vivid",
        "Vigorous",
        "Hurried",
        "Spry",
        "Nimble",
        "Dashing",
        "Whirling",
        "Fleeting",
    ];
    const powerDescriptors = [
        "Devastating",
        "Mighty",
        "Brutal Impact",
        "Colossal",
        "Thunderous",
        "Savage",
        "Ferocious",
        "Titanic",
        "Crushing",
        "Unstoppable",
        "Relentless",
        "Ironclad",
        "Forceful",
        "Rampaging",
        "Overwhelming",
    ];
    const quirkyDescriptors = [
        "Sleepy",
        "Sneaky",
        "Clumsy",
        "Wobbly",
        "Bouncy",
        "Jumpy",
        "Goofy",
        "Oddball",
        "Zany",
        "Wonky",
        "Loopy",
        "Cheeky",
        "Funky",
        "Quirky",
        "Mischievous",
        "Bizarre",
    ];
    const elementalDescriptors = [
        "Burning",
        "Freezing",
        "Poisoned",
        "Shocking",
        "Icy",
        "Molten",
        "Toxic",
        "Stormy",
        "Fuming",
        "Frosted",
        "Scalding",
        "Sparking",
        "Chilling",
        "Searing",
        "Gusty",
        "Voltaic",
    ];
    const genericActions = [
        "Strike",
        "Smash",
        "Cast",
        "Regenerate",
        "Crash",
        "Pulse",
        "Surge",
        "Twist",
        "Snap",
        "Flick",
        "Burst",
        "Sweep",
        "Spin",
        "Leap",
        "Crash",
        "Jolt",
        "Snap",
        "Flicker",
        "Glance",
        "Lunge",
        "Pounce",
        "Slam",
        "Tumble",
        "Vault",
    ];

    // Pick theme based on effect keywords
    let pool = [];
    if (effectLower.includes("poison")) pool = elementalDescriptors;
    else if (effectLower.includes("burn")) pool = elementalDescriptors;
    else if (effectLower.includes("freeze")) pool = elementalDescriptors;
    else if (effectLower.includes("haste") || effectLower.includes("cooldown"))
        pool = speedDescriptors;
    else if (effectLower.includes("damage") || effectLower.includes("destroy"))
        pool = powerDescriptors;
    else
        pool = pick([
            quirkyDescriptors,
            genericActions,
            speedDescriptors,
            powerDescriptors,
        ]);

    // Randomly combine a descriptor + action sometimes
    let name = pick(pool);
    if (chance(0.4)) {
        // 40% chance to append generic action
        name += " " + pick(genericActions);
    }

    // Capitalize properly
    name = name
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return name;
}

// --- Main Generator ---
function generate() {
    const isItem = chance(0.5); // 50% chance to generate item
    const isPassive = chance(0.3); // 30% chance for this to be passive
    let text = "";

    if (isPassive) {
        // Pick a tag for the passive (we can pick from keyWords or a generic tag)
        const tag = getTagText();
        const passiveObj = generatePassive(tag);

        if (isItem) {
            // Passive Item: no cooldown or multicast
            const itemSize = pick(["Small", "Medium", "Large"]);
            const itemRarity = pick(["Bronze", "Silver", "Gold", "Legendary"]);
            const itemName = generateItemName(
                passiveObj.baseText,
                0,
                itemSize,
                itemRarity
            );
            text = `
                <span class='name'><b>Item (Passive):</b> ${itemName}<br></span>
                <span class='size'><b>Size:</b> ${itemSize}<br></span>
                <span class='rarity'><b>Rarity:</b> ${itemRarity}<br></span>
                <span class='desc'>${passiveObj.baseText}.<br></span>
            `;
        } else {
            // Passive Skill: just the passive text
            const skillName = generateSkillName(passiveObj.baseText);
            text = `
                <span class='name'><b>Skill (Passive):</b> ${skillName}<br></span>
                <span class='desc'>
                    ${passiveObj.baseText}
                .<br></span>
            `;
        }
    } else {
        // Regular skill/item generation
        let effect = generateEffect();

        if (isItem) {
            effect = effect.charAt(0).toUpperCase() + effect.slice(1);
            const itemCd = (Math.floor(Math.random() * 30) + 1) * 0.5; // 0.5 to 15.0
            const itemSize = pick(["Small", "Medium", "Large"]);
            const itemRarity = pick(["Bronze", "Silver", "Gold", "Legendary"]);
            const itemMultiCast = pick(["", "2", "3", "4"]);
            const itemName = generateItemName(
                effect,
                itemCd,
                itemSize,
                itemRarity
            );
            const multicastHtml = itemMultiCast
                ? `<span class='multicast'>⚔️ <b>Multicast</b> x${itemMultiCast}<br></span>`
                : "";
            text = `
                <span class='name'><b>Item:</b> ${itemName}<br></span>
                <span class='cd'><b>CD:</b> ${
                    itemCd.toFixed(1) + "s"
                }<br></span>
                <span class='size'><b>Size:</b> ${itemSize}<br></span>
                <span class='rarity'><b>Rarity:</b> ${itemRarity}<br></span>
                <span class='desc'>${effect}.<br></span>
                ${multicastHtml}
            `;
        } else {
            const skillName = generateSkillName(effect);
            let trigger = generateTrigger();
            text = `
                <span class='name'>Skill: ${skillName}<br></span>
                <span class='desc'>${trigger} ${effect}.<br></span>
            `;
        }
    }

    $("#output").html(text);
}

function generateTrigger() {
    const trigger = pick(skillTriggers);
    const roll = Math.random();

    // Determine which variant we’ll use
    let text;
    if (roll < 0.4 && trigger.baseXText) {
        // 40% chance to use the "first {Times}" variant
        text = trigger.baseXText;
    } else if (roll < 0.5 && trigger.opponentXText) {
        // 10% chance for opponent "first {Times}"
        text = trigger.opponentXText;
    } else if (roll < 0.75 && trigger.opponentText) {
        // 25% chance for opponent base
        text = trigger.opponentText;
    } else {
        // Otherwise normal baseText
        text = trigger.baseText;
    }

    // Substitute tags text
    let tagText = getTagText();
    text = text.replace("{Tag}", tagText);

    // Substitute {Times} if it exists
    const times = getTimesText();
    text = text.replace("{Times}", times ? times : "");
    text = highlightKeywords(text);
    return text.trim();
}

function generateEffect() {
    const effect = pick(effects);
    let text = effect.text;
    // --- Substitute placeholders ---
    text = processText(text);
    // Tidy up spaces
    text = text.replace(/\s+/g, " ").trim();
    text = highlightKeywords(text);
    return text.charAt(0).toLowerCase() + text.slice(1);
}

function processText(text) {
    while (text.includes("{Tag}")) {
        let tagText = getTagText();
        text = text.replace("{Tag}", tagText);
    }
    while (text.includes("{Value}")) {
        const index = text.indexOf("{Value}");
        let asFlag = false;

        // Check if the word "as" immediately follows {Value}
        const afterValue = text.slice(index + "{Value}".length).trimStart();
        if (afterValue.toLowerCase().startsWith("as ")) {
            asFlag = true;
        }

        // Get value text and whether we should remove the "as"
        const { valueText, removeAs } = getValueText(asFlag);

        // Replace {Value}
        text = text.replace("{Value}", valueText);

        // If the NUMBER case returned removeAs=true, strip the "as" word after it
        if (removeAs) {
            text = text.replace(/\bas\s+/i, "");
        }
    }

    while (text.includes("{Duration}")) {
        let durationText = getDurationText();
        text = text.replace("{Duration}", durationText);
    }
    while (text.includes("{Percent}")) {
        let percentText = getPercentageText();
        text = text.replace("{Percent}", percentText);
    }
    return text;
}

// --- Bind Button ---
$("#generateBtn").click(generate);
