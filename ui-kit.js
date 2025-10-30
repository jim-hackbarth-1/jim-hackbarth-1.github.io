
export class UIKit {

    static #window;
    static get window() {
        if (!UIKit.#window) {
            UIKit.window = window;
        }
        return this.#window;
    }
    static set window(value) {
        this.#window = value;
    }

    static #document;
    static get document() {
        if (!UIKit.#document) {
            UIKit.document = document;
        }
        return this.#document;
    }
    static set document(value) {
        this.#document = value;
    }

    static #console;
    static get console() {
        if (!UIKit.#console) {
            UIKit.console = console;
        }
        return this.#console;
    }
    static set console(value) {
        this.#console = value;
    }

    static #resourceManager;
    static get resourceManager() {
        if (!UIKit.#resourceManager) {
            UIKit.resourceManager = new KitResourceManager();
        }
        return this.#resourceManager;
    }
    static set resourceManager(value) {
        this.#resourceManager = value;
    }

    static #navigator;
    static get navigator() {
        if (!UIKit.#navigator) {
            UIKit.navigator = new KitNavigator();
        }
        return this.#navigator;
    }
    static set navigator(value) {
        this.#navigator = value;
    }

    static #messenger;
    static get messenger() {
        if (!UIKit.#messenger) {
            UIKit.messenger = new KitMessenger();
        }
        return this.#messenger;
    }
    static set messenger(value) {
        this.#messenger = value;
    }

    static #renderer;
    static get renderer() {
        if (!UIKit.#renderer) {
            UIKit.renderer = new KitRenderer();
        }
        return this.#renderer;
    }
    static set renderer(value) {
        this.#renderer = value;
    }

    static #dependencies = [];
    static getDependency(key) {
        return UIKit.#dependencies.find(d => d.key === key)?.value;
    }
    static setDependency(key, value) {
        const item = UIKit.#dependencies.find(d => d.key === key);
        if (item) {
            item.value = value;
        }
        else {
            UIKit.#dependencies.push({ key: key, value: value });
        }
    }

    static async initialize() {    
        UIKit.window.UIKit = UIKit;
        await UIKit.navigator.initialize();
        await UIKit.renderer.render();
    }

}

export class KitResourceManager {

    async fetch(input, init) {
        return await fetch(input, init);
    }

    async import(moduleName) {
        return await import(moduleName);
    }

}

export class KitNavigator {

    static get NavTopic() {
        return "kit-navigation";
    } 

    async initialize() {
        UIKit.window.addEventListener("popstate", async () => {
            await UIKit.navigator.navigate(UIKit.document.location.href);
        });
        await UIKit.messenger.publish(KitNavigator.NavTopic, UIKit.document.location.href);
    }

    async navigate(url) {
        if (url && url !== UIKit.document.location.href) {
            UIKit.window.history.pushState(null, null, url);
        }
        await UIKit.messenger.publish(KitNavigator.NavTopic, url);
    }

    getHash(url) {
        if (url) {
            return new URL(url).hash;
        }
        return null;
    }
}

export class KitMessenger {

    async publish(topicName, message) {
        const topic = KitMessenger.#getTopic(topicName);
        for (const subscriber of topic.subscribers) {
            if (UIKit.document.querySelector(`[kit-element-key="${subscriber.elementKey}"]`)) {
                try {
                    await subscriber.object[subscriber.callback](message);
                }
                catch (error) {
                    UIKit.console.error(error);
                }
            }
            else {
                const index = topic.subscribers.findIndex(s => s.id == subscriber.id);
                if (index > -1) {
                    const temp = [...topic.subscribers];
                    temp.splice(index, 1);
                    topic.subscribers = temp;
                }
            }
        }
    }

    subscribe(topicName, subscriber) {
        const topic = KitMessenger.#getTopic(topicName);
        const existingIndex = topic.subscribers.findIndex(s => s.id == subscriber.id);
        if (existingIndex < 0) {
            topic.subscribers.push(subscriber);
        }
    }

