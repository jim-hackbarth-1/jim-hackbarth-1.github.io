
export class SelectionUtilities {

    getSelection(selections, name, title, maxSelections, sources, locked, alertMessage, isOptional) {
        const currentSelections = selections.find(s => s.name == name)?.values ?? [];
        const hasSelection = currentSelections.some(v => v.value);
        if (!hasSelection) {
            const optionalLabel = isOptional ? "optional, " : "";
            currentSelections.push({ value: null, text: `${title} (${optionalLabel}choose ${maxSelections}) ...` });
        }
        return {
            name: name,
            title: title,
            maxSelections: maxSelections,
            locked: locked ?? false,
            alertMessage: alertMessage,
            sources: sources ?? [],
            currentSelections: currentSelections
        };
    }

    getSelectionOptions(sourceItems, selectedValues, sourceItemsSelectedElsewhere, choiceLabel, hasDetail) {
        let options = [];
        for (const sourceItem of sourceItems) {
            const isSelected = selectedValues.some(sv => sv.value == sourceItem.name);
            const isDisabled = sourceItemsSelectedElsewhere.some(sise => sise.value == sourceItem.name);
            const disabledReason = isDisabled ? `Disabled: ${sourceItem.title} granted by other feature` : "";
            options.push({
                value: sourceItem.name,
                text: sourceItem.title,
                noteText: sourceItem.source?.title,
                hasDetail: hasDetail ?? false,
                isSelected: isSelected,
                isDisabled: isDisabled,
                disabledReason: disabledReason,
                source: sourceItem.source?.name,
                data: sourceItem.data
            });
        }
        options = SelectionUtilities.#sortOptions(options, "text");
        options.unshift({ value: null, text: choiceLabel ?? "Choose option(s) ...", hideCheckbox: true });
        return options;
    }

    getSpellSelection(character, level, classIndex, cantripCount, spellCount) {
        const className = character.classes[classIndex].value;
        const canReplace = (level > 1);
        let selectionName = null;
        let alertMessage = null;
        const spellSelectionInfo = this.getSpellSelectionInfo(character, className);

        let cantrips = null;
        if (cantripCount > 0) {
            cantrips = character.selectionUtilities.getSelection(
                character.selections, `${className}-level-${level}-cantrips`, "Cantrips", cantripCount, [{ name: "spells" }]);
        }
        let spells = null;
        if (spellCount > 0) {
            selectionName = `${className}-level-${level}-spells`;
            alertMessage = SelectionUtilities.#getReplacedSpellAlertMessage(character, selectionName, spellSelectionInfo);
            spells = character.selectionUtilities.getSelection(
                character.selections, selectionName, "Spells", spellCount, [{ name: "spells" }], alertMessage ? true : false, alertMessage);
        }
        let replacedSpell = null;
        if (canReplace) {
            selectionName = `${className}-level-${level}-replaced-spell`;
            alertMessage = SelectionUtilities.#getReplacedSpellAlertMessage(character, selectionName, spellSelectionInfo);
            replacedSpell = character.selectionUtilities.getSelection(
                character.selections, selectionName, "Replaced spell", 1, [{ name: "spells" }], alertMessage ? true : false, alertMessage, true);
        }
        let replacementSpell = null;
        if (canReplace) {
            let hasReplacedSelection = false;
            let replacedSelections = character.selections.find(s => s.name == `${className}-level-${level}-replaced-spell`)?.values ?? [];
            if (replacedSelections.length == 1 && replacedSelections[0].value) {
                hasReplacedSelection = true;
            }
            selectionName = `${className}-level-${level}-replacement-spell`;
            if (hasReplacedSelection) {
                alertMessage = SelectionUtilities.#getReplacedSpellAlertMessage(character, selectionName, spellSelectionInfo);
            }
            else {
                alertMessage = "Locked: Replaced spell selection required";
            }
            replacementSpell = character.selectionUtilities.getSelection(
                character.selections, selectionName, "Replacement spell", 1, [{ name: "spells" }], alertMessage ? true : false, alertMessage, true);
        }
        return {
            name: `${className}-level-${level}-spell-selections`,
            title: `Level ${level} spells`,
            spellSelection: true,
            classIndex: classIndex,
            className: className,
            subClassName: null,
            defaultSummaryDisplay: "Choose spells...",
            cantrips: cantrips,
            spells: spells,
            replacedSpell: replacedSpell,
            replacementSpell: replacementSpell
        };
    }

