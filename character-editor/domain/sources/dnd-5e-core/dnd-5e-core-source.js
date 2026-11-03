
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

// backgrounds
import { Acolyte } from "./backgrounds/acolyte.js";
import { Charlatan } from "./backgrounds/charlatan.js";
import { Criminal } from "./backgrounds/criminal.js";
import { Entertainer } from "./backgrounds/entertainer.js";
import { FolkHero } from "./backgrounds/folk-hero.js";
import { GuildArtisan } from "./backgrounds/guild-artisan.js";
import { Hermit } from "./backgrounds/hermit.js";
import { Noble } from "./backgrounds/noble.js";
import { Outlander } from "./backgrounds/outlander.js";
import { Sage } from "./backgrounds/sage.js";
import { Sailor } from "./backgrounds/sailor.js";
import { Soldier } from "./backgrounds/soldier.js";
import { Urchin } from "./backgrounds/urchin.js";

// equipment - adventuring gear
import { Abacus } from "./equipment/adventuring-gear/abacus.js";
import { AlchemistsFireFlask } from "./equipment/adventuring-gear/alchemists-fire-flask.js";
import { AcidVial } from "./equipment/adventuring-gear/acid-vial.js";
import { Blanket } from "./equipment/adventuring-gear/blanket.js";
import { CaseMapOrScroll } from "./equipment/adventuring-gear/case-map-or-scroll.js";
import { ClothesCommon } from "./equipment/adventuring-gear/clothes-common.js";
import { EquipmentPackExplorer } from "./equipment/adventuring-gear/equipment-pack-explorer.js";

// equipment - armor
import { BreastPlateArmor } from "./equipment/armor/breastplate-armor.js";
import { ChainMailArmor } from "./equipment/armor/chain-mail-armor.js";
import { ChainShirtArmor } from "./equipment/armor/chain-shirt-armor.js";
import { HalfPlateArmor } from "./equipment/armor/half-plate-armor.js";
import { HideArmor } from "./equipment/armor/hide-armor.js";
import { LeatherArmor } from "./equipment/armor/leather-armor.js";
import { PaddedArmor } from "./equipment/armor/padded-armor..js";
import { PlateArmor } from "./equipment/armor/plate-armor.js";
import { RingMailArmor } from "./equipment/armor/ring-mail-armor.js";
import { ScaleMailArmor } from "./equipment/armor/scale-mail-armor.js";
import { Shield } from "./equipment/armor/shield.js";
import { SplintArmor } from "./equipment/armor/splint-armor.js";
import { StuddedLeatherArmor } from "./equipment/armor/studded-leather.js";

// equipment - spell-foci
import { ArcaneFocusCrystal } from "./equipment/spell-foci/arcane-focus-crystal.js"
import { ArcaneFocusOrb } from "./equipment/spell-foci/arcane-focus-orb.js"
import { ArcaneFocusRod } from "./equipment/spell-foci/arcane-focus-rod.js"
import { ArcaneFocusStaff } from "./equipment/spell-foci/arcane-focus-staff.js"
import { ArcaneFocusWand } from "./equipment/spell-foci/arcane-focus-wand.js"
import { DruidicFocusMistletoe } from "./equipment/spell-foci/druidic-focus-mistletoe.js"
import { DruidicFocusStaff } from "./equipment/spell-foci/druidic-focus-staff.js"
import { DruidicFocusTotem } from "./equipment/spell-foci/druidic-focus-totem.js"
import { DruidicFocusWand } from "./equipment/spell-foci/druidic-focus-wand.js"
import { HolySymbolAmulet } from "./equipment/spell-foci/holy-symbol-amulet.js"
import { HolySymbolEmblem } from "./equipment/spell-foci/holy-symbol-emblem.js"
import { HolySymbolReliquary } from "./equipment/spell-foci/holy-symbol-reliquary.js"

