import {
    assign
} from 'min-dash';
import inherits from 'inherits';
import BaseElementFactory from 'diagram-js/lib/core/ElementFactory';

export default function OlcElementFactory(moddle) {
    BaseElementFactory.call(this);
    this._moddle = moddle;
}

inherits(OlcElementFactory, BaseElementFactory);

OlcElementFactory.$inject = ['moddle'];

OlcElementFactory.prototype.createBusinessObject = function (type, attrs) {
    return this._moddle.create(type, attrs || {});
};

OlcElementFactory.prototype.baseCreate = BaseElementFactory.prototype.create;
OlcElementFactory.prototype.baseCreateShape = BaseElementFactory.prototype.createShape;

OlcElementFactory.prototype.createShape = function(attrs) {
    attrs = assign(defaultSizeForType(attrs.type), attrs);
    return this.baseCreateShape(attrs);
}

OlcElementFactory.prototype.create = function (elementType, attrs) {

    attrs = attrs || {};

    var businessObject = attrs.businessObject;

    if (!businessObject) {
        if (!attrs.type) {
            throw new Error('no shape type specified');
        }
        businessObject = this.createBusinessObject(attrs.type, attrs);
    }

    attrs = assign({
        businessObject: businessObject,
        id: businessObject.id,
        size: defaultSizeForType(attrs.type)
    }, attrs);

    return this.baseCreate(elementType, attrs);
};

function defaultSizeForType(type) {
    return { width: 60, height: 60 };
}