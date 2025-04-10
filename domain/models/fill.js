﻿
import { Change, ChangeSet, ChangeType, GradientType, InputUtilities } from "../references.js";

export class BaseFill {

    // constructor
    constructor(data) {
        this.#id = InputUtilities.cleanseString(data?.id) ?? crypto.randomUUID();
        this.#opacity = InputUtilities.cleanseNumber(data?.opacity) ?? 1;
        this.#eventListeners = {};
    }

    // properties
    #id;
    get id() {
        return this.#id;
    }

    /** @type {number}  */
    #opacity;
    get opacity() {
        return this.#opacity;
    }
    set opacity(opacity) {
        const changeSet = this.#getPropertyChange("opacity", this.#opacity, opacity);
        this.#opacity = opacity;
        this.#onChange(changeSet);
    }

    // methods
    getData() {
        return {
            id: this.#id,
            opacity: this.#opacity
        };
    }

    addEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        this.#eventListeners[eventName].push(listener);
    }

    removeEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        const index = this.#eventListeners[eventName].findIndex(l => l === listener);
        if (index > -1) {
            this.#eventListeners[eventName].splice(index, 1);
        }
    }

    applyChange(change, undoing) {
        if (change.changeType == ChangeType.Edit) {
            this.#applyPropertyChange(change.propertyName, undoing ? change.oldValue : change.newValue);
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            if (changeSet?.changes) {
                for (const change of changeSet.changes) {
                    change.fillId = this.id;
                }
            }
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet);
            }
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(BaseFill.name, propertyName, v1, v2);
    }

    #applyPropertyChange(propertyName, propertyValue) {
        switch (propertyName) {
            case "opacity":
                this.opacity = InputUtilities.cleanseNumber(propertyValue);
                break;
        }
    }
}

export class ColorFill extends BaseFill {

    // constructor
    constructor(data) {
        super(data);
        this.#color = InputUtilities.cleanseString(data?.color);
        this.#eventListeners = {};
    }

    // properties
    /** @type {string}  */
    #color;
    get color() {
        return this.#color;
    }
    set color(color) {
        const changeSet = this.#getPropertyChange("color", this.#color, color);
        this.#color = color;
        this.#onChange(changeSet);
    }

    // methods
    getData() {
        const data = super.getData();
        data.color = this.#color;
        return data;
    }

    addEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        this.#eventListeners[eventName].push(listener);
    }

    removeEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        const index = this.#eventListeners[eventName].findIndex(l => l === listener);
        if (index > -1) {
            this.#eventListeners[eventName].splice(index, 1);
        }
    }

    applyChange(change, undoing) {
        if (change.changeType == ChangeType.Edit) {
            if (change.propertyName == "color") {
                this.#applyPropertyChange(change.propertyName, undoing ? change.oldValue : change.newValue);
            }
            else {
                super.applyChange(change, undoing);
            }
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            if (changeSet?.changes) {
                for (const change of changeSet.changes) {
                    change.fillId = this.id;
                }
            }
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet);
            }
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(ColorFill.name, propertyName, v1, v2);
    }

    #applyPropertyChange(propertyName, propertyValue) {
        switch (propertyName) {
            case "color":
                this.color = InputUtilities.cleanseString(propertyValue);
                break;
        }
    }
}

export class GradientFill extends BaseFill {

    // constructor
    constructor(data) {
        super(data);
        this.#gradientType = InputUtilities.cleanseString(data.gradientType);
        this.#colorStops = [];
        if (data?.colorStops) {
            for (const colorStop of data.colorStops) {
                this.#colorStops.push({
                    offset: InputUtilities.cleanseNumber(colorStop.offset),
                    color: InputUtilities.cleanseString(colorStop.color)
                });
            }
        }
        this.#eventListeners = {};
    }

    // properties
    /** @type {GradientType}  */
    #gradientType;
    get gradientType() {
        return this.#gradientType;
    }
    set gradientType(gradientType) {
        const changeSet = this.#getPropertyChange("gradientType", this.#gradientType, gradientType);
        this.#gradientType = gradientType;
        this.#onChange(changeSet);
    }

    /** @type {{ offset: number, color: string}[]}  */
    #colorStops;
    get colorStops() {
        return this.#colorStops;
    }
    set colorStops(colorStops) {
        const changeSet = this.#getPropertyChange("colorStops", this.#colorStops, colorStops);
        this.#colorStops = colorStops;
        this.#onChange(changeSet);
    }

    // methods
    getData() {
        const data = super.getData();
        data.gradientType = this.#gradientType;
        data.colorStops = this.#colorStops;
        return data;
    }

    addEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        this.#eventListeners[eventName].push(listener);
    }

    removeEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        const index = this.#eventListeners[eventName].findIndex(l => l === listener);
        if (index > -1) {
            this.#eventListeners[eventName].splice(index, 1);
        }
    }

    applyChange(change, undoing) {
        if (change.changeType == ChangeType.Edit) {
            if (change.propertyName == "gradientType" || change.propertyName == "colorStops") {
                this.#applyPropertyChange(change.propertyName, undoing ? change.oldValue : change.newValue);
            }
            else {
                super.applyChange(change, undoing);
            }
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            if (changeSet?.changes) {
                for (const change of changeSet.changes) {
                    change.fillId = this.id;
                }
            }
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet);
            }
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(GradientFill.name, propertyName, v1, v2);
    }

    #applyPropertyChange(propertyName, propertyValue) {
        switch (propertyName) {
            case "gradientType":
                this.gradientType = InputUtilities.cleanseString(propertyValue);
                break;
            case "colorStops":
                const colorStops = [];
                if (propertyValue) {
                    for (const colorStop of propertyValue) {
                        colorStops.push({
                            offset: InputUtilities.cleanseNumber(colorStop.offset),
                            color: InputUtilities.cleanseString(colorStop.color)
                        });
                    }
                }
                this.colorStops = colorStops;
                break;
        }
    }
}