// equipment - tools
import { BrewersTools } from "./equipment/tools/brewers-tools.js"
import { MasonsTools } from "./equipment/tools/masons-tools.js"
import { SmithsTools } from "./equipment/tools/smiths-tools.js"
import { Bagpipes } from "./equipment/tools/bagpipes.js"
import { Drum } from "./equipment/tools/drum.js"
import { Dulcimer } from "./equipment/tools/dulcimer.js"
import { Flute } from "./equipment/tools/flute.js"
import { HerbalismKit } from "./equipment/tools/herbalism-kit.js"
import { Horn } from "./equipment/tools/horn.js"
import { Lute } from "./equipment/tools/lute.js"
import { Lyre } from "./equipment/tools/lyre.js"
import { PanFlute } from "./equipment/tools/pan-flute.js"
import { Shawm } from "./equipment/tools/shawm.js"
import { Viol } from "./equipment/tools/viol.js"

// equipment - weapons
import { Battleaxe } from "./equipment/weapons/battleaxe.js";
import { Blowgun } from "./equipment/weapons/blowgun.js";
import { Club } from "./equipment/weapons/club.js";
import { CrossbowHand } from "./equipment/weapons/crossbow-hand.js";
import { CrossbowHeavy } from "./equipment/weapons/crossbow-heavy.js";
import { CrossbowLight } from "./equipment/weapons/crossbow-light.js";
import { Dagger } from "./equipment/weapons/dagger.js";
import { Dart } from "./equipment/weapons/dart.js";
import { Flail } from "./equipment/weapons/flail.js";
import { Glaive } from "./equipment/weapons/glaive.js";
import { Greataxe } from "./equipment/weapons/greataxe.js";
import { Greatclub } from "./equipment/weapons/greatclub.js";
import { Greatsword } from "./equipment/weapons/greatsword.js";
import { Halberd } from "./equipment/weapons/halberd.js";
import { Handaxe } from "./equipment/weapons/handaxe.js";
import { Javelin } from "./equipment/weapons/javelin.js";
import { Lance } from "./equipment/weapons/lance.js";
import { LightHammer } from "./equipment/weapons/light-hammer.js";
import { Longbow } from "./equipment/weapons/longbow.js";
import { Longsword } from "./equipment/weapons/longsword.js";
import { Mace } from "./equipment/weapons/mace.js";
import { Maul } from "./equipment/weapons/maul.js";
import { Morningstar } from "./equipment/weapons/morningstar.js";
import { Net } from "./equipment/weapons/net.js";
import { Pike } from "./equipment/weapons/pike.js";
import { Quarterstaff } from "./equipment/weapons/quarterstaff.js";
import { Rapier } from "./equipment/weapons/rapier.js";
import { Scimitar } from "./equipment/weapons/scimitar.js";
import { Shortbow } from "./equipment/weapons/shortbow.js";
import { Shortsword } from "./equipment/weapons/shortsword.js";
import { Sickle } from "./equipment/weapons/sickle.js";
import { Sling } from "./equipment/weapons/sling.js";
import { Spear } from "./equipment/weapons/spear.js";
import { Trident } from "./equipment/weapons/trident.js";
import { WarPick } from "./equipment/weapons/war-pick.js";
import { Warhammer } from "./equipment/weapons/warhammer.js";
import { Whip } from "./equipment/weapons/whip.js";

// equipment - weapons-magical
import { MagicWeapon } from "./equipment/weapons-magical/magic-weapon.js";

// equipment - wondrous-items
import { BracersOfArchery } from "./equipment/wondrous-items/bracers-of-archery.js";

// spells - cantrips
import { BladeWard } from "./spells/level-0/blade-ward.js";
import { DancingLights } from "./spells/level-0/dancing-lignts.js";
import { Friends } from "./spells/level-0/friends.js";
import { Light } from "./spells/level-0/light.js";
import { MageHand } from "./spells/level-0/mage-hand.js";
import { Mending } from "./spells/level-0/mending.js";
import { Message } from "./spells/level-0/message.js";
import { MinorIllusion } from "./spells/level-0/minor-illusion.js";
import { Prestidigitation } from "./spells/level-0/prestidigitation.js";
import { SpareTheDying } from "./spells/level-0/spare-the-dying.js";
import { TrueStrike } from "./spells/level-0/true-strike.js";
import { ViciousMockery } from "./spells/level-0/vicious-mockery.js";

