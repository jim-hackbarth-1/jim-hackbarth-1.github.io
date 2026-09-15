
// races
import { Dragonborn } from "./races/dragonborn.js";
import { Dwarf } from "./races/dwarf.js";
import { Elf } from "./races/elf.js";
import { Gnome } from "./races/gnome.js";
import { HalfElf } from "./races/half-elf.js";
import { HalfOrc } from "./races/half-orc.js";
import { Halfling } from "./races/halfling.js";
import { Human } from "./races/human.js";
import { Tiefling } from "./races/tiefling.js";

// sub-races
import { DwarfHill } from "./sub-races/dwarf-hill.js"
import { DwarfMountain } from "./sub-races/dwarf-mountain.js"
import { ElfDark } from "./sub-races/elf-dark.js"
import { ElfHigh } from "./sub-races/elf-high.js"
import { ElfWood } from "./sub-races/elf-wood.js"
import { GnomeForest } from "./sub-races/gnome-forest.js"
import { GnomeRock } from "./sub-races/gnome-rock.js"
import { HalflingLightfoot } from "./sub-races/halfling-lightfoot.js"
import { HalflingStout } from "./sub-races/halfling-stout.js"

// classes
import { Barbarian } from "./classes/barbarian.js";
import { Bard } from "./classes/bard.js";
import { Cleric } from "./classes/cleric.js";
import { Druid } from "./classes/druid.js";
import { Fighter } from "./classes/fighter.js";
import { Monk } from "./classes/monk.js";
import { Paladin } from "./classes/paladin.js";
import { Ranger } from "./classes/ranger.js";
import { Rogue } from "./classes/rogue.js";
import { Sorcerer } from "./classes/sorcerer.js";
import { Warlock } from "./classes/warlock.js";
import { Wizard } from "./classes/wizard.js";

// sub-classes
import { BarbarianPathOfTheBerserker } from "./sub-classes/barbarian-path-of-the-berserker.js";
import { BarbarianPathOfTheTotemWarrior } from "./sub-classes/barbarian-path-of-the-totem-warrior.js";
import { BardCollegeOfLore } from "./sub-classes/bard-college-of-lore.js";
import { BardCollegeOfValor } from "./sub-classes/bard-college-of-valor.js";
import { ClericKnowledgeDomain } from "./sub-classes/cleric-knowledge-domain.js";
import { ClericLifeDomain } from "./sub-classes/cleric-life-domain.js";
import { ClericLightDomain } from "./sub-classes/cleric-light-domain.js";
import { ClericNatureDomain } from "./sub-classes/cleric-nature-domain.js";
import { ClericTempestDomain } from "./sub-classes/cleric-tempest-domain.js";
import { ClericTrickeryDomain } from "./sub-classes/cleric-trickery-domain.js";
import { ClericWarDomain } from "./sub-classes/cleric-war-domain.js";
import { DruidCircleOfTheLand } from "./sub-classes/druid-circle-of-the-land.js";
import { DruidCircleOfTheMoon } from "./sub-classes/druid-circle-of-the-moon.js";
import { FighterBattleMaster } from "./sub-classes/fighter-battle-master.js";
import { FighterChampion} from "./sub-classes/fighter-champion.js";
import { FighterEldritchKnight } from "./sub-classes/fighter-eldritch-knight.js";
import { MonkWayOfShadow } from "./sub-classes/monk-way-of-shadow.js";
import { MonkWayOfTheFourElements} from "./sub-classes/monk-way-of-the-four-elements.js";
import { MonkWayOfTheOpenHand } from "./sub-classes/monk-way-of-the-open-hand.js";
import { PaladinOathOfDevotion } from "./sub-classes/paladin-oath-of-devotion.js";
import { PaladinOathOfTheAncients} from "./sub-classes/paladin-oath-of-the-ancients.js";
import { PaladinOathOfVengeance } from "./sub-classes/paladin-oath-of-vengeance.js";
import { RangerBeastMaster } from "./sub-classes/ranger-beast-master.js";
import { RangerHunter } from "./sub-classes/ranger-hunter.js";
import { RogueArcaneTrickster } from "./sub-classes/rogue-arcane-trickster.js";
import { RogueAssassin } from "./sub-classes/rogue-assassin.js";
import { RogueThief } from "./sub-classes/rogue-thief.js";
import { SorcererDraconicBloodline } from "./sub-classes/sorcerer-draconic-bloodline.js";
import { SorcererWildMagic } from "./sub-classes/sorcerer-wild-magic.js";
import { WarlockTheArchfey } from "./sub-classes/warlock-the-archfey.js";
import { WarlockTheFiend } from "./sub-classes/warlock-the-fiend.js";
import { WarlockTheGreatOldOne } from "./sub-classes/warlock-the-great-old-one.js";
import { WizardSchoolOfAbjuration } from "./sub-classes/wizard-school-of-abjuration.js";
import { WizardSchoolOfConjuration } from "./sub-classes/wizard-school-of-conjuration.js";
import { WizardSchoolOfDivination } from "./sub-classes/wizard-school-of-divination.js";
import { WizardSchoolOfEnchantment } from "./sub-classes/wizard-school-of-enchantment.js";
import { WizardSchoolOfEvocation } from "./sub-classes/wizard-school-of-evocation.js";
import { WizardSchoolOfIllusion } from "./sub-classes/wizard-school-of-illusion.js";
import { WizardSchoolOfNecromancy } from "./sub-classes/wizard-school-of-necromancy.js";
import { WizardSchoolOfTransmutation } from "./sub-classes/wizard-school-of-transmutation.js";

