
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