    static #topics = [];
    static #getTopic(topicName) {
        let topic = KitMessenger.#topics.find(t => t.name === topicName);
        if (!topic) {
            topic = {
                name: topicName,
                subscribers: []
            };
            KitMessenger.#topics.push(topic);
        }
        return topic;
    }

}

export class KitRenderer {

    async render() {
        UIKit.document.body.setAttribute("kit-element", "");
        await this.renderKitElement(UIKit.document.body);
    }

    static #renderIteration;
    async renderKitElement(kitElement) {
        const tagName = kitElement.tagName.toLowerCase();
        const isKitElement =
            tagName == "kit-component"
            || tagName == "kit-if"
            || tagName == "kit-array"
            || kitElement.hasAttribute("kit-element");
        if (!isKitElement) {
            UIKit.console.warn("element is not a kit element");
            return;
        }
        KitRenderer.#renderIteration = KitRenderer.#nextKey();
        const currentIteration = KitRenderer.#renderIteration;
        KitRenderer.#initializeElement(kitElement); 
        await KitRenderer.#resolveElement(kitElement);
        KitRenderer.#pruneInitialAttributes(currentIteration);
    }

    getObject(elementKey, objectKey) {
        const objects = UIKit.document.querySelector(`[kit-element-key="${elementKey}"]`)?.kitObjects ?? [];
        return objects.find(o => o.objectKey == objectKey)?.object;
    }

    getKitElementKey(kitElement) {
        return kitElement.getAttribute("kit-element-key");
    }

    getKitElementObject(kitElement, objectAlias = "model") {
        const kitObjects = kitElement?.kitObjects ?? [];
        return kitObjects.find(ko => ko.alias = objectAlias)?.object;
    }

