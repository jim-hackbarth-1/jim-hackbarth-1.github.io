
import { KitDependencyManager } from "../../ui-kit.js";

export function createModel() {
    return new LoadingIndicatorModel();
}

class LoadingIndicatorModel {

    async onRenderStart(componentId) {

        // initialize
        this.componentId = componentId;

        const appDocument = KitDependencyManager.getDocument();
        const style = getComputedStyle(appDocument.documentElement);
        const color1 = style.getPropertyValue("--color-primary");
        const color2 = style.getPropertyValue("--color-secondary");
        const color3 = style.getPropertyValue("--color-tertiary");
        const color4 = style.getPropertyValue("--color-alert");
        const color1Lightest = style.getPropertyValue("--color-surface");
        const color1Darkest = style.getPropertyValue("--color-outline");

        this.backgroundSvg = btoa(`
<svg aria-hidden="true"
     focusable="false"
     viewBox="0 0 100 100"
     xmlns='http://www.w3.org/2000/svg' >
    <circle cx="0" cy="0" r="40" fill="none" stroke="${color1Darkest}" stroke-width="3" transform="translate(50 50)">
        <animateTransform attributeName="transform"
                            dur="5s"
                            type="scale"
                            values="0.8; 1, 1; 0.8;"
                            repeatCount="indefinite"
                            additive="sum" />
    </circle>
    <path id="arm1"
            d="
M 10 50
A 40 40, 0, 0, 0, 50 90
L 50 50 Z"
            fill="${color1}"
            fill-opacity="0.8">
        <animateTransform attributeName="transform"
                            dur="4s"
                            type="rotate"
                            from="0 50 50"
                            to="360 50 50"
                            repeatCount="indefinite" />
    </path>
  <path  id="arm2" d="
M 50 85
A 35 35, 0, 0, 0, 85 50
L 50 50 Z"
            fill="${color2}"
            fill-opacity="0.8">
        <animateTransform attributeName="transform"
                            dur="3s"
                            type="rotate"
                            from="0 50 50"
                            to="360 50 50"
                            repeatCount="indefinite" />
    </path>
  <path  id="arm3" d="
M 80 50
A 30 30, 0, 0, 0, 50 20
L 50 50 Z"
            fill="${color3}"
            fill-opacity="0.8">
        <animateTransform attributeName="transform"
                            dur="2s"
                            type="rotate"
                            from="0 50 50"
                            to="360 50 50"
                            repeatCount="indefinite" />
    </path>
  <path  id="arm4" d="
M 50 25
A 25 25, 0, 0, 0, 25 50
L 50 50 Z"
            fill="${color4}"
            fill-opacity="0.8">
        <animateTransform attributeName="transform"
                            dur="1s"
                            type="rotate"
                            from="0 50 50"
                            to="360 50 50"
                            repeatCount="indefinite" />
    </path>
    <circle cx="50" cy="50" r="1" fill="${color1Lightest}" stroke="${color1Darkest}" stroke-width="1" />
</svg>
`);
    }
}
