
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Command {

    static get name() { return "command"; }
    static get title() { return "Command"; }
    static get level() { return 1; }
    static get school() { return "enchantment"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "paladin"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V"; }
    static get duration() { return "1 round"; }
    static get html() { return DnD5ESource.getSpellHtml(Command, Command.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "wisdom" });
        tempFeatures.push(character.getSpellCard(Command, Command.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Command.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn’t understand your language, or if your command is directly harmful to it. Some typical commands and their effects follow. You might issue a command other than one described here. If you do so, the DM determines how the target behaves. If the target can’t follow your command, the spell ends.
        </p>
        <p>
            <b>Approach.</b> The target moves toward you by the shortest and most direct route, ending its turn if it moves within 5 feet of you.
        </p>
        <p>
            <b>Drop.</b> The target drops whatever it is holding and then ends its turn.
        </p>
        <p>
            <b>Flee.</b> The target spends its turn moving away from you by the fastest available means.
        </p>
        <p>
            <b>Grovel.</b> The target falls prone and then ends its turn.
        </p>
        <p>
            <b>Halt.</b> The target doesn’t move and takes no actions. A flying creature stays aloft, provided that it is able to do so. If it must move to stay aloft, it flies the minimum distance needed to remain in the air.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.
        </p>
    `;

}

