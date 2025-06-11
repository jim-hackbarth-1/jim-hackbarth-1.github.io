
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/** Provides inversion of control support for objects with dependencies */
export class KitDependencyManager {

    /**
     * Gets the window object
     * @returns {Window}
     */
    static getWindow() {
        return KitDependencyManager.get(KitDependencyManager.#window);
    }

    /**
     * Sets the window object
     * @param {Window} windowIn - The window
     */
    static setWindow(windowIn) {
        KitDependencyManager.set(KitDependencyManager.#window, windowIn);
    }

    /**
     * Gets the document object
     * @returns {Document}
     */
    static getDocument() {
        return KitDependencyManager.get(KitDependencyManager.#document);
    }

    /**
     * Sets the document object
     * @param {Document} documentIn - The document
     */
    static setDocument(documentIn) {
        KitDependencyManager.set(KitDependencyManager.#document, documentIn);
    }

    /**
     * Gets the console object
     * @returns {Console}
     */
    static getConsole() {
        return KitDependencyManager.get(KitDependencyManager.#console);
    }

    /**
     * Sets the console object
     * @param {Console} consoleIn - The console
     */
    static setConsole(consoleIn) {
        KitDependencyManager.set(KitDependencyManager.#console, consoleIn);
    }

    /**
     * Gets the resource manager
     * @returns {KitResourceManager}
     */
    static getResourceManager() {
        return KitDependencyManager.get(KitDependencyManager.#resourceManager);
    }

    /**
     * Sets the resource manager
     * @param {KitResourceManager} resourceManager - The resource manager
     */
    static setResourceManager(resourceManager) {
        KitDependencyManager.set(KitDependencyManager.#resourceManager, resourceManager);
    }

    /**
     * Get a dependency
     * @param {string} key - The dependency key used to find the dependency
     * @returns {any}
     */
    static get(key) {
        const dependency = KitDependencyManager.#getDependency(key);
        if (dependency) {
            return dependency.value;
        }
        return null;
    }

    /**
     * Sets a dependency
     * @param {string} key - The dependency key used to find the dependency
     * @param {any} value - The dependency
     */
    static set(key, value) {
        const dependency = KitDependencyManager.#getDependency(key);
        if (dependency) {
            dependency.value = value;
        }
        else {
            KitDependencyManager.#dependencies.push({ key: key, value: value });
        }
    }

    /**
     * Remove all dependencies
     */
    static clear() {
        KitDependencyManager.#dependencies = [];
    }

    /** @type {string} */
    static #window = "window";

    /** @type {string} */
    static #document = "document";

    /** @type {string} */
    static #console = "console";

    /** @type {string} */
    static #resourceManager = "resource-manager";

    /** @type {{key: string, value: any}[]} */
    static #dependencies = [];

    /**
     * Get a dependency reference
     * @param {string} key  The dependency key used to find the dependency
     * @returns {{key: string, value: any}}
     */
    static #getDependency(key) {
        let dependency = null;
        if (key) {
            const matches = KitDependencyManager.#dependencies.filter(d => d.key === key);
            if (matches && matches.length > 0) {
                dependency = matches[0];
            }
        }
        return dependency;
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/** Facilitates navigation functionality */
export class KitNavigator {

    static navTopicName = "navigation";

    /** This method is called to configure an application to generate navigation events from the browser `popstate` event. */
    static async initialize() {

        // handle pop state event
        const document = KitDependencyManager.getDocument();
        const window = KitDependencyManager.getWindow();
        window.addEventListener("popstate", async () => {
            await KitNavigator.navigate(document.location.href);
        });

        // publish initial navigation message
        await KitMessenger.publish(KitNavigator.navTopicName, document.location.href);
    }

    /**
     * Navigates to the specified url
     * @param {string} url - The destination url
     */
    static async navigate(url) {
        const document = KitDependencyManager.getDocument();
        const window = KitDependencyManager.getWindow();
        if (url && url !== document.location.href) {
            window.history.pushState(null, null, url);
        }
        await KitMessenger.publish(KitNavigator.navTopicName, url);
    }

    /**
     *  Gets the url fragment (or "hash" property) from a url
     * @param {any} url - The url to examine
     * @returns {string}
     */
    static getUrlFragment(url) {
        if (url) {
            return new URL(url).hash;
        }
        return null;
    }

    /**
     * Gets the url fragment (or "hash" property) from the current url
     * @returns {string}
     */
    static getCurrentUrlFragment() {
        const appDocument = KitDependencyManager.getDocument();
        return KitNavigator.getUrlFragment(appDocument.location.href);
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/** Send and receive messages between components */
export class KitMessenger {

    /**
     * Publish a message to subscribers of a topic
     * @param {string} topicName - The name of the topic
     * @param {any} message - The message to be published
     */
    static async publish(topicName, message) {
        if (!topicName) {
            throw new Error("topicName not provided");
        }
        let topic = KitMessenger.#topics.find(t => t.name === topicName);
        if (!topic) {
            KitMessenger.#addTopic(topicName);
            topic = KitMessenger.#topics.find(t => t.name === topicName);
        }
        const appConsole = KitDependencyManager.getConsole();
        const activeSubscribers = [];
        const subscribers = topic.subscribers.slice();
        for (const subscriber of subscribers) {
            if (subscriber && subscriber.componentId && subscriber.callback) {
                const component = KitComponent.find(subscriber.componentId);
                if (component && component.model && typeof component.model[subscriber.callback] === "function") {
                    activeSubscribers.push(subscriber);
                    try {
                        await component.model[subscriber.callback](message);
                    }
                    catch (error) {
                        appConsole.error(error);
                    }
                }
            }
        }
        topic.subscribers = activeSubscribers;
    }

    /**
     * Subscribe to receive messages published to a topic
     * @param {string} topicName - The name of the topic
     * @param {string} componentId - The id of the KitComponent subscriber
     * @param {string} callback- The name of the function receiving published messages
     */
    static subscribe(topicName, componentId, callback) {
        if (!topicName) {
            throw new Error("topicName not provided");
        }
        let topic = KitMessenger.#topics.find(t => t.name === topicName);
        if (!topic) {
            KitMessenger.#addTopic(topicName);
            topic = KitMessenger.#topics.find(t => t.name === topicName);
        }
        if (!componentId) {
            throw new Error("component id not provided");
        }
        const component = KitComponent.find(componentId);
        if (!component) {
            throw new Error(`component not found: ${componentId}`);
        }
        if (!component.model) {
            throw new Error(`model not defined for component.  component id: ${componentId}`);
        }
        if (!callback) {
            throw new Error("callback not provided");
        }
        if (typeof component.model[callback] !== "function") {
            throw new Error(`provided callback is not a function: ${callback}`);
        }
        if (!topic.subscribers) {
            topic.subscribers = [];
        }
        if (topic.subscribers.find(s => s.componentId === componentId && s.callback === callback)) {
            return;
        }
        topic.subscribers.push({
            componentId: componentId,
            callback: callback
        });
    }

    /** @type {{name: string, subscribers: {componentId: string, callback: string}[]}[]} */
    static #topics = [];

    /**
     * Adds a topic
     * @param {string} topicName - The name of the topic
     */
    static #addTopic(topicName) {
        let topic = KitMessenger.#topics.find(t => t.name === topicName);
        if (!topic) {
            topic = {
                name: topicName,
                subscribers: []
            };
            KitMessenger.#topics.push(topic);
        }
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/**
 * Enum for component type
 * @readonly
 * @enum {string}
 */
export const KitComponentType = {
    Component: "Component",
    ConditionalComponent: "ConditionalComponent",
    ArrayComponent: "ArrayComponent"
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/** Encapsulates options available when creating a KitComponent */
export class KitComponentOptions {

    /** @type {KitComponentType} */
    componentType;

    /** @type {string} */
    template;

    /** @type {boolean} */
    hasTemplatePath;

    /** @type {any} */
    model;

    /** @type {any} */
    modelInput;

    /** @type {KitComponent} */
    parent;

    /** @type {string} */
    modelRef;

    /** @type {string} */
    itemRef;

    /** @type {string} */
    itemIndexRef;

    /** @type {string} */
    indexRef;

    /** @type {number} */
    index;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/** Facilitates the mapping of document elements to Javascript component models */
export class KitComponent {

    /**
     * Creates a new instance of KitComponent based on the provided options.   
     * Auto-generates a value for the componentId property.
     * @constructor
     * @param {KitComponentOptions} options 
     */
    constructor(options) {
        if (KitComponent.#nextId > Number.MAX_SAFE_INTEGER * 0.9) {
            KitComponent.#nextId = 0;
        }
        KitComponent.#nextId++;
        this.id = KitComponent.#nextId;
        this.componentType = options.componentType ?? KitComponentType.Component;
        if (options.template) {
            options.template = options.template.replace(/<!--.*?-->/sg, ""); // remove comments
        }
        this.template = options.template;
        this.hasTemplatePath = options.hasTemplatePath;
        this.model = KitComponent.#getModel(options);
        this.modelInput = options.modelInput;
        this.parent = options.parent;
        KitComponent.#validateRef(options.modelRef, this);
        this.modelRef = options.modelRef;
        KitComponent.#validateRef(options.itemRef, this);
        this.itemRef = options.itemRef;
        KitComponent.#validateRef(options.itemIndexRef, this);
        this.itemIndexRef = options.itemIndexRef;
        KitComponent.#validateRef(options.indexRef, this);
        this.indexRef = options.indexRef;
        this.index = options.index;
        this.rendered = false;
        this.children = [];
        this.#eventListeners = {};
    }

    /** @type {string}  */
    static OnRenderCompleteEvent = "OnRenderCompleteEvent";

    onRenderStart() {
        this.rendered = false;
        if (this.model && typeof this.model.onRenderStart === "function") {
            if (this.model.onRenderStart.constructor.name !== "AsyncFunction") {
                const modelName = this.model.constructor.name;
                const msg = `onRenderStart(componentId, modelInput) function must be async. model: ${modelName}, component id: ${this.id}`;
                throw new Error(msg);
            }
            this.model.onRenderStart(this.id, this.modelInput);
        }
    }

    onRenderComplete() {
        this.#updateRenderState();
    }

    onChildRenderComplete() {
        this.#updateRenderState();
    }

    #updateRenderState() {
        if (!this.rendered && this.children.every(child => child.rendered)) {
            this.rendered = true;
            if (this.model && typeof this.model.onRenderComplete === "function") {
                if (this.model.onRenderComplete.constructor.name !== "AsyncFunction") {
                    const modelName = this.model.constructor.name;
                    const msg = `onRenderComplete() function must be async. model: ${modelName}, component id: ${this.id}`;
                    throw new Error(msg);
                }
                this.model.onRenderComplete();
            }
            const listeners = this.#getListeners(KitComponent.OnRenderCompleteEvent);
            for (const listener of listeners) {
                if (!listener) {
                    throw new Error(`Required listener function not provided.  Event: ${KitComponent.OnRenderCompleteEvent}`);
                }
                if (typeof listener != "function") {
                    throw new Error(`Listener must be a function.  Event: ${KitComponent.OnRenderCompleteEvent}`);
                }
                if (listener.constructor.name !== "AsyncFunction") {
                    throw new Error(`Listener "${listener.name}" must be an async function`);
                }
                listener();
            }
            if (this.parent) {
                this.parent.onChildRenderComplete();
            }
        }
    }

    /**
     * Finds a KitComponent in the global components array by id
     * @param {number} id - The id of the KitComponent
     * @returns {KitComponent}
     */
    static find(id) {
        return KitComponent.#components.find(c => c.id === Number(id));
    }

    /**
     * Adds a KitComponent to the global components array
     * @param {KitComponent} component - The KitComponent to add
     */
    static add(component) {
        KitComponent.#components.push(component);
    }

    /**
     * Removes a KitComponent from the global components array
     * @param {number} id - The id of the KitComponent to be removed
     */
    static remove(id) {
        const index = KitComponent.#components.map(c => c.id).indexOf(Number(id));
        if (index > -1) {
            KitComponent.#components.splice(index, 1);
        }
    }

    /** @type {KitComponent[]} */
    static #components = [];

    /** @type {number} */
    static #nextId = 0;

    /**
     * Gets the model for a KitComponent
     * @param {KitComponentOptions} options - The options for the KitComponent
     * @returns {any}
     */
    static #getModel(options) {
        let model = options.model;
        const componentType = options.componentType ?? KitComponentType.Component;
        if (componentType === KitComponentType.ConditionalComponent) {
            if (model) {
                model = true;
            }
            else {
                model = false;
            }
        }
        if (componentType === KitComponentType.ArrayComponent) {
            if (!model) {
                model = [];
            }
            if (!Array.isArray(model)) {
                throw new Error("invalid model. array component model must be an array");
            }
        }
        return model;
    }

    /**
     * Validates a ref string for a given KitComponent
     * @param {string} ref - The ref string to validate
     * @param {KitComponent} component - The KitComponent to validate against
     */
    static #validateRef(ref, component) {
        const invalidRef = new RegExp(/\W/, "g");
        if (invalidRef.test(ref)) {
            throw new Error(`invalid ref: '${ref}'. may contain only letters, numbers, or underscores.`);
        }
        if (KitComponent.#hasRef(ref, component)) {
            throw new Error(`duplicate ref: '${ref}'. ref must be unique within the component tree.`);
        }
    }

    /**
     * Returns a boolean value indicating whether a ref is already in use
     * @param {string} ref - The ref to check
     * @param {KitComponent} component - The KitComponent to check against
     * @returns {boolean}
     */
    static #hasRef(ref, component) {
        if (ref && component) {
            if (component.modelRef === ref || component.indexRef === ref) {
                return true;
            }
            if (component.parent && !component.hasTemplatePath) {
                return KitComponent.#hasRef(ref, component.parent);
            }
        }
        return false;
    }

    /**
     * Adds a listener for events raised by this component
     * @param {string} eventName - The name of the event
     * @param {any} listener - The callback method to be called when the event is raised
     */
    addEventListener(eventName, listener) {
        const index = this.#getListeners(eventName).findIndex(l => l === listener);
        if (index < 0) {
            this.#eventListeners[eventName].push(listener);
        }
    }

    /**
     * Removes a listener for events raised by this component
     * @param {any} eventName - The name of the event
     * @param {any} listener - The callback method to be called when the event is raised
     */
    removeEventListener(eventName, listener) {
        const index = this.#getListeners(eventName).findIndex(l => l === listener);
        if (index > -1) {
            this.#eventListeners[eventName].splice(index, 1);
        }
    }

    #eventListeners;
    #getListeners(eventName) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        return this.#eventListeners[eventName];
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/** Framework class used to render component html elements */
export class KitRenderer {

    /** Renders the document body */
    static async renderDocument() {
        const appDocument = KitDependencyManager.getDocument(); 
        const options = {
            template: appDocument.body.innerHTML
        };
        const component = KitRenderer.#createComponentForElement(options, appDocument.body);
        await KitRenderer.renderComponent(component.id);
    }

    /**
     * Renders a component
     * @param {number} componentId -  The id of the component to render
     */
    static async renderComponent(componentId) {

        // remove existing child components
        const appDocument = KitDependencyManager.getDocument();
        const componentElement = appDocument.querySelector(`[${KitRenderer.#componentIdAttribute}="${componentId}"]`);
        if (!componentElement) {
            return;
        }
        let selector = `[${KitRenderer.#componentIdAttribute}]`;
        const existingChildComponentElements = [...componentElement.querySelectorAll(selector)];
        for (const childComponentElement of existingChildComponentElements) {
            KitComponent.remove(childComponentElement.getAttribute(KitRenderer.#componentIdAttribute));
        }

        // clear existing inner html content
        componentElement.innerHTML = "";

        // get template
        const component = KitComponent.find(componentId);
        component.onRenderStart();
        const temp = appDocument.createElement("temp");
        temp.innerHTML = component.template;

        // initialize child component elements
        const tags = `${KitRenderer.#ifTag}, ${KitRenderer.#arrayTag}, ${KitRenderer.#componentTag}`;
        const allChildComponentElements = [...temp.querySelectorAll(tags)];
        selector = `${KitRenderer.#ifTag} :is(${tags}), ${KitRenderer.#arrayTag} :is(${tags}), ${KitRenderer.#componentTag} :is(${tags})`;
        const nestedChildComponentElements = [...temp.querySelectorAll(selector)];
        const topChildComponentElements = allChildComponentElements.filter(e => !nestedChildComponentElements.includes(e));
        component.children = [];
        const refs = KitRenderer.#getRefs(component);
        for (const childComponentElement of topChildComponentElements) {
            let templatePath = null;
            if (childComponentElement.tagName === KitRenderer.#componentTag
                && childComponentElement.hasAttribute(KitRenderer.#templatePathAttribute)) {
                templatePath = await KitRenderer.#getAttributeValue(KitRenderer.#templatePathAttribute, childComponentElement, refs);
            }
            const options = {
                componentType: KitRenderer.#getComponentType(childComponentElement),
                template: await KitRenderer.#getTemplate(childComponentElement, templatePath),
                hasTemplatePath: templatePath ? true : false,
                model: await KitRenderer.#getModel(childComponentElement, refs),
                modelInput: await KitRenderer.#getModelInput(childComponentElement, refs),
                parent: component,
                modelRef: await KitRenderer.#getModelRef(childComponentElement, refs),
                itemRef: await KitRenderer.#getItemRef(childComponentElement, refs),
                itemIndexRef: await KitRenderer.#getItemIndexRef(childComponentElement, refs)
            };
            const childComponent = KitRenderer.#createComponentForElement(options, childComponentElement);
            childComponentElement.innerHTML = "";
            component.children.push(childComponent);
        }

        // set inner html content
        componentElement.innerHTML = await KitRenderer.#resolveModelRefs(temp.innerHTML, refs);

        // resolve wrapped attributes
        await KitRenderer.#addAttributes(componentElement, refs);

        // mark component as rendered
        component.onRenderComplete();

        // render child components
        for (const childComponent of component.children) {
            switch (childComponent.componentType) {
            case KitComponentType.ConditionalComponent:
                if (childComponent.model) {
                    KitRenderer.renderComponent(childComponent.id);
                }
                else {
                    childComponent.onRenderComplete();
                }
                break;
            case KitComponentType.ArrayComponent:
                childComponent.children = [];
                let itemIndex = 0;
                for (const arrayItem of childComponent.model) {
                    const options = {
                        template: childComponent.template,
                        hasTemplatePath: false,
                        model: arrayItem,
                        parent: childComponent,
                        modelRef: childComponent.itemRef,
                        indexRef: childComponent.itemIndexRef,
                        index: itemIndex
                    };
                    const arrayItemElement = appDocument.createElement(KitRenderer.#componentTag);
                    const arrayItemComponent = KitRenderer.#createComponentForElement(options, arrayItemElement);
                    childComponent.children.push(arrayItemComponent);
                    arrayItemElement.setAttribute(
                        KitRenderer.#modelAttribute, `window.kitComponentManager.findComponent(${childComponent.id}).model[${itemIndex}]`);
                    arrayItemElement.setAttribute(
                        KitRenderer.#modelRefAttribute, childComponent.itemRef);
                    const childComponentElement = appDocument.querySelector(`[${KitRenderer.#componentIdAttribute}="${childComponent.id}"]`);
                    if (childComponentElement) {
                        childComponentElement.append(arrayItemElement);
                    }
                    itemIndex++;
                }
                childComponent.onRenderComplete();
                for (const arrayItemComponent of childComponent.children) {
                    KitRenderer.renderComponent(arrayItemComponent.id);
                }
                break;
            default:
                KitRenderer.renderComponent(childComponent.id);
            }
        }
    }
 
    /**
     * Gets the element associated with a component
     * @param {number} componentId - The id of the component
     * @returns {HTMLElement}
     */
    static getComponentElement(componentId) {
        const appDocument = KitDependencyManager.getDocument();
        return appDocument.querySelector(`[${KitRenderer.#componentIdAttribute}="${componentId}"]`);
    }

    /** @type {string}  */
    static #ifTag = "KIT-IF";

    /** @type {string}  */
    static #arrayTag = "KIT-ARRAY";

    /** @type {string}  */
    static #componentTag = "KIT-COMPONENT";

    /** @type {string}  */
    static #componentIdAttribute = "data-kit-component-id";

    /** @type {string} */
    static #addAttributesAttribute = "data-kit-add-attributes";

    /** @type {string}  */
    static #conditionAttribute = "data-kit-condition";

    /** @type {string}  */
    static #arrayAttribute = "data-kit-array";

    /** @type {string}  */
    static #arrayRefAttribute = "data-kit-array-ref";

    /** @type {string}  */
    static #itemRefAttribute = "data-kit-item-ref";

    /** @type {string}  */
    static #itemIndexRefAttribute = "data-kit-item-index-ref";

    /** @type {string}  */
    static #modelAttribute = "data-kit-model";

    /** @type {string}  */
    static #modelRefAttribute = "data-kit-model-ref";

    /** @type {string}  */
    static #modelInputAttribute = "data-kit-model-input";

    /** @type {string}  */
    static #templatePathAttribute = "data-kit-template-path";

    /** @type {{path: string, template: string}[]} */
    static #templateCache = [];

    /**
     * Creates a new KitComponent for an element
     * @param {KitComponentOptions} options - the options for creating the KitComponent
     * @param {HTMLElement} element - the element to be associated the new KitComponent
     * @returns {KitComponent}
     */
    static #createComponentForElement(options, element) {
        const component = new KitComponent(options);
        KitComponent.add(component);
        element.setAttribute(KitRenderer.#componentIdAttribute, component.id);
        return component;
    }

    /**
     * Gets the KitComponentType for an element
     * @param {HTMLElement} element - the element to evaluate
     * @returns {KitComponentType}
     */
    static #getComponentType(element) {
        if (element.tagName == KitRenderer.#ifTag) {
            return KitComponentType.ConditionalComponent;
        }
        if (element.tagName == KitRenderer.#arrayTag) {
            return KitComponentType.ArrayComponent;
        }
        return KitComponentType.Component;
    }

    /**
     * Gets the html template associated for an element
     * @param {HTMLElement} element - the element to evaluate
     * @param {string} templatePath - the resource path to the template (element inner html used when not provided)
     * @returns {string}
     */
    static async #getTemplate(element, templatePath) {
        let template = element.innerHTML;
        if (templatePath) {
            template = await KitRenderer.#getTemplateFromPath(templatePath);
        }
        if (template) {
            template = template.replace(/<!--.*?-->/sg, ""); // remove comments
        }
        return template;
    }

    /**
     * Gets the html template from the provided resource path
     * @param {string} path - the resource path
     * @returns {string}
     */
    static async #getTemplateFromPath(path) {
        const matches = KitRenderer.#templateCache.filter(t => t.path == path);
        if (matches && matches.length > 0) {
            return matches[0].template;
        }
        const resourceManager = KitDependencyManager.getResourceManager();
        const response = await resourceManager.fetch(path, { cache: "no-cache" });
        let template = await response.text();
        if (template) {
            KitRenderer.#templateCache.push({ path: path, template: template });
        }
        else {
            throw new Error(`template not found at path: ${path}`);
        }
        return template;
    }

    /**
     * Gets the component model associated with the provided element
     * @param {HTMLElement} element - the element to be evaluated
     * @param {string[]} refs - the parent component references
     * @returns {any}
     */
    static async #getModel(element, refs) {

        // get model from markup
        let hasAttribute = false;
        let attributeValue = null;
        if (element.tagName === KitRenderer.#ifTag && element.hasAttribute(KitRenderer.#conditionAttribute)) {
            hasAttribute = true;
            attributeValue = element.getAttribute(KitRenderer.#conditionAttribute);
        }
        if (element.tagName === KitRenderer.#arrayTag && element.hasAttribute(KitRenderer.#arrayAttribute)) {
            hasAttribute = true;
            attributeValue = element.getAttribute(KitRenderer.#arrayAttribute);
        }
        if (element.tagName === KitRenderer.#componentTag && element.hasAttribute(KitRenderer.#modelAttribute)) {
            hasAttribute = true;
            attributeValue = element.getAttribute(KitRenderer.#modelAttribute);
        }
        if (hasAttribute) {
            const result = await KitRenderer.#resolveModelRefs(attributeValue, refs);
            return await KitRenderer.#evaluateString(result);
        }

        // get model from path
        if (element.tagName === KitRenderer.#componentTag && element.hasAttribute(KitRenderer.#templatePathAttribute)) {
            const templatePath = await KitRenderer.#getAttributeValue(KitRenderer.#templatePathAttribute, element, refs);
            const modulePath = templatePath.replace(".html", ".js");
            return await KitRenderer.#getModelFromPath(modulePath);
        }
        return null;
    }

    /**
     * Gets the component model from the provided module resource path
     * @param {string} modulePath - the resource path to the model module
     * @returns {any}
     */
    static async #getModelFromPath(modulePath) {
        let model = null;
        const resourceManager = KitDependencyManager.getResourceManager();
        const module = await resourceManager.import(modulePath);
        if (module) {
            if (typeof module.createModel !== "function") {
                throw new Error(`missing required function export 'createModel()'. modulePath: ${modulePath}`);
            }
            model = module.createModel();
            if (!model) {
                throw new Error(`function createModel() did not return a model object. modulePath: ${modulePath}`);
            }
        }
        return model;
    }

    /**
     * Gets model input associated with the provided element
     * @param {HTMLElement} element - the element to be evaluated
     * @param {string[]} refs - the parent component refs of the element's component
     * @returns {any}
     */
    static async #getModelInput(element, refs) {
        if (element.tagName === KitRenderer.#componentTag && element.hasAttribute(KitRenderer.#modelInputAttribute)) {
            const result = await KitRenderer.#getAttributeValue(KitRenderer.#modelInputAttribute, element, refs);
            return await KitRenderer.#evaluateString(result);
        }
        return null;
    }

    /**
     * Gets the string value used to refer to the element's model
     * @param {HTMLElement} element - the element to be evaluated
     * @param {string[]} refs - the parent component refs of the element's component
     * @returns {string}
     */
    static async #getModelRef(element, refs) {
        if (element.tagName === KitRenderer.#arrayTag && element.hasAttribute(KitRenderer.#arrayRefAttribute)) {
            return await KitRenderer.#getAttributeValue(KitRenderer.#arrayRefAttribute, element, refs);
        }
        if (element.tagName === KitRenderer.#componentTag) {
            if (element.hasAttribute(KitRenderer.#modelRefAttribute)) {
                return await KitRenderer.#getAttributeValue(KitRenderer.#modelRefAttribute, element, refs);
            }
            if (element.hasAttribute(KitRenderer.#templatePathAttribute)) {
                return "model";
            }
        }
        return null;
    }

    /**
     * Gets the string value used to refer to an item in an array
     * @param {HTMLElement} element - the element to be evaluated
     * @param {string[]} refs - the parent component refs of the element's component
     * @returns {string}
     */
    static async #getItemRef(element, refs) {
        if (element.tagName === KitRenderer.#arrayTag && element.hasAttribute(KitRenderer.#itemRefAttribute)) {
            return await KitRenderer.#getAttributeValue(KitRenderer.#itemRefAttribute, element, refs);
        }
        return null;
    }

    /**
     * Gets the string value used to refer to the index of an array item
     * @param {HTMLElement} element - the element to be evaluated
     * @param {string[]} refs - the parent component refs of the element's component
     * @returns {string}
     */
    static async #getItemIndexRef(element, refs) {
        if (element.tagName === KitRenderer.#arrayTag && element.hasAttribute(KitRenderer.#itemIndexRefAttribute)) {
            return await KitRenderer.#getAttributeValue(KitRenderer.#itemIndexRefAttribute, element, refs);
        }
        return null;
    }

    /**
     * Resolves model references and evaluation instructions in a string
     * @param {string} input - the string to be evaluated
     * @param {string[]} refs - the list of component references
     * @returns {string}
     */
    static async #resolveModelRefs(input, refs) {

        if (!input) {
            return input;
        }

        const escapeToken = "a07118ed-51f3-4d7e-9d44-ad632b102770";
        let output = input;

        // resolve model references (i.e. #model ...)
        if (refs) {
            for (const item of refs) {

                // process escapes
                let findString = `\\#${item.ref}`;
                if (output.includes(findString)) {
                    output = output.replaceAll(findString, `escape-${escapeToken}-escape`);
                }
                // get model references
                findString = `#${item.ref}`;
                if (output.includes(findString)) {
                    const id = item.component.id;
                    if (item.isIndexRef) {
                        output = output.replaceAll(findString, `window.kitComponentManager.findComponent(${id})?.index`);
                    }
                    else {
                        output = output.replaceAll(findString, `window.kitComponentManager.findComponent(${id})?.model`);
                    }
                }
                // revert escapes
                findString = `escape-${escapeToken}-escape`;
                if (output.includes(findString)) {
                    output = output.replaceAll(findString, `#${item.ref}`);
                }
            }
        }

        // resolve evaluation instructions (i.e. %{ ... }%})
        // process escapes
        let findString = "\\%{";
        if (output.includes(findString)) {
            output = output.replaceAll(findString, `start-${escapeToken}-start`);
        }
        findString = "\\}%";
        if (output.includes(findString)) {
            output = output.replaceAll(findString, `end-${escapeToken}-end`);
        }
        // evaluate
        const regex = new RegExp(/(?<=%\{).*?(?=\}%)/, "g"); // characters between %{ and }%
        const matches = [...output.matchAll(regex)];
        if (matches && matches.length > 0) {
            for (const match of matches) {
                const result = await KitRenderer.#evaluateString(match[0]);
                output = output.replaceAll(`%{${match[0]}}%`, result);
            }
        }
        // revert escapes
        findString = `start-${escapeToken}-start`;
        if (output.includes(findString)) {
            output = output.replaceAll(findString, "%{");
        }
        findString = `end-${escapeToken}-end`;
        if (output.includes(findString)) {
            output = output.replaceAll(findString, "}%");
        }

        return output;
    }

    /**
     * Gets an array of model reference strings for a component, sorted longest first
     * @param {KitComponent} component
     * @returns {string[]}
     */
    static #getRefs(component) {

        function addRef(component, refs) {
            if (component.modelRef) {
                refs.push({ ref: component.modelRef, isIndexRef: false, component: component });
            }
            if (component.indexRef) {
                refs.push({ ref: component.indexRef, isIndexRef: true, component: component });
            }
            if (component.parent && !component.hasTemplatePath) {
                // recurse
                addRef(component.parent, refs);
            }
        }

        const refs = [];
        if (component) {
            addRef(component, refs);
        }
        refs.sort((a, b) => b.ref.length - a.ref.length); // longest first
        return refs;
    }

    /**
     * Searches the provided element and descendants for elements having attribute "data-kit-add-attributes"
     * containing a comma separated list of attribute name value pairs and adds the specified attributes (if any)
     * example: data-kit-add-attributes="attribute1=value1, attribute2=value2" results in attribute1="value1" attribute2="value2"
     * attribute values containing commas or equal signs must be escaped with a backslash
     * example: data-kit-add-attributes="attribute1=1\,2\,3, attribute2=value2" results in attribute1="1,2,3" attribute2="value2"
     * @param {HTMLElement} element - The element to search
     * @param {string[]} refs - the parent component refs of the element's component
     */
    static async #addAttributes(element, refs) {
        const escapeComma = "74969BBD-E28B-401D-B204-3FC44711F41C";
        const escapeEqualsSign = "E89ABBB0-F57A-4E26-8FC8-23E871C9006E";
        const elementsWithAttributesToAdd = element.querySelectorAll(`[${KitRenderer.#addAttributesAttribute}]`);
        if (elementsWithAttributesToAdd) {
            for (const elementWithAttributesToAdd of elementsWithAttributesToAdd) {
                let serialAttributes = await KitRenderer.#getAttributeValue(KitRenderer.#addAttributesAttribute, elementWithAttributesToAdd, refs);
                if (serialAttributes) {
                    serialAttributes = serialAttributes.replaceAll("\\,", escapeComma).replaceAll("\\=", escapeEqualsSign);
                    const attributes = serialAttributes.split(",");
                    for (const attributeSerial of attributes) {
                        const parts = attributeSerial.split("=");
                        let attributeName = parts[0];
                        if (attributeName) {
                            attributeName = attributeName.trim();
                        }
                        if (attributeName) {
                            if (parts.length == 1) {
                                elementWithAttributesToAdd.setAttribute(attributeName, "");
                            }
                            if (parts.length == 2) {
                                let attributeValue = parts[1];
                                if (attributeValue) {
                                    attributeValue = attributeValue.trim().replaceAll(escapeComma, ",").replaceAll(escapeEqualsSign, "=");
                                }
                                elementWithAttributesToAdd.setAttribute(attributeName, attributeValue);
                            }
                        }
                    }
                }
                elementWithAttributesToAdd.removeAttribute(KitRenderer.#addAttributesAttribute);
            }
        }
    }

    /**
     * Returns the attribute value for the specified attribute name and element and after resolving any component model references
     * @param {string} attributeName - the name of the attribute
     * @param {HTMLElement} element - the element to search
     * @param {string[]} refs - the component references
     * @returns {string}
     */
    static async #getAttributeValue(attributeName, element, refs) {
        if (element.hasAttribute(attributeName)) {
            const attributeValue = element.getAttribute(attributeName);
            return await KitRenderer.#resolveModelRefs(attributeValue, refs);
        }
        return null;
    }

    ///**
    // * Evaluates a javascript string
    // * @param {string} input - The javascript to be evaluated
    // * @returns {any}
    // */
    static async #evaluateString(input) {
        let result = null;
        if (input) {
            eval(`(async () => { result = ${input}; })();`);
        }
        return await result;
    } 
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/** Framework class used to initialize a UI-KIT application */
export class KitStartup {

    /** Initializes the application.  This method is called when the browser "DOMContentLoaded" event fires. */
    static async initialize() {

        // browser dependencies
        KitDependencyManager.setWindow(window);
        KitDependencyManager.setDocument(document);
        KitDependencyManager.setConsole(console);
        KitDependencyManager.setResourceManager(new KitResourceManager());

        // navigator
        await KitNavigator.initialize();

        // component manager
        window.kitComponentManager = {

            /**
                * Finds a registered KitComponent by id
                * @param {number} id
                * @returns {Component}
                */
            findComponent(id) {
                return KitComponent.find(id);
            }
        };

        // render document
        await KitRenderer.renderDocument();
    }

}
if (globalThis.document) {
    document.addEventListener("DOMContentLoaded", async () => { await KitStartup.initialize() });
}
