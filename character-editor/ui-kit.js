
/** Provides a global entry point to UI-KIT capabilities */
export class UIKit {

    static #window;
    static #document;
    static #console;
    static #resourceManager;
    static #navigator;
    static #messenger;
    static #renderer;
    static #dependencies = [];

    /**
     * Gets the window object
     * @returns {Window}
     */
    static get window() {
        if (!UIKit.#window) {
            UIKit.window = window;
        }
        return this.#window;
    }

    /**
     * Sets the window object
     * @param {Window} value - The window
     */
    static set window(value) {
        this.#window = value;
    }

    /**
     * Gets the document object
     * @returns {Document}
     */
    static get document() {
        if (!UIKit.#document) {
            UIKit.document = document;
        }
        return this.#document;
    }

    /**
     * Sets the document object
     * @param {Document} value - The document
     */
    static set document(value) {
        this.#document = value;
    }

    /**
     * Gets the console object
     * @returns {Console}
     */
    static get console() {
        if (!UIKit.#console) {
            UIKit.console = console;
        }
        return this.#console;
    }

    /**
     * Sets the console object
     * @param {Console} value - The console
     */
    static set console(value) {
        this.#console = value;
    }

    /**
     * Gets the resource manager
     * @returns {KitResourceManager}
     */
    static get resourceManager() {
        if (!UIKit.#resourceManager) {
            UIKit.resourceManager = new KitResourceManager();
        }
        return this.#resourceManager;
    }

    /**
     * Sets the resource manager
     * @param {KitResourceManager} value - The resource manager
     */
    static set resourceManager(value) {
        this.#resourceManager = value;
    }

    /**
     * Gets the navigator
     * @returns {KitNavigator}
     */
    static get navigator() {
        if (!UIKit.#navigator) {
            UIKit.navigator = new KitNavigator();
        }
        return this.#navigator;
    }

    /**
     * Sets the navigator
     * @param {KitNavigator} value - The navigator
     */
    static set navigator(value) {
        this.#navigator = value;
    }

    /**
     * Gets the messenger
     * @returns {KitMessenger}
     */
    static get messenger() {
        if (!UIKit.#messenger) {
            UIKit.messenger = new KitMessenger();
        }
        return this.#messenger;
    }

    /**
     * Sets the messenger
     * @param {KitMessenger} value - The messenger
     */
    static set messenger(value) {
        this.#messenger = value;
    }

    /**
     * Gets the renderer
     * @returns {KitRenderer}
     */
    static get renderer() {
        if (!UIKit.#renderer) {
            UIKit.renderer = new KitRenderer();
        }
        return this.#renderer;
    }

    /**
     * Sets the renderer
     * @param {KitRenderer} value - The renderer
     */
    static set renderer(value) {
        this.#renderer = value;
    }

    /**
     * Gets a dependency by key
     * @param {string} key - The key used to find the dependency
     * @returns {any}
     */
    static getDependency(key) {
        return UIKit.#dependencies.find(d => d.key === key)?.value;
    }

    /**
     * Sets a dependency
     * @param {string} key - The dependency key
     * @param {any} value - The dependency
     */
    static setDependency(key, value) {
        const item = UIKit.#dependencies.find(d => d.key === key);
        if (item) {
            item.value = value;
        }
        else {
            UIKit.#dependencies.push({ key: key, value: value });
        }
    }

    /** Adds UIKit to the global scope, initializes navigation, and performs an initial render of the document body */
    static async initialize() {    
        UIKit.window.UIKit = UIKit;
        await UIKit.navigator.initialize();
        await UIKit.renderer.render();
    }

}

/** Encapsulates functionality for interacting with network resources */
export class KitResourceManager {

    /**
     * Gets content from a network resource
     * @param {any} input - Resource path
     * @param {any} init - Options
     * @returns {Promise}
     */
    async fetch(input, init) {
        return await fetch(input, init);
    }

    /**
     * Imports a script module
     * @param {string} moduleName - The name of the module to import
     * @returns {any}
     */
    async import(moduleName) {
        return await import(moduleName);
    }

}

/** Facilitates navigation functionality */
export class KitNavigator {

    static get NavTopic() {
        return "kit-navigation";
    } 

