/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { HSVaColor } from "./utils/HSVaColor";
export namespace Components {
    interface ColorPalette {
        /**
          * The color that is being displayed. This currently *MUST* be in 6 digit hex format.
         */
        "color": string;
        /**
          * Sets the color. Must pass through a hex value
          * @param color
         */
        "setColor": (color: string) => Promise<void>;
        /**
          * Set the hue ONLY on color palette
          * @param hue
         */
        "setHue": (hue: number) => Promise<void>;
    }
    interface ColorPickr {
        /**
          * Add a single color the list of preset palettes. If the label already exists it will be added to the start. If it doesn't exist, a new section will be created.
          * @param hex
          * @param label
         */
        "addToPreset": (hex: string, label: string) => Promise<void>;
        /**
          * The color that is being displayed. This currently **MUST** be in 6 digit hex format
         */
        "color": string;
        /**
          * Max number of preset palettes to display
         */
        "maxPresetDisplay": number;
        /**
          * Whether opacity is supported on this instance.
         */
        "opacity": boolean;
        /**
          * A JSON formatted string of palettes, or an Array if being passed through programmatically. Example of format:
         */
        "palettes": string | Array<any>;
        /**
          * The label that corresponds to the group of palettes for your recent colors
         */
        "recentColorsLabel": string;
    }
    interface HueSlider {
        /**
          * The color that is being displayed. This currently *MUST* be in 6 digit hex format.
         */
        "color": string;
        /**
          * Sets the hue value
          * @param hue
         */
        "setHue": (hue: number) => Promise<void>;
    }
    interface OpacitySlider {
        /**
          * The color that is being displayed. This currently *MUST* be in 6 digit hex format.
         */
        "color": string;
        /**
          * The starting opacity value form 0 - 100
         */
        "opacity": number;
        /**
          * Sets the color for the slider
          * @param color
         */
        "setColor": (color: string) => Promise<void>;
        /**
          * Sets te opacity for the slider
          * @param opacity
         */
        "setOpacity": (opacity: number) => Promise<void>;
    }
}
declare global {
    interface HTMLColorPaletteElement extends Components.ColorPalette, HTMLStencilElement {
    }
    var HTMLColorPaletteElement: {
        prototype: HTMLColorPaletteElement;
        new (): HTMLColorPaletteElement;
    };
    interface HTMLColorPickrElement extends Components.ColorPickr, HTMLStencilElement {
    }
    var HTMLColorPickrElement: {
        prototype: HTMLColorPickrElement;
        new (): HTMLColorPickrElement;
    };
    interface HTMLHueSliderElement extends Components.HueSlider, HTMLStencilElement {
    }
    var HTMLHueSliderElement: {
        prototype: HTMLHueSliderElement;
        new (): HTMLHueSliderElement;
    };
    interface HTMLOpacitySliderElement extends Components.OpacitySlider, HTMLStencilElement {
    }
    var HTMLOpacitySliderElement: {
        prototype: HTMLOpacitySliderElement;
        new (): HTMLOpacitySliderElement;
    };
    interface HTMLElementTagNameMap {
        "color-palette": HTMLColorPaletteElement;
        "color-pickr": HTMLColorPickrElement;
        "hue-slider": HTMLHueSliderElement;
        "opacity-slider": HTMLOpacitySliderElement;
    }
}
declare namespace LocalJSX {
    interface ColorPalette {
        /**
          * The color that is being displayed. This currently *MUST* be in 6 digit hex format.
         */
        "color"?: string;
        /**
          * Emitted during dragging and when the color changes
         */
        "onColorPaletteChange"?: (event: CustomEvent<HSVaColor>) => void;
    }
    interface ColorPickr {
        /**
          * The color that is being displayed. This currently **MUST** be in 6 digit hex format
         */
        "color"?: string;
        /**
          * Max number of preset palettes to display
         */
        "maxPresetDisplay"?: number;
        /**
          * Emitted when a color or the opacity is changed
         */
        "onColorChange"?: (event: CustomEvent<HSVaColor>) => void;
        /**
          * Whether opacity is supported on this instance.
         */
        "opacity"?: boolean;
        /**
          * A JSON formatted string of palettes, or an Array if being passed through programmatically. Example of format:
         */
        "palettes"?: string | Array<any>;
        /**
          * The label that corresponds to the group of palettes for your recent colors
         */
        "recentColorsLabel"?: string;
    }
    interface HueSlider {
        /**
          * The color that is being displayed. This currently *MUST* be in 6 digit hex format.
         */
        "color"?: string;
        /**
          * Emitted when the hue has changed. Emits only the Hue value
         */
        "onHueChange"?: (event: CustomEvent<number>) => void;
    }
    interface OpacitySlider {
        /**
          * The color that is being displayed. This currently *MUST* be in 6 digit hex format.
         */
        "color"?: string;
        /**
          * Emitted when the opacity slider has changed
         */
        "onOpacityChange"?: (event: CustomEvent<number>) => void;
        /**
          * The starting opacity value form 0 - 100
         */
        "opacity"?: number;
    }
    interface IntrinsicElements {
        "color-palette": ColorPalette;
        "color-pickr": ColorPickr;
        "hue-slider": HueSlider;
        "opacity-slider": OpacitySlider;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "color-palette": LocalJSX.ColorPalette & JSXBase.HTMLAttributes<HTMLColorPaletteElement>;
            "color-pickr": LocalJSX.ColorPickr & JSXBase.HTMLAttributes<HTMLColorPickrElement>;
            "hue-slider": LocalJSX.HueSlider & JSXBase.HTMLAttributes<HTMLHueSliderElement>;
            "opacity-slider": LocalJSX.OpacitySlider & JSXBase.HTMLAttributes<HTMLOpacitySliderElement>;
        }
    }
}
