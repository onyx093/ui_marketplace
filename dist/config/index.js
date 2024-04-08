"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductLabel = exports.PRODUCT_CATEGORIES = void 0;
exports.PRODUCT_CATEGORIES = [
    {
        label: "UI Kits",
        value: "ui_kits",
        featured: [
            {
                name: "Editor's picks",
                href: "#",
                imageSrc: "/nav/ui-kits/mixed.jpg",
            },
            {
                name: "New arrivals",
                href: "#",
                imageSrc: "/nav/ui-kits/blue.jpg",
            },
            {
                name: "Bestsellers",
                href: "#",
                imageSrc: "/nav/ui-kits/mixed.jpg",
            },
        ],
    },
    {
        label: "Icons",
        value: "icons",
        featured: [
            {
                name: "Favourite Icon Picks",
                href: "#",
                imageSrc: "/nav/icons/picks.jpg",
            },
            {
                name: "New arrivals",
                href: "#",
                imageSrc: "/nav/icons/new.jpg",
            },
            {
                name: "Bestselling Icons",
                href: "#",
                imageSrc: "/nav/icons/bestsellers.jpg",
            },
        ],
    },
];
var getProductLabel = function (product) {
    var _a;
    return (_a = exports.PRODUCT_CATEGORIES.find(function (_a) {
        var value = _a.value;
        return value === product.category;
    })) === null || _a === void 0 ? void 0 : _a.label;
};
exports.getProductLabel = getProductLabel;