// feats
import { Actor } from "./feats/actor.js";
import { Alert } from "./feats/alert.js";
import { Athlete } from "./feats/athlete.js";
import { Charger } from "./feats/charger.js";
import { CrossbowExpert } from "./feats/crossbow-expert.js";
import { DefensiveDuelist } from "./feats/defensive-duelist.js";
import { DualWielder } from "./feats/dual-wielder.js";
import { DungeonDelver } from "./feats/dungeon-delver.js";
import { Durable } from "./feats/durable.js";
import { ElementalAdept } from "./feats/elemental-adept.js";
import { Grappler } from "./feats/grappler.js";
import { GreatWeaponMaster } from "./feats/great-weapon-master.js";
import { Healer } from "./feats/healer.js";
import { HeavilyArmored } from "./feats/heavily-armored.js";
import { HeavyArmorMaster } from "./feats/heavy-armor-master.js";
import { InspiringLeader } from "./feats/inspiring-leader.js";
import { KeenMind } from "./feats/keen-mind.js";
import { LightlyArmored } from "./feats/lightly-armored.js";
import { Linguist } from "./feats/linquist.js";
import { Lucky } from "./feats/lucky.js";
import { MageSlayer } from "./feats/mage-slayer.js";
import { MagicInitiate } from "./feats/magic-initiate.js";
import { MartialAdept } from "./feats/martial-adept.js";
import { MediumArmorMaster } from "./feats/medium-armor-master.js";
import { Mobile } from "./feats/mobile.js";
import { ModeratelyArmored } from "./feats/moderately-armored.js";
import { MountedCombatant } from "./feats/mounted-combatant.js";
import { Observant } from "./feats/observant.js";
import { PolearmMaster } from "./feats/polearm-master.js";
import { Resilient } from "./feats/resilient.js";
import { RitualCaster } from "./feats/ritual-caster.js";
import { SavageAttacker } from "./feats/savage-attacker.js";
import { Sentinel } from "./feats/sentinel.js";
import { Sharpshooter } from "./feats/sharpshooter.js";
import { ShieldMaster } from "./feats/shield-master.js";
import { Skilled } from "./feats/skilled.js";
import { Skulker } from "./feats/skulker.js";
import { SpellSniper } from "./feats/spell-sniper.js";
import { TavernBrawler } from "./feats/tavern-brawler.js";
import { Tough } from "./feats/tough.js";
import { WarCaster } from "./feats/war-caster.js";
import { WeaponMaster } from "./feats/weapon-master.js";


