import { Component, Event, EventEmitter, h, Method, Prop, State } from '@stencil/core';
import Moveable from "../../libs/Moveable";
import { parseToHSVA } from "../../utils/Color";
import { HSVaColor } from "../../utils/HSVaColor";

@Component({
  tag: 'color-palette',
  styleUrl: 'color-palette.css',
  shadow: true,
})
export class ColorPalette {

  private palette: HTMLDivElement;
  private slider: HTMLDivElement;
  private currentColor: HSVaColor;

  @State() sliderOffsetWidth: number = 8;
  @State() sliderOffsetHeight: number = 8;
  @State() sliderLeft: number = 50;
  @State() sliderTop: number = 50;
  @State() paletteBackgroundStyle: string;

  /**
   * The color that is being displayed. This currently *MUST* be in 6 digit hex format.
   */
  @Prop() color: string;

  private static getPaletteBackgroundColor(hue) {
    return `
    linear-gradient(to top, rgba(0, 0, 0, 1), transparent),
    linear-gradient(to left, hsla(${ hue }, 100%, 50%, 1),
    rgba(255, 255, 255, 1))
    `;
  }

  /**
   * Emitted during dragging and when the color changes
   */
  @Event() colorPaletteChange: EventEmitter<HSVaColor>
  private handleChange = event => {
    const { x, y } = event.detail;
    // Calculate saturation based on the position
    const saturation = x * 100;

    // Calculate the value
    let value = 100 - y * 100;

    // Prevent falling under zero
    value < 0 ? (value = 0) : 0;

    this.currentColor.saturation = saturation;
    this.currentColor.value = value;

    this.slider.style.background = this.currentColor.toRGB().toString();
    this.colorPaletteChange.emit(this.currentColor);
  }

  componentWillLoad() {
    this.setInternalColor(this.color);

    return new Promise<void>(resolve => {
      if (this.slider !== null && this.slider !== undefined) {
        const offsetWidth = this.slider.offsetWidth;
        const offsetHeight = this.slider.offsetHeight;
        if (!isNaN(offsetWidth)) {
          this.sliderOffsetWidth = offsetWidth / 2;
        }
        if (!isNaN(offsetHeight)) {
          this.sliderOffsetHeight = this.slider.offsetHeight / 2;
        }
      }
      resolve();
    });
  }

  componentDidLoad() {
    new Moveable({
      element: this.slider,
      wrapper: this.palette,
    });
  }

  /**
   * Set the hue ONLY on color palette
   * @param hue
   */
  @Method()
  async setHue(hue: number) {
    this.currentColor.hue = hue;
    this.paletteBackgroundStyle = ColorPalette.getPaletteBackgroundColor(this.currentColor.hue);
    this.colorPaletteChange.emit(this.currentColor);
  }

  /**
   * Sets the color. Must pass through a hex value
   * @param {string} color
   */
  @Method()
  async setColor(color: string) {
    this.setInternalColor(color);
  }

  private setInternalColor(color) {
    this.currentColor = new HSVaColor(...parseToHSVA(color).values);
    this.sliderLeft = this.currentColor.saturation;
    this.sliderTop = 100 - this.currentColor.value;
    this.paletteBackgroundStyle = ColorPalette.getPaletteBackgroundColor(this.currentColor.hue);
  }

  render() {
    return (
      <div class={ 'color-selector' }
           ref={ el => this.palette = el as HTMLDivElement }
           style={ {
             background: this.paletteBackgroundStyle
           } }
      >
        <div class={ 'selector__pickr' } style={ {
          'left': `calc(${ this.sliderLeft }% - ${ this.sliderOffsetWidth }px)`,
          'top': `calc(${ this.sliderTop }% - ${ this.sliderOffsetHeight }px)`,
          'background': this.currentColor.toRGB().toString()
        } }
             onChange={ this.handleChange }
             ref={ el => this.slider = el as HTMLDivElement } />
      </div>
    );
  }

}