    static #initializeElement(kitElement) {
        let kitTemplateKey = kitElement.getAttribute("kit-template-key");
        let template = null;
        if (!kitTemplateKey) {
            kitTemplateKey = KitRenderer.#nextKey();
            kitElement.setAttribute("kit-template-key", kitTemplateKey);
            template = kitElement.innerHTML;
            if (template) {
                template = template.replace(/<!--.*?-->/sg, ""); // remove comments
                const temp = UIKit.document.createElement("temp");
                temp.innerHTML = template;
                const kitChildElements = KitRenderer.#getTopKitChildElements(temp);
                for (const kitChild of kitChildElements) {
                    KitRenderer.#initializeElement(kitChild);
                }
                template = temp.innerHTML;
                KitRenderer.#setTemplate(null, kitTemplateKey, template);
            }
        }
        if (kitElement.innerHTML) {
            kitElement.innerHTML = "";
        }
    }

    static async #resolveElement(kitElement) {
        KitRenderer.#initializeAttributes(kitElement);
        await KitRenderer.#resolveAttributes(kitElement);
        const elementKey = kitElement.getAttribute("kit-element-key");    
        kitElement.kitObjects = await KitRenderer.#getKitObjects(kitElement);
        const elementAndAncestorObjects
            = KitRenderer.#combineKitObjects(kitElement.kitObjects, kitElement.kitAncestorObjects);
        const template = await KitRenderer.#getKitElementTemplate(kitElement);       
        switch (kitElement.tagName.toLowerCase()) {
            case "kit-component":
                if (kitElement.hasAttribute("kit-template-path")) {
                    kitElement.innerHTML = await KitRenderer.#resolve(template, kitElement.kitObjects);
                }
                else {
                    kitElement.innerHTML = await KitRenderer.#resolve(template, elementAndAncestorObjects);
                }
                break;
            case "kit-if":
                const condition = elementAndAncestorObjects.find(o => o.elementKey == elementKey && o.isCondition).object;
                if (condition) {
                    kitElement.innerHTML = await KitRenderer.#resolve(template, elementAndAncestorObjects);
                }
                break;
            case "kit-array":
                const array = elementAndAncestorObjects.find(o => o.elementKey == elementKey && o.isArray).object;
                const arrayAlias = elementAndAncestorObjects.find(o => o.elementKey == elementKey && o.isArray).alias;
                let itemElement = null;
                let itemAlias = null;
                let indexAlias = null;
                for (let i = 0; i < array.length; i++) {
                    itemElement = UIKit.document.createElement("kit-component");
                    itemAlias = kitElement.getAttribute("kit-array-item-alias");
                    if (itemAlias) {
                        itemElement.setAttribute(`kit-object-${itemAlias}`, `${itemAlias}:#${arrayAlias}[${i}]`);
                    }
                    indexAlias = kitElement.getAttribute("kit-array-item-index-alias");
                    if (indexAlias) {
                        itemElement.setAttribute(`kit-object-${indexAlias}`, `${indexAlias}:${i}`);
                    }
                    itemElement.setAttribute("kit-template-key", kitElement.getAttribute("kit-template-key"));
                    kitElement.appendChild(itemElement);
                }
                break;
            default:
                if (template) {
                    kitElement.innerHTML = await KitRenderer.#resolve(template, elementAndAncestorObjects);
                }
                break;
        }
        const topKitChildElements = KitRenderer.#getTopKitChildElements(kitElement);
        const promises = [];
        for (const kitChildElement of topKitChildElements) {
            kitChildElement.kitAncestorObjects = [...elementAndAncestorObjects];
            promises.push(KitRenderer.#resolveElement(kitChildElement));
        }
        await Promise.all(promises);
        await KitRenderer.#notifyOnRendered(kitElement);
    }

    static async #pruneInitialAttributes(currentIteration) {
        setTimeout(async () => {
            const prunedItems = [];
            const currentItems = [...KitRenderer.#initialAttributes];
            let kitElement = null;
            for (const item of currentItems) {
                kitElement = UIKit.document.querySelector(`[kit-element-key="${item.key}"]`);
                if (kitElement) {
                    prunedItems.push(item);
                }
            }
            if (currentIteration === KitRenderer.#renderIteration) {
                KitRenderer.#initialAttributes = prunedItems;
            }
        });
    }

    static #getTopKitChildElements(kitElement) {
        const baseSelector = ":is(kit-component, kit-if, kit-array, [kit-element])";
        const allChildKits = [...kitElement.querySelectorAll(`:scope ${baseSelector}`)];
        const nestedChildKits = [...kitElement.querySelectorAll(`:scope ${baseSelector} ${baseSelector}`)];
        return allChildKits.filter(e => !nestedChildKits.includes(e));
    }

    static #initializeAttributes(kitElement) {
        let kitElementKey = kitElement.getAttribute("kit-element-key");
        let initialAttributes = [];
        let attributeNames = [];
        if (!kitElementKey) {
            kitElementKey = KitRenderer.#nextKey();
            kitElement.setAttribute("kit-element-key", kitElementKey);
            attributeNames = kitElement.getAttributeNames();
            for (const attributeName of attributeNames) {
                initialAttributes.push({ name: attributeName, value: kitElement.getAttribute(attributeName) });
            }
            KitRenderer.#setInitialAttributes(kitElementKey, initialAttributes);
        }
        initialAttributes = KitRenderer.#getInitialAttributes(kitElementKey);
        attributeNames = kitElement.getAttributeNames();
        for (const attributeName of attributeNames) {
            if (!initialAttributes.some(ia => ia.name == attributeName)) {
                kitElement.removeAttribute(attributeName);
            }
        }
        for (const item of initialAttributes) {
            kitElement.setAttribute(item.name, item.value);
        }
    }

    static async #resolveAttributes(kitElement) {
        let attributeValue = null;
        let index = -1;
        const attributeNames = kitElement.getAttributeNames();
        let addAttributeName = null;
        let addAttributeValue = null;
        for (const attributeName of attributeNames) {
            attributeValue = await KitRenderer.#resolve(kitElement.getAttribute(attributeName), kitElement.kitAncestorObjects);    
            if (attributeName.startsWith("kit-attr-add-")) {
                index = attributeValue.indexOf(":");
                addAttributeName = attributeValue.substring(0, index);
                addAttributeValue = attributeValue.substring(index + 1);
                if (addAttributeValue !== "null") {
                    kitElement.setAttribute(addAttributeName, addAttributeValue);
                }
                kitElement.removeAttribute(attributeName);
            }
            else {
                kitElement.setAttribute(attributeName, attributeValue);
            }
        }
    }

    static async #getKitObjects(kitElement) {
        const objects = [];
        const elementKey = kitElement.getAttribute("kit-element-key");
        let alias = null;
        let objectKey = null;
        let object = null;
        let attributeValue = null;
        let index = -1;

        const attributeNames = kitElement.getAttributeNames();
        for (const attributeName of attributeNames) {
            if (attributeName.startsWith("kit-object-")) {
                attributeValue = kitElement.getAttribute(attributeName);
                index = attributeValue.indexOf(":");
                alias = attributeValue.substring(0, index);
                object = await KitRenderer.#evaluateJavascript(attributeValue.substring(index + 1));
                objectKey = KitRenderer.#nextKey();
                objects.push({ alias: alias, elementKey: elementKey, objectKey: objectKey, object: object });
            }
        }
        if (kitElement.tagName.toLowerCase() == "kit-component") {
            alias = "model";
            let hasModel = false;
            if (kitElement.hasAttribute("kit-model")) {
                object = await KitRenderer.#evaluateJavascript(kitElement.getAttribute("kit-model"));
                hasModel = true;
            }
            else {
                if (kitElement.hasAttribute("kit-template-path")) {
                    const templatePath = kitElement.getAttribute("kit-template-path");
                    if (templatePath) {
                        const modulePath = templatePath.replace(".html", ".js");
                        const jsModule = await UIKit.resourceManager.import(modulePath);
                        object = jsModule.createModel();
                        if (typeof object.init === "function") {
                            await object.init(kitElement, [...objects]);
                        }
                    }
                    hasModel = true;
                }
            }
            if (hasModel) {
                objectKey = KitRenderer.#nextKey();
                objects.push({ alias: alias, elementKey: elementKey, objectKey: objectKey, object: object });
            }
        }
        if (kitElement.tagName.toLowerCase() == "kit-if") {
            alias = `condition-${KitRenderer.#nextKey()}`;
            object = await KitRenderer.#evaluateJavascript(kitElement.getAttribute("kit-condition"));
            objectKey = KitRenderer.#nextKey();
            objects.push({ alias: alias, elementKey: elementKey, objectKey: objectKey, object: object, isCondition: true });
        }
        if (kitElement.tagName.toLowerCase() == "kit-array") {
            alias = kitElement.getAttribute("kit-array-alias") ?? `array-${elementKey}`;
            object = await KitRenderer.#evaluateJavascript(kitElement.getAttribute("kit-array"));
            objectKey = KitRenderer.#nextKey();
            objects.push({ alias: alias, elementKey: elementKey, objectKey: objectKey, object: object, isArray: true });
        }
        objects.sort((a, b) => b.alias.length - a.alias.length); // longest alias first
        return objects;
    }

    static #combineKitObjects(elementObjects, ancestorObjects) {
        const combinedObjects = [...elementObjects ?? []];
        let exists = false;
        if (!ancestorObjects) {
            ancestorObjects = [];
        }
        for (const obj of ancestorObjects) {
            exists = combinedObjects.some(o => o.alias === obj.alias);
            if (!exists) {
                combinedObjects.push(obj);
            }
        }
        combinedObjects.sort((a, b) => b.alias.length - a.alias.length); // longest alias first
        return combinedObjects;
    }

    static async #getKitElementTemplate(kitElement) {
        const kitTemplatePath = kitElement.getAttribute("kit-template-path");
        const kitTemplateKey = kitElement.getAttribute("kit-template-key");
        let template = KitRenderer.#getTemplate(kitTemplatePath, kitTemplateKey);
        if (!template && kitTemplatePath) {
            const response = await UIKit.resourceManager.fetch(kitTemplatePath, { cache: "no-cache" });
            template = await response.text();
            const temp = UIKit.document.createElement("temp");
            temp.innerHTML = template;
            KitRenderer.#initializeElement(temp);
            template = KitRenderer.#getTemplate(null, temp.getAttribute("kit-template-key"));
            KitRenderer.#setTemplate(kitTemplatePath, null, template);
        }
        return template;
    }

    static async #notifyOnRendered(kitElement) {
        const object = kitElement.kitObjects.find(o => o.alias == "model")?.object;
        if (object && typeof object.onRendered === "function") {
            await object.onRendered(kitElement);
        }
    }

    static async #resolve(input, objectMaps) {

        if (!input) {
            return input;
        }

        const escapeAlias = "alias-a07118ed-51f3-4d7e-9d44-ad632b102770-alias";
        const escapeEvalStart = "start-a07118ed-51f3-4d7e-9d44-ad632b102770-start";
        const escapeEvalEnd = "end-a07118ed-51f3-4d7e-9d44-ad632b102770-end";
        let output = input;

        // resolve aliases (i.e. #model ...)
        if (!objectMaps) {
            objectMaps = [];
        }
        for (const objectMap of objectMaps) {
            output = output.replaceAll(`\\#${objectMap.alias}`, escapeAlias);
            output = output.replaceAll(
                `#${objectMap.alias}`,
                `UIKit.renderer.getObject('${objectMap.elementKey}', '${objectMap.objectKey}')`);
            output = output.replaceAll(escapeAlias, `#${objectMap.alias}`);
        }

        // resolve evaluation instructions (i.e. %{ ... }%})
        output = output.replaceAll("\\%{", escapeEvalStart);
        output = output.replaceAll("\\}%", escapeEvalEnd);
        const regex = new RegExp(/(?<=%\{).*?(?=\}%)/, "g"); // characters between %{ and }%
        const matches = [...output.matchAll(regex)];
        if (matches && matches.length > 0) {
            for (const match of matches) {
                const result = await KitRenderer.#evaluateJavascript(match[0]);
                output = output.replaceAll(`%{${match[0]}}%`, result);
            }
        }
        output = output.replaceAll(escapeEvalEnd, "}%");
        output = output.replaceAll(escapeEvalStart, "%{");
        return output;

    }

    static async #evaluateJavascript(js) {
        let result_5212D07346A8495DB3E49C9900B43F6C = null;
        if (js) {
            eval(`(async () => { result_5212D07346A8495DB3E49C9900B43F6C = ${js}; })()`);
        }
        return await result_5212D07346A8495DB3E49C9900B43F6C;
    }

    static #key = 0;
    static #nextKey() {
        if (KitRenderer.#key > Number.MAX_SAFE_INTEGER * 0.9) {
            UIKit.window.reload();
        }
        KitRenderer.#key++;
        return KitRenderer.#key;
    }

    static #templates = [];
    static #getTemplate(path, key) {
        if (path) {
            return KitRenderer.#templates.find(t => t.path == path)?.template;
        }
        return KitRenderer.#templates.find(t => t.key == key)?.template;
    }
    static #setTemplate(path, key, template) {
        let item = null;
        if (path) {
            item = KitRenderer.#templates.find(t => t.path == path);
        }
        else {
            item = KitRenderer.#templates.find(t => t.key == key);
        }
        if (item) {
            item.template = template;
        }
        else {
            KitRenderer.#templates.push({ path: path, key: key, template: template });
        }
    }

    static #initialAttributes = [];
    static #getInitialAttributes(key) {
        return KitRenderer.#initialAttributes.find(ia => ia.key == key)?.attributes;
    }
    static #setInitialAttributes(key, attributes) {
        const item = KitRenderer.#initialAttributes.find(ia => ia.key == key);
        if (item) {
            item.attributes = attributes;
        }
        else {
            KitRenderer.#initialAttributes.push({ key: key, attributes: attributes });
        }
    }

}

if (globalThis.document) {
    document.addEventListener("DOMContentLoaded", async () => { await UIKit.initialize() });
}
