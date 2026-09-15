
// sub-races
import { DragonbornWaveChild } from "./sub-races/dragonborn-wave-child.js";
import { DwarfFrost } from "./sub-races/dwarf-frost.js";
import { ElfDawn } from "./sub-races/elf-dawn.js";
import { GnomeShadow } from "./sub-races/gnome-shadow.js";
import { HalfElfWayfarer } from "./sub-races/half-elf-wayfarer.js";
import { HalfOrcTideOrc } from "./sub-races/half-orc-tide-orc.js";
import { HalflingBriar } from "./sub-races/halfling-briar.js";
import { TieflingNightHaunt } from "./sub-races/tiefling-night-haunt.js";

// sub-classes
import { BarbarianPathOfTheBeast } from "./sub-classes/barbarian-path-of-the-beast.js";
import { BardCollegeOfSecrets } from "./sub-classes/bard-college-of-secrets.js";
import { ClericShadowDomain } from "./sub-classes/cleric-shadow-domain.js";
import { DruidCircleOfFire } from "./sub-classes/druid-circle-of-fire.js";
import { FighterWarder } from "./sub-classes/fighter-warder.js";
import { MonkWayOfTheTempest } from "./sub-classes/monk-way-of-the-tempest.js";
import { PaladinOathOfEnlightenment } from "./sub-classes/paladin-oath-of-enlightenment.js";
import { RangerPartisan } from "./sub-classes/ranger-partisan.js";
import { RogueConfidenceArtist } from "./sub-classes/rogue-confidence-artist.js";
import { SorcererChanneler } from "./sub-classes/sorcerer-channeler.js";
import { WarlockTheAncestors } from "./sub-classes/warlock-the-ancestors.js";
import { WizardSchoolOfPatterning } from "./sub-classes/wizard-school-of-patterning.js";

export class LandsOfAedunSource {

    static get name() {
        return "lands-of-aedun";
    }

    static get title() {
        return "Lands of Aedun Campaign Setting"
    }

    static getRaces() {
        return [];
    }

    static #subRaces = [
        DragonbornWaveChild,
        DwarfFrost,
        ElfDawn,
        GnomeShadow,
        HalfElfWayfarer,
        HalfOrcTideOrc,
        HalflingBriar,
        TieflingNightHaunt
    ];
    static getSubRaces() {
        return LandsOfAedunSource.#subRaces;
    }

    static getClasses() {
        return [];
    }

    static #subClasses = [
        BarbarianPathOfTheBeast,
        BardCollegeOfSecrets,
        ClericShadowDomain,
        DruidCircleOfFire,
        FighterWarder,
        MonkWayOfTheTempest,
        PaladinOathOfEnlightenment,
        RangerPartisan,
        RogueConfidenceArtist,
        SorcererChanneler,
        WarlockTheAncestors,
        WizardSchoolOfPatterning
    ];
    static getSubClasses() {
        return LandsOfAedunSource.#subClasses;
    }

    static getFeats() {
        return [];
    }

}