    /** Configures an application to generate navigation events from the browser `popstate` event. */
    async initialize() {
        UIKit.window.addEventListener("popstate", async () => {
            await UIKit.navigator.navigate(UIKit.document.location.href);
        });
        await UIKit.messenger.publish(KitNavigator.NavTopic, UIKit.document.location.href);
    }

    /**
     * Navigates to the specified url
     * @param {string} url - The destination url
     */
    async navigate(url) {
        if (url && url !== UIKit.document.location.href) {
            UIKit.window.history.pushState(null, null, url);
        }
        await UIKit.messenger.publish(KitNavigator.NavTopic, url);
    }

    /**
     *  Gets the hash portion of a url
     * @param {any} url - The url to examine
     * @returns {string}
     */
    getHash(url) {
        if (url) {
            return new URL(url).hash;
        }
        return null;
    }
}

/** Send and receive messages between components */
export class KitMessenger {

    /**
        * Publish a message to subscribers of a topic
        * @param {string} topicName - The name of the topic
        * @param {any} message - The message to be published
        */
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

    /**
        * Subscribe to receive messages published to a topic
        * @param {string} topicName - The name of the topic
        * @param {{elementKey: number, id: string, object: any, callback: string}} subscriber - The subscriber
        */
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

/** Renders component html elements */
export class KitRenderer {

    /** Renders the document body */
    async render() {
        await this.renderElement(UIKit.document.body);
    }

    static #renderIteration;

    /**
     * Renders an element
     * @param {HTMLElement} element -  The element to render
     */
    async renderElement(element) {
        KitRenderer.#renderIteration = KitRenderer.#nextKey();
        const currentIteration = KitRenderer.#renderIteration;
        KitRenderer.#initializeElement(element); 
        await KitRenderer.#resolveElement(element);
        KitRenderer.#pruneInitialAttributes(currentIteration);
    }

    /**
     * Retrieves an object from a kit element's object store by object key
     * @param {number} elementKey - The key for the element where the object is stored
     * @param {number} objectKey - The key for the object within the element's object store
     */
    getObject(elementKey, objectKey) {
        const objects = UIKit.document.querySelector(`[kit-element-key="${elementKey}"]`)?.kitObjects ?? [];
        return objects.find(o => o.objectKey == objectKey)?.object;
    }

    /**
     * Retrieves the element key for a kit element
     * @param {HTMLElement} kitElement - The kit element
     */
    getKitElementKey(kitElement) {
        return kitElement.getAttribute("kit-element-key");
    }

    /**
     * Retrieves an object from a kit element's object store by alias
     * @param {HTMLElement} kitElement - The kit element
     * @param {string} objectAlias - The alias for the object
     */
    getKitElementObject(kitElement, objectAlias = "model") {
        const kitObjects = kitElement?.kitObjects ?? [];
        return kitObjects.find(ko => ko.alias = objectAlias)?.object;
    }

    static #initializeElement(element) {
        let kitTemplateKey = element.getAttribute("kit-template-key");
        let template = null;
        if (!kitTemplateKey) {
            kitTemplateKey = KitRenderer.#nextKey();
            element.setAttribute("kit-template-key", kitTemplateKey);
            template = element.innerHTML;
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
        if (element.innerHTML) {
            element.innerHTML = "";
        }
    }

    static async #resolveElement(element) {

        // initialize attributes
        KitRenderer.#initializeAttributes(element);

        // resolve attributes
        const ancestorObjects = KitRenderer.#getKitAncestorObjects(element);
        await KitRenderer.#resolveArrayItemAttributes(element, ancestorObjects);
        element.kitObjects = await KitRenderer.#getArrayItemObjects(element);
        const arrayAndAncestorObjects = KitRenderer.#combineKitObjects(element.kitObjects, ancestorObjects);
        await KitRenderer.#resolveObjectAttributes(element, arrayAndAncestorObjects);
        element.kitObjects = await KitRenderer.#getKitObjects(element);
        const elementAndAncestorObjects
            = KitRenderer.#combineKitObjects(element.kitObjects, ancestorObjects);
        await KitRenderer.#resolveAttributes(element, elementAndAncestorObjects);