// spells - level 1
import { AnimalFriendship } from "./spells/level-1/animal-friendship.js";
import { ArmorOfAgathys } from "./spells/level-1/armor-of-agathys.js";
import { Bane } from "./spells/level-1/bane.js";
import { Bless } from "./spells/level-1/bless.js";
import { BurningHands } from "./spells/level-1/burning-hands.js";
import { CharmPerson } from "./spells/level-1/charm-person.js";
import { Command } from "./spells/level-1/command.js";
import { ComprehendLanguages } from "./spells/level-1/comprehend-languages.js";
import { CureWounds } from "./spells/level-1/cure-wounds.js";
import { DisguiseSelf } from "./spells/level-1/disguise-self.js";
import { DivineFavor } from "./spells/level-1/divine-favor.js";
import { FaerieFire } from "./spells/level-1/faerie-fire.js";
import { FogCloud } from "./spells/level-1/fog-cloud.js";
import { Identify } from "./spells/level-1/identify.js";
import { InflictWounds } from "./spells/level-1/inflict-wounds.js";
import { ShieldOfFaith } from "./spells/level-1/shield-of-faith.js";
import { SpeakWithAnimals } from "./spells/level-1/speak-with-animals.js";
import { Thunderwave } from "./spells/level-1/thunderwave.js";

// spells - level 2
import { AnimalMessenger } from "./spells/level-2/animal-messenger.js";
import { Augury } from "./spells/level-2/augury.js";
import { Barkskin } from "./spells/level-2/barkskin.js";
import { BeastSense } from "./spells/level-2/beast-sense.js";
import { BlindnessDeafness } from "./spells/level-2/blindness-deafness.js";
import { CalmEmotions } from "./spells/level-2/calm-emotions.js";
import { CloudOfDaggers } from "./spells/level-2/cloud-of-daggers.js";
import { CrownOfMadness } from "./spells/level-2/crown-of-madness.js";
import { Darkness } from "./spells/level-2/darkness.js";
import { FlamingSphere } from "./spells/level-2/flaming-sphere.js";
import { GentleRepose } from "./spells/level-2/gentle-repose.js";
import { GustOfWind } from "./spells/level-2/gust-of-wind.js";
import { LesserRestoration } from "./spells/level-2/lesser-restoration.js";
import { MagicWeaponSpell } from "./spells/level-2/magic-weapon.js";
import { MirrorImage } from "./spells/level-2/mirror-image.js";
import { PassWithoutTrace } from "./spells/level-2/pass-without-trace.js";
import { ScorchingRay } from "./spells/level-2/scorching-ray.js";
import { Shatter } from "./spells/level-2/shatter.js";
import { SpikeGrowth } from "./spells/level-2/spike-growth.js";
import { SpiritualWeapon } from "./spells/level-2/spiritual-weapon.js";
import { Suggestion } from "./spells/level-2/suggestion.js";

// spells - level 3
import { AnimateDead } from "./spells/level-3/animate-dead.js";
import { BeaconOfHope } from "./spells/level-3/beacon-of-hope.js";
import { BestowCurse } from "./spells/level-3/bestow-curse.js";
import { Blink } from "./spells/level-3/blink.js";
import { CallLightning } from "./spells/level-3/call-lightning.js";
import { Clairvoyance } from "./spells/level-3/clairvoyance.js";
import { CrusadersMantle } from "./spells/level-3/crusaders-mantle.js";
import { Daylight } from "./spells/level-3/daylight.js";
import { DispelMagic } from "./spells/level-3/dispel-magic.js";
import { Fear } from "./spells/level-3/fear.js";
import { FeignDeath } from "./spells/level-3/feign-death.js";
import { Fireball } from "./spells/level-3/fireball.js";
import { NonDetection } from "./spells/level-3/nondetection.js";
import { PlantGrowth } from "./spells/level-3/plant-growth.js";
import { Revivify } from "./spells/level-3/revivify.js";
import { SleetStorm } from "./spells/level-3/sleet-storm.js";
import { SpeakWithDead } from "./spells/level-3/speak-with-dead.js";
import { SpiritGuardians } from "./spells/level-3/spirit-guardians.js";
import { WindWall } from "./spells/level-3/wind-wall.js";

