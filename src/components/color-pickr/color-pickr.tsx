import { Component, Host, h, Prop, State, Listen, Event, EventEmitter } from '@stencil/core';
import { HSVaColor } from "../../utils/HSVaColor";
import { alphaToHex, isValidHex, parseToHSVA } from "../../utils/Color";
import { numberAsPercent } from "../../utils/Number";

@Component({
  tag: 'color-pickr',
  styleUrl: 'color-pickr.css',
  shadow: true,
})
export class ColorPickr {

  private currentColor: HSVaColor;
  private palettesToDisplay: Array<any> = [];

  @State() colorHex: string;
  @State() currentOpacity: number;

  /**
   * The color that is being displayed. This currently **MUST** be in 6 digit hex format
   */
  @Prop() color: string;
  /**
   * The starting opacity value form 0 - 100.
   */
  @Prop() opacity: number;

  /**
   * A JSON formatted string of palettes, or an Array if being passed through programmatically.
   * Example of format:
   */
  @Prop() palettes: string | Array<any>;

  /**
   * Emitted when a color or the opacity is changed
   */
  @Event() colorChange: EventEmitter<HSVaColor>

  /**
   * Emitted when a preset color palette has been chosen
   */
  @Event() presetPaletteChange: EventEmitter<HSVaColor>

  componentWillLoad() {
    const color = this.color ?? '#7CA1FF';
    const opacity = this.opacity ?? 100;
    const alphaHex = alphaToHex(opacity / 100);
    this.setColor(color + alphaHex);
    this.currentOpacity = numberAsPercent(this.currentColor.alpha);

    let palettes = this.palettes;
    if (typeof this.palettes === 'string') {
      try {
        palettes = JSON.parse(this.palettes);
      } catch {
        palettes = [];
      }
    }

    if (palettes === undefined) {
      palettes = [];
    }
    if (!Array.isArray(palettes)) {
      palettes = [palettes];
    }
    this.palettesToDisplay = palettes;
  }

  @Listen('opacityChange')
  opacityChangeHandler(event: CustomEvent<string>) {
    this.currentOpacity = numberAsPercent(event.detail);
    this.currentColor.alpha = this.currentOpacity;
    this.setColor(this.currentColor.toHEXA().toString());
  }

  @Listen('colorPaletteChange')
  colorPaletteChangeHandler(event: CustomEvent<HSVaColor>) {
    this.setColor(event.detail.toHEXA().toString());
  }

  private handleOpacityInput = event => {
    const opacityValue = isNaN(event.target.value) ? 0 : event.target.value;
    this.currentOpacity = Math.max(Math.min(opacityValue, 100), 0);
    this.setColor(this.currentColor.toHEXA().toString());

  }

  private setPresetPalette = event => {
    this.setColor(event.target.dataset.color);
    this.currentOpacity = numberAsPercent(this.currentColor.alpha);
    this.presetPaletteChange.emit(this.currentColor.clone());
  }

  private handleHexInput = event => {
    const hexValue = event.target.value;
    const hex = hexValue.startsWith('#') ? hexValue : `#${ hexValue }`;
    if (isValidHex(hex)) {
      this.setColor(hex);
    }
  }

  private setColor(color) {
    this.currentColor = new HSVaColor(...parseToHSVA(color).values);
    this.colorHex = this.currentColor.toHEX().toString();

    this.colorChange.emit(this.currentColor.clone());
  }

  private renderOpacityInput(): HTMLDivElement {
    if (this.opacity !== undefined || this.color.length > 7) {
      return (
        <div class={ 'input-container' }
             style={ {
               flexBasis: '70px'
             } }>
          <input type="text" value={ `${ this.currentOpacity }` } onInput={ this.handleOpacityInput } />
          <div class={ 'input-label' }>%</div>
        </div>
      );
    }
  }

  render() {
    return (
      <Host>
        <div class={ 'container' }>
          <color-palette color={ this.colorHex } />

          <hue-slider color={ this.colorHex } />

          {
            this.opacity !== undefined || this.color.length > 7
              ? <opacity-slider color={ this.colorHex } opacity={ this.currentOpacity } />
              : ''
          }

          <div style={ {
            width: '228px',
            display: 'flex',
            gap: '12px',
            marginTop: '16px',
          } }>
            <div class={ 'input-container' }>
              <input type="text" maxlength={ 7 } value={ this.colorHex } onInput={ this.handleHexInput } />
              <div class={ 'input-label' }>Hex</div>
            </div>

            { this.renderOpacityInput() }
          </div>

          <div>
            { this.palettesToDisplay.map(({ label, palettes }) => {
              return (
                <div>
                  <h3 class={ 'palettes-header' }>{ label }</h3>
                  <div class={ 'palettes-container' }>
                    { palettes.map(palette => {
                      if (isValidHex(palette)) {
                        return (
                          <div class={ {
                            'palette__container': true,
                            'palette__container--active': this.colorHex.toLowerCase() === palette.toLowerCase(),
                          } }>
                            <span class={ 'checkerboard' } />
                            <span class={ 'palette' } data-color={ palette } style={ { backgroundColor: palette } } onClick={ this.setPresetPalette } />
                          </div>
                        );
                      }
                    }) }
                  </div>
                </div>
              );
            }) }
          </div>

        </div>
      </Host>
    );
  }
}
