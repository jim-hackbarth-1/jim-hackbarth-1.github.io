
export function createModel() {
    return new DomainAbilityScoresAndHitPointsModel();
}

class DomainAbilityScoresAndHitPointsModel {

    #kitElement;

    async init(kitElement) {
        this.#kitElement = kitElement;
    }

    toggleDetail(event, detailSection) {
        if (detailSection == "ability-scores-detail") {
            this.#kitElement.querySelector("#expand-ability-scores").classList.toggle("hidden");
            this.#kitElement.querySelector("#collapse-ability-scores").classList.toggle("hidden");
        }
        else {
            this.#kitElement.querySelector("#expand-hit-points").classList.toggle("hidden");
            this.#kitElement.querySelector("#collapse-hit-points").classList.toggle("hidden");
        }
        this.#kitElement.querySelector(`#${detailSection}`).classList.toggle("hidden");
    }

}