        // resolve inner html
        const elementKey = element.getAttribute("kit-element-key"); 
        const template = await KitRenderer.#getKitElementTemplate(element);
        let resolveTemplate = true;
        if (element.hasAttribute("kit-if")) {
            resolveTemplate = elementAndAncestorObjects.find(o => o.elementKey == elementKey && o.isIf).object;
        }
        if (resolveTemplate) {
            if (element.hasAttribute("kit-array")) {
                const array = elementAndAncestorObjects.find(o => o.elementKey == elementKey && o.isArray).object;
                const arrayAlias = elementAndAncestorObjects.find(o => o.elementKey == elementKey && o.isArray).alias;
                const hasArrayItemAliasAttr = element.hasAttribute("kit-array-item-alias");
                let arrayItemAliasAttr = null;
                if (hasArrayItemAliasAttr) {
                    arrayItemAliasAttr = element.getAttribute("kit-array-item-alias");
                }
                const hasArrayIndexAliasAttr = element.hasAttribute("kit-array-index-alias");
                let arrayIndexAliasAttr = null;
                if (hasArrayIndexAliasAttr) {
                    arrayIndexAliasAttr = element.getAttribute("kit-array-index-alias");
                }   
                let tempElement = null;
                for (let i = 0; i < array.length; i++) {
                    tempElement = UIKit.document.createElement("temp");
                    tempElement.innerHTML = template;
                    for (const tempChild of tempElement.children) {
                        const child = tempChild.cloneNode(true);
                        child.setAttribute("kit-element", "");
                        if (hasArrayItemAliasAttr) {
                            child.setAttribute("kit-array-item", `${arrayItemAliasAttr}:#${arrayAlias}[${i}]`);
                        }
                        if (hasArrayIndexAliasAttr) {
                            child.setAttribute("kit-array-index", `${arrayIndexAliasAttr}:${i}`);
                        }
                        KitRenderer.#initializeElement(child);
                        element.appendChild(child);
                    }
                }
            }
            else {
                if (element.hasAttribute("kit-component")) {
                    element.innerHTML = await KitRenderer.#resolve(template, element.kitObjects);
                }
                else {
                    const innerHtml = await KitRenderer.#resolve(template, elementAndAncestorObjects);
                    if (innerHtml) {
                        element.innerHTML = innerHtml;
                    }
                }
            }
        }

        // clear kit attributes
        KitRenderer.#clearKitAttributes(element);

        // resolve kit child elements
        const topKitChildElements = KitRenderer.#getTopKitChildElements(element);
        const promises = [];
        for (const kitChildElement of topKitChildElements) {
            kitChildElement.kitAncestorObjects = [...elementAndAncestorObjects];
            promises.push(KitRenderer.#resolveElement(kitChildElement));
        }
        await Promise.all(promises);

        // notify listeners of element resolution
        await KitRenderer.#notifyOnRendered(element);
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

    static #getTopKitChildElements(element) {
        const baseSelector = ":is([kit-array], [kit-component], [kit-element], [kit-if])";
        const allChildKits = [...element.querySelectorAll(`:scope ${baseSelector}`)];
        const nestedChildKits = [...element.querySelectorAll(`:scope ${baseSelector} ${baseSelector}`)];
        return allChildKits.filter(e => !nestedChildKits.includes(e));
    }

    static #initializeAttributes(element) {
        let kitElementKey = element.getAttribute("kit-element-key");
        let initialAttributes = [];
        let attributeNames = [];
        if (!kitElementKey) {
            kitElementKey = KitRenderer.#nextKey();
            element.setAttribute("kit-element-key", kitElementKey);
            attributeNames = element.getAttributeNames();
            for (const attributeName of attributeNames) {
                initialAttributes.push({ name: attributeName, value: element.getAttribute(attributeName) });
            }
            KitRenderer.#setInitialAttributes(kitElementKey, initialAttributes);
        }
        initialAttributes = KitRenderer.#getInitialAttributes(kitElementKey);
        attributeNames = element.getAttributeNames();
        for (const attributeName of attributeNames) {
            if (!initialAttributes.some(ia => ia.name == attributeName)) {
                element.removeAttribute(attributeName);
            }
        }
        for (const item of initialAttributes) {
            element.setAttribute(item.name, item.value);
        }
    }

