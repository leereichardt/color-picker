import { Component, EventEmitter, h, Prop, Event, Listen } from '@stencil/core';
import Moveable from "../../libs/Moveable";
import { HSVaColor } from "../../utils/HSVaColor";
import { parseToHSVA } from "../../utils/Color";

@Component({
  tag: 'hue-slider',
  styleUrl: 'hue-slider.css',
  shadow: true,
})
export class HueSlider {

  private hue: number;
  private container: HTMLDivElement
  private slider: HTMLDivElement

  // @State() hue: number;

  /**
   * The color that is being displayed. This currently *MUST* be in 6 digit hex format.
   */
  @Prop() color: string;

  /**
   * Emitted when the hue has changed. Emits only the Hue value
   */
  @Event() hueChange: EventEmitter<number>
  private handleChange = (event) => {
    const hue = event.detail.x * 360;
    this.hueChange.emit(hue);
    this.slider.style.backgroundColor = `hsl(${ hue }, 100%, 50%)`;
  }

  componentWillLoad() {
    const color = new HSVaColor(...parseToHSVA(this.color).values);
    this.hue = color.hue;
  }

  componentDidLoad() {
    new Moveable({
      lock: 'v',
      element: this.slider,
      wrapper: this.container,
    });
  }

  @Listen('presetPaletteChange', { target: "document" })
  presetPaletteChangeHandler(event: CustomEvent<HSVaColor>) {
    this.hue = event.detail.hue;
  }

  render() {
    return (
      <div class={ 'component-outer' } style={ {
        'margin-top': '16px',
      } }
           ref={ el => this.container = el as HTMLDivElement }>
        <div class={ 'hue-selector component-selector' } />
        <div class={ 'selector__pickr' } style={ {
          'margin-top': '-4px',
          'left': `${ this.hue / 360 * 100 }%`,
          'background': `hsl(${ this.hue }, 100%, 50%)`
        } }
             onChange={ this.handleChange }
             ref={ el => this.slider = el as HTMLDivElement } />
      </div>
    );
  }

}
