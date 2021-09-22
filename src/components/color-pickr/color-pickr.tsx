import { Component, Host, h, Prop, State, Listen, Event, EventEmitter, Method } from '@stencil/core';
import { HSVaColor } from "../../utils/HSVaColor";
import { isValidHex, parseToHSVA } from "../../utils/Color";
import { numberAsPercent } from "../../utils/Number";

@Component({
  tag: 'color-pickr',
  styleUrl: 'color-pickr.css',
  shadow: true,
})
export class ColorPickr {

  private currentColor: HSVaColor;
  private colorPalette: HTMLColorPaletteElement;
  private hueSlider: HTMLHueSliderElement;
  private opacitySlider: HTMLOpacitySliderElement;
  private hasRecentColors: boolean = false;
  // private settingInitialColor: boolean = true;

  @State() colorHex: string;
  @State() currentOpacity: number;
  @State() palettesToDisplay: Array<any> = [];

  /**
   * The color that is being displayed. This currently **MUST** be in 6 digit hex format
   */
  @Prop() color: string;
  /**
   * Whether opacity is supported on this instance.
   */
  @Prop() opacity: boolean = false;

  /**
   * A JSON formatted string of palettes, or an Array if being passed through programmatically.
   * Example of format:
   */
  @Prop() palettes: string | Array<any>;

  /**
   * Max number of preset palettes to display
   */
  @Prop() maxPresetDisplay: number = 50;

  /**
   * The label that corresponds to the group of palettes for your recent colors
   */
  @Prop() recentColorsLabel: string = 'Recent Colors';

  /**
   * Emitted when a color or the opacity is changed
   */
  @Event() colorChange: EventEmitter<HSVaColor>

  componentWillLoad() {
    const color = this.color ?? '#7CA1FF';
    this.setColor(color);
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

  @Listen('hueChange')
  hueChangeHandler(event: CustomEvent<number>) {
    this.colorPalette.setHue(event.detail);
  }

  @Listen('opacityChange')
  opacityChangeHandler(event: CustomEvent<string>) {
    this.currentOpacity = numberAsPercent(event.detail);
    this.currentColor.alpha = this.currentOpacity;
    this.setColor(this.currentColor.toHEXA().toString());
  }

  @Listen('colorPaletteChange')
  colorPaletteChangeHandler(event: CustomEvent<HSVaColor>) {
    this.opacitySlider?.setColor(event.detail.toHEXA().toString());
    event.detail.alpha = this.currentOpacity;
    this.setColor(event.detail.toHEXA().toString());
  }

  @Listen('colorPickrAddRecent', { target: "document" })
  colorPickrAddRecentHandler(event: CustomEvent<{ hex: string, pickr: ColorPickr }>) {
    if (!this.hasRecentColors) {
      return;
    }

    const recentPalettes = this.getPresetPaletteGroup(this.recentColorsLabel);
    if (!this.paletteExists(event.detail.hex, recentPalettes.palettes)) {
      this.addToPreset(event.detail.hex, this.recentColorsLabel);
    }
  }

  /**
   * Add a single color the list of preset palettes. If the label already exists it will be added to the start. If it doesn't exist, a new section will be created.
   * @param hex
   * @param label
   */
  @Method()
  async addToPreset(hex: string, label: string) {
    if (this.renderPresetPalette(hex)) {
      const palettes = JSON.parse(JSON.stringify(this.palettesToDisplay));
      const paletteIndex = palettes.findIndex(p => p.label === label);
      if (paletteIndex !== -1) {
        if (!this.paletteExists(hex, palettes[paletteIndex].palettes)) {
          palettes[paletteIndex].palettes.unshift(hex);
        }
      } else {
        palettes.push({
          label: label,
          palettes: [
            hex
          ]
        });
      }
      this.palettesToDisplay = palettes;
    }
  }

  private getPresetPaletteGroup(label: string) {
    const palettes = JSON.parse(JSON.stringify(this.palettesToDisplay));
    const paletteIndex = palettes.findIndex(p => p.label === label);
    return palettes[paletteIndex];
  }

  private handleOpacityInput = event => {
    const opacityValue = isNaN(event.target.value) ? 0 : event.target.value;
    this.currentOpacity = Math.max(Math.min(opacityValue, 100), 0);
    this.setColor(this.currentColor.toHEXA().toString());

  }

  private setPresetPalette = event => {
    this.setColor(event.target.dataset.color);
    this.currentOpacity = numberAsPercent(this.currentColor.alpha);
    this.hueSlider.setHue(this.currentColor.hue);
    this.colorPalette.setColor(this.currentColor.toHEX().toString());
    this.setOpacitySlider();
  }

  private handleHexInput = event => {
    const hexValue = event.target.value;
    const hex = hexValue.startsWith('#') ? hexValue : `#${ hexValue }`;
    if (isValidHex(hex)) {
      this.setColor(hex);
      this.hueSlider.setHue(this.currentColor.hue);
      this.colorPalette.setColor(this.currentColor.toHEX().toString());
    }
  }

  private setColor(color: string) {
    this.currentColor = new HSVaColor(...parseToHSVA(color).values);
    this.colorHex = this.currentColor.toHEX().toString();
    const outputColor = this.currentColor.clone();
    if (!this.showOpacity()) {
      outputColor.alpha = 1;
    }
    this.colorChange.emit(outputColor);
  }


  private setOpacitySlider() {
    if (this.showOpacity()) {
      this.opacitySlider.setColor(this.currentColor.toHEX().toString());
      this.opacitySlider.setOpacity(this.currentColor.alpha);
    }
  }

  private showOpacity(): boolean {
    return this.opacity !== undefined && this.opacity === true;
  }

  private hasOpacity = (color: string): boolean => color.length > 7;

  private renderPresetPalette(palette): boolean {
    return (isValidHex(palette) && !this.showOpacity() && !this.hasOpacity(palette)) ||
      (isValidHex(palette) && this.showOpacity());
  }

  private paletteExists(hex: string, palettes: Array<string>) {
    return palettes.findIndex(pHex => pHex.toLowerCase() === hex.toLowerCase()) !== -1;
  }


  private renderOpacityInput(): HTMLDivElement {
    if (this.showOpacity()) {
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
          <color-palette color={ this.colorHex } ref={ el => this.colorPalette = el as HTMLColorPaletteElement } />

          <hue-slider color={ this.colorHex } ref={ el => this.hueSlider = el as HTMLHueSliderElement } />

          {
            this.showOpacity()
              ? <opacity-slider color={ this.colorHex } opacity={ this.currentOpacity } ref={ el => this.opacitySlider = el as HTMLOpacitySliderElement } />
              : ''
          }

          <div style={ {
            width: '100%',
            maxWidth: '200px',
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
              let presetCount: number = 0;
              if (label === this.recentColorsLabel) {
                this.hasRecentColors = true;
              }
              return (
                <div>
                  <h3 class={ 'palettes-header' }>{ label }</h3>
                  <div class={ 'palettes-container' }>
                    { palettes.map(palette => {
                      if (this.renderPresetPalette(palette) && presetCount < this.maxPresetDisplay) {
                        presetCount++;
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
