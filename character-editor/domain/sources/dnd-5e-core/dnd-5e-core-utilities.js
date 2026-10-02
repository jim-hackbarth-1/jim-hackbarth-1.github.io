
export class DnD5EUtilities {

    static getMeleeAttackCardHtml(name, toHitLabel, damageLabel, reach, target) {
        let html = `<b>${name}</b>. <i>Melee Attack</i>: ${toHitLabel}`;
        if (reach) {
            html += `, reach ${reach} ft.`;
        }
        if (target) {
            html += `, ${target}`;
        }
        html += `. <i>Hit:</i> ${damageLabel}`;
        return html;
    }

    static getRangedAttackCardHtml(name, toHitLabel, damageLabel, rangeLabel, target) {
        let html = `<b>${name}</b>. <i>Ranged Attack</i>: ${toHitLabel}, ${rangeLabel}`;
        if (target) {
            html += `, ${target}`;
        }
        html += `. <i>Hit:</i> ${damageLabel}`;
        return html;
    }

    static getSavingThrowAttackCardHtml(name, dc, dcAbility, onFailedSave, onSave, rangeLabel, target) {
        let html = `<b>${name}</b>. <i>Saving throw</i>: DC ${dc} ${dcAbility}`;
        if (rangeLabel) {
            html += `, ${rangeLabel}`;
        }
        if (target) {
            html += `, ${target}`;
        }
        html += `<br/>${onFailedSave} <br/>On save: ${onSave}`;
        return html;
    }

    static getToHitLabel(toHit) {
        if (Number(toHit) >= 0) {
            return `+${toHit}`;
        }
        return `${toHit} to hit`;
    }

    static getRangeLabel(range, longRange) {
        let html = `range ${range}`;
        if (longRange) {
            html += `/${longRange}`;
        }
        html += " ft.";
        return html;
    }

    static getDamageLabel(damageDice, modifier, damageType) {
        const damageDieLabels = [];
        for (const damageDie of damageDice) {
            damageDieLabels.push(`${damageDie.number}d${damageDie.size}`)
        }
        let html = damageDieLabels.join(" + ");
        const numberModifier = Number(modifier);
        if (numberModifier > 0) {
            html += ` + ${numberModifier}`;
        }
        if (numberModifier < 0) {
            html += ` - ${Math.abs(numberModifier)}`;
        }
        html = `(${html})`;
        if (damageType) {
            html += ` ${damageType}`;
        }
        html += " damage";
        return html;
    }

}
