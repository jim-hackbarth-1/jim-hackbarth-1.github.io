
import { KitRenderer } from "../../ui-kit.js";

export function createModel() {
    return new AppHomeModel();
}

class AppHomeModel {

    async onRenderStart(componentId) {

        // initialize
        this.componentId = componentId;
        if (!this.loaded) {
            await this.loadContent();
        }
    }

    async loadContent() {

        this.loading = true;

        // simulate a delay getting data
        await new Promise(r => setTimeout(r, 3000));

        // set data
        this.content = `Lorem ipsum odor amet, consectetuer adipiscing elit. Cras lacinia dis cras elementum facilisis integer volutpat augue. Risus nibh tortor vulputate eget class pulvinar nostra. Proin potenti adipiscing finibus non, viverra orci inceptos. Lorem felis urna congue vulputate, nec mattis. Senectus eleifend cursus rhoncus habitant donec odio iaculis mus. Himenaeos nec quam gravida nostra augue integer odio.
        Tortor nascetur iaculis sapien rhoncus morbi ut. Rhoncus congue fames venenatis parturient accumsan. Facilisis iaculis etiam interdum vestibulum nisi. Efficitur purus dolor sagittis facilisis rhoncus platea ligula enim lorem. Imperdiet mauris etiam vel varius nisi bibendum. Condimentum vel odio vehicula neque et mollis lorem justo? Nostra pharetra potenti ad eu ullamcorper mus. Varius massa sociosqu netus sagittis sodales egestas.
        Cras suscipit ornare ante posuere at tellus interdum. Convallis sodales vitae ex rhoncus vitae. Enim nam tellus donec augue; morbi nascetur turpis. Integer vestibulum rhoncus hac commodo ornare inceptos. Tellus aptent nullam curabitur vulputate metus. Ultricies potenti cras pellentesque molestie molestie ornare hac pellentesque. Mollis dictum proin sagittis justo a nascetur fermentum phasellus.
        Natoque finibus molestie platea platea pretium. Eleifend et ligula habitant suscipit; nam maecenas. Odio elementum mollis at nascetur, lobortis erat. Nascetur purus at etiam dui sodales lobortis fames. Imperdiet sagittis elementum sagittis accumsan class, primis suscipit. Integer lacus id arcu aliquam sodales himenaeos ante. Aliquet velit rhoncus cras arcu; convallis nulla lacinia enim?
        Nisi facilisi suscipit metus sollicitudin netus, in sed felis. Sollicitudin facilisis etiam eu viverra natoque; commodo posuere. Nunc tristique luctus, velit vivamus lacus primis. Purus blandit auctor duis hac convallis parturient; id gravida. Fermentum curabitur phasellus phasellus metus consequat. Augue et vehicula tempus purus at primis interdum. Placerat nibh fusce etiam etiam massa ad maecenas elementum.`;
        this.loading = false;
        this.loaded = true;

        // re-render
        KitRenderer.renderComponent(this.componentId);
    }

}
