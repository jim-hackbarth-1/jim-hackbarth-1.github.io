
export function createModel() {
    return new AccountModel();
}

class AccountModel {

    async onRenderStart(componentId) {
        this.componentId = componentId;
    } 
}