export class TileFill extends BaseFill {

    // constructor
    constructor(data) {
        super(data);
        this.#imageSrc = InputUtilities.cleanseSvg(data?.imageSrc);
        this.#eventListeners = {};
    }

    // properties
    /** @type {string}  */
    #imageSrc;
    get imageSrc() {
        return this.#imageSrc;
    }
    set imageSrc(imageSrc) {
        const changeSet = this.#getPropertyChange("imageSrc", this.#imageSrc, imageSrc);
        this.#imageSrc = imageSrc;
        this.#onChange(changeSet);
    }

    // methods
    getData() {
        const data = super.getData();
        data.imageSrc = this.#imageSrc;
        return data;
    }

    addEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        this.#eventListeners[eventName].push(listener);
    }

    removeEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        const index = this.#eventListeners[eventName].findIndex(l => l === listener);
        if (index > -1) {
            this.#eventListeners[eventName].splice(index, 1);
        }
    }

    applyChange(change, undoing) {
        if (change.changeType == ChangeType.Edit) {
            if (change.propertyName == "imageSrc") {
                this.#applyPropertyChange(change.propertyName, undoing ? change.oldValue : change.newValue);
            }
            else {
                super.applyChange(change, undoing);
            }
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            if (changeSet?.changes) {
                for (const change of changeSet.changes) {
                    change.fillId = this.id;
                }
            }
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet);
            }
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(TileFill.name, propertyName, v1, v2);
    }

    #applyPropertyChange(propertyName, propertyValue) {
        switch (propertyName) {
            case "imageSrc":
                this.imageSrc = InputUtilities.cleanseString(propertyValue);
                break;
        }
    }
}

export class ImageArrayFill extends BaseFill {

    // constructor
    constructor(data) {
        super(data);
        this.#imageSources = [];
        if (data?.imageSources) {
            for (const imageSource of data.imageSources) {
                this.#imageSources.push(InputUtilities.cleanseSvg(imageSource));
            }
        }
        this.#offsetX = ImageUtilities.cleanseNumber(data.offsetX);
        this.#offsetY = ImageUtilities.cleanseNumber(data.offsetY);
        this.#eventListeners = {};
    }

    // properties
    /** @type {string[]}  */
    #imageSources;
    get imageSources() {
        return this.#imageSources;
    }
    set imageSources(imageSources) {
        const changeSet = this.#getPropertyChange("imageSources", this.#imageSources, imageSources);
        this.#imageSources = imageSources;
        this.#onChange(changeSet);
    }

    /** @type {number}  */
    #offsetX;
    get offsetX() {
        return this.#offsetX;
    }
    set offsetX(offsetX) {
        const changeSet = this.#getPropertyChange("offsetX", this.#offsetX, offsetX);
        this.#offsetX = offsetX;
        this.#onChange(changeSet);
    }

    /** @type {number}  */
    #offsetY;
    get offsetY() {
        return this.#offsetY;
    }
    set offsetY(offsetY) {
        const changeSet = this.#getPropertyChange("offsetY", this.#offsetY, offsetY);
        this.#offsetY = offsetY;
        this.#onChange(changeSet);
    }

    // methods
    getData() {
        const data = super.getData();
        data.imageSources = this.#imageSources;
        data.offsetX = this.#offsetX;
        data.offsetY = this.#offsetY;
        return data;
    }

    addEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        this.#eventListeners[eventName].push(listener);
    }

    removeEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        const index = this.#eventListeners[eventName].findIndex(l => l === listener);
        if (index > -1) {
            this.#eventListeners[eventName].splice(index, 1);
        }
    }

    applyChange(change, undoing) {
        if (change.changeType == ChangeType.Edit) {
            if (change.propertyName == "imageSources" || change.propertyName == "offsetX" || change.propertyName == "offsetY") {
                this.#applyPropertyChange(change.propertyName, undoing ? change.oldValue : change.newValue);
            }
            else {
                super.applyChange(change, undoing);
            }
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            if (changeSet?.changes) {
                for (const change of changeSet.changes) {
                    change.fillId = this.id;
                }
            }
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet);
            }
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(ImageArrayFill.name, propertyName, v1, v2);
    }

    #applyPropertyChange(propertyName, propertyValue) {
        switch (propertyName) {
            case "imageSources":
                const imageSources = [];
                if (propertyValue) {
                    for (const imageSource of propertyValue) {
                        imageSources.push(InputUtilities.cleanseString(imageSource));
                    }
                }
                this.imageSources = imageSources;
                break;
            case "offsetX":
                this.offsetX = InputUtilities.cleanseNumber(propertyValue);
                break;
            case "offsetY":
                this.offsetY = InputUtilities.cleanseNumber(propertyValue);
                break;
        }
    }
}
