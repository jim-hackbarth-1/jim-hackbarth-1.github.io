
export function createModel() {
    return new ColorStopViewModel();
}

export class ColorStopViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.pathStyleViewModel = modelInput.pathStyleViewModel;
        this.index = modelInput.index;
        this.colorStop = modelInput.colorStop;
    }

    onKeyDown(event) {
        event.stopPropagation();
    }

    // methods
    getIdPrefix() {
        if (this.pathStyleViewModel && this.index) {
            return `${this.pathStyleViewModel.getStyleType()}-ColorStop-${this.index}`;
        }
        return "";
    }

    getValidationMessage(optionName) {
        return ""; // TODO: field valiation
    }

    updateOptions() {
        this.pathStyleViewModel.updateOptions();
    }

    getOffset() {
        if (this.colorStop) {
            return this.colorStop.offset;
        }
        return 0;
    }

    getColor() {
        if (this.colorStop) {
            return this.colorStop.color;
        }
        return "#c0c0c0";
    }
}