    static #getKitAncestorObjects(element) {
        const elementKey = element.getAttribute("kit-element-key"); 
        const closestKitElement = element.closest("[kit-array], [kit-component], [kit-element], [kit-if]");
        let closestElementKey = null;
        if (closestKitElement) {
            closestElementKey = closestKitElement.getAttribute("kit-element-key"); 
        }
        if (elementKey == closestElementKey) {
            return closestKitElement?.kitAncestorObjects ?? [];
        }
        else {
            return KitRenderer.#combineKitObjects(closestKitElement?.kitObjects, closestKitElement?.kitAncestorObjects);
        }
    }

    static async #resolveArrayItemAttributes(element, ancestorObjects) {
        if (element.hasAttribute("kit-array-item") || element.hasAttribute("kit-array-index")) {
            let attributeValue = null;
            const arrayItemAttrs = ["kit-array-item", "kit-array-index"];
            const attributeNames = element
                .getAttributeNames()
                .map(an => an.toLowerCase())
                .filter(an => arrayItemAttrs.includes(an));
            for (const attributeName of attributeNames) {
                attributeValue = await KitRenderer.#resolve(element.getAttribute(attributeName), ancestorObjects);
                element.setAttribute(attributeName, attributeValue);
            }
        }
    }

    static async #resolveObjectAttributes(element, ancestorObjects) {
        let attributeValue = null;
        const objAttrs = ["kit-array", "kit-if", "kit-model"];
        const attributeNames = element
            .getAttributeNames()
            .map(an => an.toLowerCase())
            .filter(an => objAttrs.includes(an) || an.startsWith("kit-obj-"));
        for (const attributeName of attributeNames) {
            attributeValue = await KitRenderer.#resolve(element.getAttribute(attributeName), ancestorObjects);
            element.setAttribute(attributeName, attributeValue);
        }
    }

    static async #resolveAttributes(element, elementAndAncestorObjects) {
        let attributeValue = null;
        let index = -1;
        const objAttrs = ["kit-array", "kit-array-item", "kit-array-index", "kit-if", "kit-model"];
        const attributeNames = element
            .getAttributeNames()
            .map(an => an.toLowerCase())
            .filter(an => !objAttrs.includes(an) && !an.startsWith("kit-obj-"));
        let addAttributeName = null;
        let addAttributeValue = null;
        for (const attributeName of attributeNames) {
            attributeValue = await KitRenderer.#resolve(element.getAttribute(attributeName), elementAndAncestorObjects);    
            if (attributeName.startsWith("kit-attr-")) {
                index = attributeValue.indexOf(":");
                addAttributeName = attributeValue.substring(0, index);
                addAttributeValue = attributeValue.substring(index + 1);
                if (addAttributeValue !== "null") {
                    element.setAttribute(addAttributeName, addAttributeValue);
                }
                element.removeAttribute(attributeName);
            }
            else {
                element.setAttribute(attributeName, attributeValue);
            }
        }
    }

    static async #getArrayItemObjects(element) {
        const objects = [];
        const elementKey = element.getAttribute("kit-element-key");
        await KitRenderer.#addKitObject(objects, element, elementKey, "kit-array-item");
        await KitRenderer.#addKitObject(objects, element, elementKey, "kit-array-index");
        return objects;
    }

    static async #getKitObjects(element) {
        const objects = [];
        const elementKey = element.getAttribute("kit-element-key");
        await KitRenderer.#addKitObject(objects, element, elementKey, "kit-array", `array-${elementKey}`);
        await KitRenderer.#addKitObject(objects, element, elementKey, "kit-array-item");
        await KitRenderer.#addKitObject(objects, element, elementKey, "kit-array-index");
        await KitRenderer.#addKitObject(objects, element, elementKey, "kit-if", `if-${elementKey}`);

        // kit-model
        let componentModel = null;
        if (element.hasAttribute("kit-model")) {
            await KitRenderer.#addKitObject(objects, element, elementKey, "kit-model", "model");
        }
        else {
            if (element.hasAttribute("kit-component")) {
                let templatePath = element.getAttribute("kit-component");
                if (!templatePath.startsWith("no-model:")) {
                    const modulePath = templatePath.replace(".html", ".js");
                    const jsModule = await UIKit.resourceManager.import(modulePath);
                    const object = jsModule.createModel();
                    const objectKey = KitRenderer.#nextKey();
                    objects.push({ alias: "model", elementKey: elementKey, objectKey: objectKey, object: object });
                    componentModel = object;
                }
            }
        }

        // kit-obj-*
        const attributeNames = element.getAttributeNames();
        for (const attributeName of attributeNames) {
            if (attributeName.startsWith("kit-obj-")) {
                await KitRenderer.#addKitObject(objects, element, elementKey, attributeName);
            }
        }

        objects.sort((a, b) => b.alias.length - a.alias.length); // longest alias first
        if (typeof componentModel?.init === "function") {
            await componentModel.init(element, [...objects]);
        }
        return objects;
    }

    static async #addKitObject(objects, element, elementKey, attributeName, alias = null) {
        if (element.hasAttribute(attributeName)) {
            let attributeValue = element.getAttribute(attributeName);
            if (!alias) { 
                const index = attributeValue.indexOf(":");
                alias = attributeValue.substring(0, index);
                attributeValue = attributeValue.substring(index + 1)
            }
            const object = await KitRenderer.#evaluateJavascript(attributeValue);
            const objectKey = KitRenderer.#nextKey();
            const item = { alias: alias, elementKey: elementKey, objectKey: objectKey, object: object };
            if (attributeName == "kit-array") {
                item.isArray = true;
            }
            if (attributeName == "kit-if") {
                item.isIf = true;
            }
            objects.push(item);
        }
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

    static async #getKitElementTemplate(element) {
        let templatePath = element.getAttribute("kit-component");
        if (templatePath) {
            templatePath = templatePath.replace("no-model:", "");
        }
        const kitTemplateKey = element.getAttribute("kit-template-key");
        let template = KitRenderer.#getTemplate(templatePath, kitTemplateKey);
        if (!template && templatePath) {
            const response = await UIKit.resourceManager.fetch(templatePath, { cache: "no-cache" });
            template = await response.text();
            const temp = UIKit.document.createElement("temp");
            temp.innerHTML = template;
            KitRenderer.#initializeElement(temp);
            template = KitRenderer.#getTemplate(null, temp.getAttribute("kit-template-key"));
            KitRenderer.#setTemplate(templatePath, null, template);
        }
        return template;
    }

    static #clearKitAttributes(element) {
        const kitIdAttrs = ["kit-array", "kit-component", "kit-element", "kit-if"];
        const kitObjAttrs = ["kit-array-item", "kit-array-item-alias", "kit-array-index", "kit-array-index-alias", "kit-model"];
        let attributeNames = element
            .getAttributeNames()
            .map(an => an.toLowerCase())
            .filter(an => kitIdAttrs.includes(an));
        for (const attributeName of attributeNames) {
            element.setAttribute(attributeName, "");
        }
        attributeNames = element
            .getAttributeNames()
            .map(an => an.toLowerCase())
            .filter(an => kitObjAttrs.includes(an) || an.startsWith("kit-obj-") || an.startsWith("kit-attr-"));
        for (const attributeName of attributeNames) {
            element.removeAttribute(attributeName);
        }
    }

    static async #notifyOnRendered(element) {
        const object = element.kitObjects.find(o => o.alias == "model")?.object;
        if (object && typeof object.onRendered === "function") {
            await object.onRendered(element);
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

        try {
            // resolve aliases (i.e. #model ...)
            if (!objectMaps) {
                objectMaps = [];
            }
            for (const objectMap of objectMaps) {
                output = output.replaceAll(`\\#${objectMap.alias}`, escapeAlias);
                output = output.replaceAll(
                    `#${objectMap.alias}`,
                    `UIKit.renderer.getObject(${objectMap.elementKey}, ${objectMap.objectKey})`);
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
        }
        catch (error) {
            UIKit.console.error(new Error("Error resolving input"), { input: input });
            throw error;
        }
        
        return output;
    }

    static async #evaluateJavascript(js) {
        let result_5212D07346A8495DB3E49C9900B43F6C = null;
        let error_5212D07346A8495DB3E49C9900B43F6C = null;
        if (js) {
            eval(`(async () => { try { result_5212D07346A8495DB3E49C9900B43F6C = ${js}; } catch (error) { error_5212D07346A8495DB3E49C9900B43F6C = error; } })()`);
        }
        if (error_5212D07346A8495DB3E49C9900B43F6C) {
            const error = error_5212D07346A8495DB3E49C9900B43F6C
            error.message = `\nError evaluating javascript: ${js}\n${error.message}`;
            throw error;
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