// spells - level 4
import { ArcaneEye } from "./spells/level-4/arcane-eye.js";
import { Blight } from "./spells/level-4/blight.js";
import { Confusion } from "./spells/level-4/confusion.js";
import { ControlWater } from "./spells/level-4/control-water.js";
import { DeathWard } from "./spells/level-4/death-ward.js";
import { DimensionDoor } from "./spells/level-4/dimension-door.js";
import { DominateBeast } from "./spells/level-4/dominate-beast.js";
import { FreedomOfMovement } from "./spells/level-4/freedom-of-movement.js";
import { GraspingVine } from "./spells/level-4/grasping-vine.js";
import { GuardianOfFaith } from "./spells/level-4/guardian-of-faith.js";
import { IceStorm } from "./spells/level-4/ice-storm.js";
import { Polymorph } from "./spells/level-4/polymorph.js";
import { Stoneskin } from "./spells/level-4/stoneskin.js";
import { WallOfFire } from "./spells/level-4/wall-of-fire.js";

// spells - level 5
import { AntiLifeShell } from "./spells/level-5/antilife-shell.js";
import { CommuneWithNature } from "./spells/level-5/commune-with-nature.js";
import { DestructiveWave } from "./spells/level-5/destructive-wave.js";
import { DominatePerson } from "./spells/level-5/dominate-person.js";
import { FlameStrike } from "./spells/level-5/flame-strike.js";
import { HoldMonster } from "./spells/level-5/hold-monster.js";
import { InsectPlague } from "./spells/level-5/insect-plague.js";
import { LegendLore } from "./spells/level-5/legend-lore.js";
import { MassCureWounds } from "./spells/level-5/mass-cure-wounds.js";
import { ModifyMemory } from "./spells/level-5/modify-memory.js";
import { RaiseDead } from "./spells/level-5/raise-dead.js";
import { Scrying } from "./spells/level-5/scrying.js";
import { TreeStride } from "./spells/level-5/tree-stride.js";