export class DnD5ESource {

    static get name() {
        return "dnd-5e-core";
    }

    static get title() {
        return "DnD 5e Core Rules"
    }

    static #races = [
        Dragonborn,
        Dwarf,
        Elf,
        Gnome,
        HalfElf,
        HalfOrc,
        Halfling,
        Human,
        Tiefling
    ];
    static getRaces() {
        return DnD5ESource.#races;
    }

    static #subRaces = [
        DwarfHill,
        DwarfMountain,
        ElfDark,
        ElfHigh,
        ElfWood,
        GnomeForest,
        GnomeRock,
        HalflingLightfoot,
        HalflingStout
    ];
    static getSubRaces() {
        return DnD5ESource.#subRaces;
    }

    static #classes = [
        Barbarian,
        Bard,
        Cleric,
        Druid,
        Fighter,
        Monk,
        Paladin,
        Ranger,
        Rogue,
        Sorcerer,
        Warlock,
        Wizard
    ];
    static getClasses() {
        return DnD5ESource.#classes;
    }

    static #subClasses = [
        BarbarianPathOfTheBerserker,
        BarbarianPathOfTheTotemWarrior,
        BardCollegeOfLore,
        BardCollegeOfValor,
        ClericKnowledgeDomain,
        ClericLifeDomain,
        ClericLightDomain,
        ClericNatureDomain,
        ClericTempestDomain,
        ClericTrickeryDomain,
        ClericWarDomain,
        DruidCircleOfTheLand,
        DruidCircleOfTheMoon,
        FighterBattleMaster,
        FighterChampion,
        FighterEldritchKnight,
        MonkWayOfShadow,
        MonkWayOfTheFourElements,
        MonkWayOfTheOpenHand,
        PaladinOathOfDevotion,
        PaladinOathOfTheAncients,
        PaladinOathOfVengeance,
        RangerBeastMaster,
        RangerHunter,
        RogueArcaneTrickster,
        RogueAssassin,
        RogueThief,
        SorcererDraconicBloodline,
        SorcererWildMagic,
        WarlockTheArchfey,
        WarlockTheFiend,
        WarlockTheGreatOldOne,
        WizardSchoolOfAbjuration,
        WizardSchoolOfConjuration,
        WizardSchoolOfDivination,
        WizardSchoolOfEnchantment,
        WizardSchoolOfEvocation,
        WizardSchoolOfIllusion,
        WizardSchoolOfNecromancy,
        WizardSchoolOfTransmutation
    ];
    static getSubClasses() {
        return DnD5ESource.#subClasses;
    }

    static #feats = [
        Actor,
        Alert,
        Athlete,
        Charger,
        CrossbowExpert,
        DefensiveDuelist,
        DualWielder,
        DungeonDelver,
        Durable,
        ElementalAdept,
        Grappler,
        GreatWeaponMaster,
        Healer,
        HeavilyArmored,
        HeavyArmorMaster,
        InspiringLeader,
        KeenMind,
        LightlyArmored,
        Linguist,
        Lucky,
        MageSlayer,
        MagicInitiate,
        MartialAdept,
        MediumArmorMaster,
        Mobile,
        ModeratelyArmored,
        MountedCombatant,
        Observant,
        PolearmMaster,
        Resilient,
        RitualCaster,
        SavageAttacker,
        Sentinel,
        Sharpshooter,
        ShieldMaster,
        Skilled,
        Skulker,
        SpellSniper,
        TavernBrawler,
        Tough,
        WarCaster,
        WeaponMaster,
    ];
    static getFeats() {
        return DnD5ESource.#feats;
    }

}