    getSpellSelectionOptions(character, level, classIndex, selectionName, sources, cantripCount, spellCount) {
        const className = character.classes[classIndex].value;
        let spells = [...sources.find(s => s.name == "spells").options];
        spells = spells.filter(s => s.classes.includes(className));
        const selectionSource = selectionName.replace(`${className}-level-${level}-`, "");
        if (selectionSource == "cantrips") {
            spells = spells.filter(s => Number(s.level) == 0);
        }
        else {
            spells = spells.filter(s => Number(s.level) >= 1 && Number(s.level) <= level);
        }
        const spellSelectionInfo = this.getSpellSelectionInfo(character, className);
        if (selectionSource == "replaced-spell") {
            const spellsSelectedAtLowerLevels = spellSelectionInfo
                .filter(i => i.selectionLevel < level && !i.isCantripSelection && !i.isReplacedSpellSelection)
                .map(i => i.spell);
            spells = spells.filter(s => spellsSelectedAtLowerLevels.some(ssatl => ssatl.value == s.name));
        }
        const currentSelections = spellSelectionInfo.filter(i => i.selectionName == selectionName).map(i => i.spell);
        let options = [];
        for (const spell of spells) {
            const isSelected = currentSelections.some(cs => cs.value == spell.name);
            let disabledReason = null
            const replacementSpell = SelectionUtilities.#getReplacementSpell(character, spell.name, spellSelectionInfo);
            if (replacementSpell) {
                disabledReason = `Disabled: ${spell.title} has been replaced by ${replacementSpell.text}.`
            }
            if (!disabledReason && selectionSource != "replaced-spell") {
                const isSelectedElsewhere = SelectionUtilities.#isSpellSelectedElsewhere(character, spell.name, selectionName, spellSelectionInfo);
                if (isSelectedElsewhere) {
                    disabledReason = `Disabled: ${spell.title} selected elsewhere.`
                }
            }
            let spellLevelLabel = `Level ${spell.level}`;
            if (spell.level == 0) {
                spellLevelLabel = "Cantrip";
            }
            options.push({
                value: spell.name,
                text: spell.title,
                noteText: `${spellLevelLabel} (${spell.source.title})`,
                sortField: `level-${spell.level}-${spell.title}`,
                hasDetail: true,
                isSelected: isSelected,
                isDisabled: disabledReason ? true : false,
                disabledReason: disabledReason,
                source: spell.source.name
            });
        }
        options = SelectionUtilities.#sortOptions(options, "sortField");
        let choiceLabel = "Spells ...";
        if (selectionName.endsWith("-cantrips")) {
            choiceLabel = "Cantrips ...";
            choiceLabel = `Cantrips (choose ${cantripCount}) ...`;
        }
        if (selectionName.endsWith("-spells")) {
            choiceLabel = "Spells ...";
            choiceLabel = `Spells (choose ${spellCount}) ...`;
        }
        if (selectionName.endsWith("-replaced-spell")) {
            choiceLabel = "Replaced spell (optional, choose 1) ...";
        }
        if (selectionName.endsWith("-replacement-spell")) {
            choiceLabel = "Replacement spell (optional, choose 1) ...";;
        }
        options.unshift({ value: null, text: choiceLabel, hideCheckbox: true });
        return options;
    }

    getSpellSelectionInfo(character, className) {
        const selectionList = []
        for (let i = 1; i <= 20; i++) {
            let selectionName = `${className}-level-${i}-cantrips`
            let selections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            for (const selection of selections) {
                selectionList.push({ spell: selection, selectionName: selectionName, selectionLevel: i, isCantripSelection: true });
            }
            selectionName = `${className}-level-${i}-spells`
            selections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            for (const selection of selections) {
                selectionList.push({ spell: selection, selectionName: selectionName, selectionLevel: i, isSpellSelection: true });
            }
            selectionName = `${className}-level-${i}-replaced-spell`
            selections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            for (const selection of selections) {
                selectionList.push({ spell: selection, selectionName: selectionName, selectionLevel: i, isReplacedSpellSelection: true });
            }
            selectionName = `${className}-level-${i}-replacement-spell`
            selections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            for (const selection of selections) {
                selectionList.push({ spell: selection, selectionName: selectionName, selectionLevel: i, isReplacementSpellSelection: true });
            }
        }
        return selectionList;
    }

    static #getReplacementSpell(character, spellName, spellSelectionInfo) {
        const replacedSpell = spellSelectionInfo.find(i => i.isReplacedSpellSelection && i.spell?.value == spellName);
        if (replacedSpell) {
            return spellSelectionInfo
                .find(i => i.isReplacementSpellSelection && i.selectionLevel == replacedSpell.selectionLevel)?.spell;
        }
        return null;
    }

    static #getReplacedSpellAlertMessage(character, selectionName, spellSelectionInfo) {
        let selections = character.selections.find(s => s.name == selectionName)?.values ?? [];
        if (selections.length == 1 && selections[0].value) {
            const spellName = selections[0].value;
            const spellText = selections[0].text;
            const spellReplacement = SelectionUtilities.#getReplacementSpell(character, spellName, spellSelectionInfo);
            if (spellReplacement?.value) {
                return `Locked: ${spellText} has been replaced by ${spellReplacement.text}.`;
            }
        }
        return null;
    }

    static #isSpellSelectedElsewhere(character, spellName, selectionName, spellSelectionInfo,) {
        return spellSelectionInfo.some(
            i => i.spell?.value == spellName && !i.isReplacedSpellSelection && i.selectionName != selectionName);
    }

    static #sortOptions(array, sortField) {
        function sortByProperty(item1, item2) {
            if (item1[sortField] < item2[sortField]) {
                return -1;
            }
            if (item1[sortField] > item2[sortField]) {
                return 1;
            }
            return 0;
        }
        array.sort(sortByProperty);
        return array;
    }

}
