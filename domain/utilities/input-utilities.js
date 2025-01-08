﻿
export class InputUtilities {

    // methods
    cleanseString(stringIn) {
        let stringOut = stringIn;
        if (stringOut) {
            stringOut = stringOut
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("'", "&#39")
                .replaceAll('"', "&quot;");
        }
        return stringOut;
    }

    cleanseBoolean(boolean) {
        return boolean ? true : false;
    }

    cleanseNumber(number) {
        return isNaN(number) ? null : number;
    }

    cleansePoint(point) {
        if (!point) {
            return null;
        }
        return {
            x: this.cleanseNumber(point.x),
            y: this.cleanseNumber(point.y)
        }
    }

    cleanseBounds(bounds) {
        if (!bounds) {
            return null;
        }
        return {
            x: this.cleanseNumber(bounds.x),
            y: this.cleanseNumber(bounds.y),
            width: this.cleanseNumber(bounds.width),
            height: this.cleanseNumber(bounds.height),
        }
    }

    cleanseSvg(svg, domParser, domSerializer) {
        if (!svg) {
            return null;
        }
        const docIn = domParser.parseFromString(svg, "application/xml");
        const docOut = domParser.parseFromString("<root/>", "application/xml");
        InputUtilities.#processSvgSrcNode(docOut, docOut.documentElement, docIn.documentElement);
        if (docOut.documentElement.children.length > 0) {
            return domSerializer.serializeToString(docOut.documentElement.children[0]);
        }
        return null;
    }

    // helpers
    static #allowedSvgTags = [
        "a", "animate", "animateMotion", "animateTransform", "circle",
        "clipPath", "defs", "desc", "ellipse", "feBlend",
        "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting",
        "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA",
        "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage",
        "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight",
        "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter",
        "foreignObject", "g", "image", "line", "linearGradient",
        "marker", "mask", "metadata", "mpath", "path",
        "pattern", "polygon", "polyline", "radialGradient", "rect",
        "script", "set", "stop", "style", "svg",
        "switch", "symbol", "text", "textPath", "title",
        "tspan", "use", "view"
    ];

    static #allowedSvgAttributes = [
        "accumulate", "additive", "alignment-baseline", "amplitude", "attributeName",
        "azimuth", "baseFrequency", "baseline-shift", "begin", "bias",
        "by", "calcMode", "class", "clip-path", "clip-rule",
        "clipPathUnits", "color", "color-interpolation", "color-interpolation-filters", "cursor",
        "cx", "cy", "d", "decoding", "diffuseConstant",
        "direction", "display", "divisor", "dominant-baseline", "dur",
        "dx", "dy", "edgeMode", "elevation", "end",
        "exponent", "fill", "fill-opacity", "fill-rule", "filter",
        "filterUnits", "flood-color", "flood-opacity", "font-family", "font-size",
        "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight",
        "fr", "from", "fx", "fy", "gradientTransform",
        "gradientUnits", "height", "href", "id", "image-rendering",
        "in", "in2", "intercept", "k1", "k2",
        "k3", "k4", "kernelMatrix", "kernelUnitLength", "keyPoints",
        "keySplines", "keyTimes", "lang", "lengthAdjust", "letter-spacing",
        "lighting-color", "limitingConeAngle", "marker-end", "marker-mid", "marker-start",
        "markerHeight", "markerUnits", "markerWidth", "mask", "maskContentUnits",
        "maskUnits", "max", "media", "min", "mode",
        "numOctaves", "opacity", "operator", "order", "orient",
        "origin", "overflow", "overline-position", "overline-thickness", "paint-order",
        "path", "pathLength", "patternContentUnits", "patternTransform", "patternUnits",
        "pointer-events", "points", "pointsAtX", "pointsAtY", "pointsAtZ",
        "preserveAlpha", "preserveAspectRatio", "primitiveUnits", "r", "radius",
        "refX", "refY", "repeatCount", "repeatDur", "restart",
        "result", "rx", "ry", "scale", "seed",
        "shape-rendering", "slope", "spacing", "specularConstant", "specularExponent",
        "spreadMethod", "startOffset", "stdDeviation", "stitchTiles", "stop-color",
        "stop-opacity", "strikethrough-position", "strikethrough-thickness", "stroke", "stroke-dasharray",
        "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity",
        "stroke-width", "style", "surfaceScale", "systemLanguage", "tabindex",
        "tableValues", "target", "targetX", "targetY", "text-anchor",
        "text-decoration", "text-rendering", "textLength", "to", "transform",
        "transform-origin", "type", "underline-position", "underline-thickness", "unicode-bidi",
        "values", "vector-effect", "viewBox", "visibility", "width",
        "word-spacing", "writing-mode", "x", "x1", "x2",
        "xChannelSelector", "y", "y1", "y2", "yChannelSelector",
        "z"
    ];

    static #processSvgSrcNode(docOut, parentElement, node) {
        switch (node.nodeType) {
            case 1: // element
                if (InputUtilities.#allowedSvgTags.some(t => t.toLowerCase() == node.tagName.toLowerCase())) {
                    const newElement = docOut.importNode(node, false);
                    parentElement.appendChild(newElement);
                    for (const childNode of node.childNodes) {
                        InputUtilities.#processSvgSrcNode(docOut, newElement, childNode);
                    }
                }
                break;
            case 2: // attribute
                if (InputUtilities.#allowedSvgAttributes.some(a => a.toLowerCase() == node.name.toLowerCase())) {
                    parentElement.setAttribute(node.name, Tool.cleanseString(node.value));
                }
                break;
            case 3: // text
                parentElement.text = Tool.cleanseString(text);
                break;
        }
    }

}
