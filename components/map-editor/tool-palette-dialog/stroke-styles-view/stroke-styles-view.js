
export function createModel() {
    return new StrokeStylesViewModel();
}

export class StrokeStylesViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.pathStyleViewModel = modelInput.pathStyleViewModel;
    }

    onKeyDown(event) {
        event.stopPropagation();
    }

    // methods
    getStyleType() {
        if (this.pathStyleViewModel) {
            return this.pathStyleViewModel.getStyleType()
        }
        return "";
    }

    getValidationMessage(optionName) {
        return ""; // TODO: field valiation
    }

    updateOptions() {
        this.pathStyleViewModel.updateOptions();
    }

    getOption(optionName) {
        return this.pathStyleViewModel.getOption(optionName);
    }

    isSelected(optionName, optionValue) {
        const currentValue = this.pathStyleViewModel.getOption(optionName);
        if (currentValue == optionValue) {
            return "selected";
        }
        return "";
    }
}