// spells - level 7
import { FingerOfDeath } from "./spells/level-7/finger-of-death.js";

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
        Actor, Alert, Athlete, Charger, CrossbowExpert,
        DefensiveDuelist, DualWielder, DungeonDelver, Durable, ElementalAdept,
        Grappler, GreatWeaponMaster, Healer, HeavilyArmored, HeavyArmorMaster,
        InspiringLeader, KeenMind, LightlyArmored, Linguist, Lucky,
        MageSlayer, MagicInitiate, MartialAdept, MediumArmorMaster, Mobile,
        ModeratelyArmored, MountedCombatant, Observant, PolearmMaster, Resilient,
        RitualCaster, SavageAttacker, Sentinel, Sharpshooter, ShieldMaster,
        Skilled, Skulker, SpellSniper, TavernBrawler, Tough,
        WarCaster,WeaponMaster,
    ];
    static getFeats() {
        return DnD5ESource.#feats;
    }

    static #backgrounds = [
        Acolyte,
        Charlatan,
        Criminal,
        Entertainer,
        FolkHero,
        GuildArtisan,
        Hermit,
        Noble,
        Outlander,
        Sage,
        Sailor,
        Soldier,
        Urchin
    ];
    static getBackgrounds() {
        return DnD5ESource.#backgrounds;
    }

    static #equipment = [
        // adventuring-gear
        Abacus, AlchemistsFireFlask, AcidVial, Blanket, CaseMapOrScroll,
        ClothesCommon, EquipmentPackExplorer,

        // armor
        BreastPlateArmor, ChainMailArmor, ChainShirtArmor, HalfPlateArmor, HideArmor,
        LeatherArmor, PaddedArmor, PlateArmor, RingMailArmor, ScaleMailArmor,
        Shield, SplintArmor, StuddedLeatherArmor,

        // spell-foci
        ArcaneFocusCrystal, ArcaneFocusOrb, ArcaneFocusRod, ArcaneFocusStaff, ArcaneFocusWand,
        DruidicFocusMistletoe, DruidicFocusStaff, DruidicFocusTotem, DruidicFocusWand, HolySymbolAmulet,
        HolySymbolEmblem, HolySymbolReliquary,

        // tools
        BrewersTools, MasonsTools, SmithsTools,
        Bagpipes, Drum, Dulcimer, Flute, HerbalismKit,
        Horn, Lute, Lyre, PanFlute, Shawm,
        Viol,

        // weapons
        Battleaxe, Blowgun, Club, CrossbowHand, CrossbowHeavy,
        CrossbowLight, Dagger, Dart, Flail, Glaive,
        Greataxe, Greatclub, Greatsword, Halberd, Handaxe,
        Javelin, Lance, LightHammer, Longbow, Longsword,
        Mace, Maul, Morningstar, Net, Pike,
        Quarterstaff, Rapier, Scimitar, Shortbow, Shortsword,
        Sickle, Sling, Spear, Trident, WarPick,
        Warhammer, Whip,

        // weapons-magical
        MagicWeapon,

        // wondrous-items
        BracersOfArchery
    ];
    static getEquipment() {
        return DnD5ESource.#equipment;
    }

    static #languages = [
        { name: "common", title: "Common" },
        { name: "dwarvish", title: "Dwarvish" },
        { name: "elvish", title: "Elvish" },
        { name: "giant", title: "Giant" },
        { name: "gnomish", title: "Gnomish" },
        { name: "goblin", title: "Goblin" },
        { name: "halfling", title: "Halfling" },
        { name: "orc", title: "Orc" },
        { name: "abyssal", title: "Abyssal" },
        { name: "celestial", title: "Celestial" },
        { name: "draconic", title: "Draconic" },
        { name: "deep-speech", title: "Deep Speech" },
        { name: "infernal", title: "Infernal" },
        { name: "primordial", title: "Primordial" },
        { name: "sylvan", title: "Sylvan" },
        { name: "undercommon", title: "Undercommon" }
    ];
    static getLanguages() {
        return DnD5ESource.#languages;
    }

    static #spells = [
        // cantrips
        BladeWard, DancingLights, Friends, Light, MageHand,
        Mending, Message, MinorIllusion, Prestidigitation, SpareTheDying,
        TrueStrike, ViciousMockery,

        // level 1
        AnimalFriendship, ArmorOfAgathys, Bane, Bless, BurningHands,
        CharmPerson, Command, ComprehendLanguages, CureWounds, DisguiseSelf,
        DivineFavor, FaerieFire, FogCloud, Identify, InflictWounds,
        ShieldOfFaith, SpeakWithAnimals, Thunderwave,

        // level 2
        AnimalMessenger, Augury, Barkskin, BeastSense, BlindnessDeafness,
        CalmEmotions, CloudOfDaggers, CrownOfMadness, Darkness, FlamingSphere,
        GentleRepose, GustOfWind, LesserRestoration, MagicWeaponSpell, MirrorImage,
        PassWithoutTrace, ScorchingRay, Shatter, SpikeGrowth, SpiritualWeapon,
        Suggestion,

        // level 3
        AnimateDead, BeaconOfHope, BestowCurse, Blink, CallLightning,
        Clairvoyance, CrusadersMantle, Daylight, DispelMagic, Fear,
        FeignDeath, Fireball, NonDetection, PlantGrowth, Revivify,
        SleetStorm, SpeakWithDead, SpiritGuardians, WindWall,

        // level 4
        ArcaneEye, Blight, Confusion, ControlWater, DeathWard,
        DimensionDoor, DominateBeast, FreedomOfMovement, GraspingVine, GuardianOfFaith,
        IceStorm, Polymorph, Stoneskin, WallOfFire,

        // level 5
        AntiLifeShell, CommuneWithNature, DestructiveWave, DominatePerson, FlameStrike,
        HoldMonster, InsectPlague, LegendLore, MassCureWounds, ModifyMemory,
        RaiseDead, Scrying, TreeStride,

        // level 7
        FingerOfDeath
    ];
    static getSpells() {
        return DnD5ESource.#spells;
    }

    static getSpellHtml(spell, content) {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${spell.title}</h3>
                <div class="spell-properties">${spell.school} cantrip</div>
                <div><b>Casting Time: </b>${spell.castingTime}</div>
                <div><b>Range: </b>${spell.range}</div>
                <div><b>Components: </b>${spell.components}</div>
                <div><b>Duration: </b>${spell.duration}</div>
                <div class="content spell-content">
                    ${content}
                </div>
            </div>
        `;
    }

    static getEquipmentHtml(equipment, content) {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${equipment.title}</h3>
                <hr/>
                <div class="content equipment-content">
                    ${content}
                </div>
            </div>
         `;
    }

    static getFeatHtml(feat, content) {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${feat.title}</h3>
                <hr/>
                <div class="content">
                    ${content}
                </div>
            </div>
        `;
    }
}
