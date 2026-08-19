
export class DialogHelper {

    // methods
    show(dialog, header, onCloseCallback) {
        this.#dialog = dialog;
        this.#header = header;
        this.#onCloseCallback = onCloseCallback;
        UIKit.window.addEventListener("resize", this.#windowOnResize);
        this.#dialog.addEventListener("click", this.#dialogOnClick);
        this.#header.addEventListener("mousedown", this.#headerOnMouseDown);
        this.#dialog.showModal();
    }

    close() {
        this.#removeEventHandlers();
        if (this.#onCloseCallback) {
            this.#onCloseCallback();
        }
        this.#dialog.close();
    }

    // helpers
    #dialog = null;
    #header = null;
    #onCloseCallback = null;
    #xStart = 0
    #yStart = 0;

    #windowOnResize = (event) => {
        this.close();
    }

    #dialogOnClick = (event) => {
        var rect = this.#dialog.getBoundingClientRect();
        var isInDialog = (rect.top <= event.clientY
            && event.clientY <= rect.top + rect.height
            && rect.left <= event.clientX
            && event.clientX <= rect.left + rect.width);
        if (!isInDialog && event.screenX > 0) {
            this.close();
        }
    }

    #headerOnMouseDown = (event) => {
        const style = UIKit.window.getComputedStyle(this.#dialog);
        const top = style.top.replace("px", "");
        const bottom = style.bottom.replace("px", "");
        if (top == "0" && bottom == "0") {
            return;
        }
        event.preventDefault();
        this.#xStart = event.clientX;
        this.#yStart = event.clientY;
        UIKit.document.addEventListener("mousemove", this.#documentOnMouseMove);
        UIKit.document.addEventListener("mouseup", this.#documentOnMouseUp);
    }

    #documentOnMouseMove = (event) => {
        event.preventDefault();
        const x = this.#xStart - event.clientX;
        const y = this.#yStart - event.clientY;
        this.#xStart = event.clientX;
        this.#yStart = event.clientY;
        this.#dialog.style.top = (this.#dialog.offsetTop - y) + "px";
        this.#dialog.style.left = (this.#dialog.offsetLeft - x) + "px";
    }

    #documentOnMouseUp = (event) => {
        UIKit.document.removeEventListener("mouseup", this.#documentOnMouseUp);
        UIKit.document.removeEventListener("mousemove", this.#documentOnMouseMove);
    }

    #removeEventHandlers = () => {
        this.#dialog.removeEventListener("click", this.#dialogOnClick)
        UIKit.window.removeEventListener("resize", this.#windowOnResize);
        this.#header.removeEventListener("mousedown", this.#headerOnMouseDown);
        UIKit.document.removeEventListener("mouseup", this.#documentOnMouseUp);
        UIKit.document.removeEventListener("mousemove", this.#documentOnMouseMove);
    }
}
