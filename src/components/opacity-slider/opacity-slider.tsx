import { Component, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
import Moveable from "../../libs/Moveable";
import { parseToHSVA } from "../../utils/Color";
import { HSVaColor } from "../../utils/HSVaColor";

@Component({
  tag: 'opacity-slider',
  styleUrl: 'opacity-slider.css',
  shadow: true,
})
export class OpacitySlider {

  private slider: HTMLDivElement
  private container: HTMLDivElement
  private currentColor: HSVaColor

  @State() currentRgb: Array<number>;
  @State() currentOpacity: number;
  @State() sliderOffset: number = 8;

  /**
   * The color that is being displayed. This currently *MUST* be in 6 digit hex format.
   */
  @Prop() color: string = '#000000';

  /**
   * The starting opacity value form 0 - 100
   */
  @Prop() opacity: number;

  @Watch('opacity')
  watchOpacity(opacity) {
    this.setInternalOpacity(opacity);
  }

  private getOpacityAsPercent(): number {
    return this.currentOpacity <= 1 ? this.currentOpacity * 100 : this.currentOpacity;
  }

  /**
   * Emitted when the opacity slider has changed
   */
  @Event() opacityChange: EventEmitter<number>
  private handleOpacityChange = (event) => {
    this.currentColor.alpha = this.currentOpacity = event.detail.x;
    this.slider.style.background = this.currentColor.toRGBA().toString();
    this.opacityChange.emit(this.currentOpacity);
  }

  /**
   * Sets the color for the slider
   * @param color
   */
  @Method()
  async setColor(color: string) {
    this.setInternalColor(color);
  }

  /**
   * Sets te opacity for the slider
   * @param opacity
   */
  @Method()
  async setOpacity(opacity: number) {
    this.setInternalOpacity(opacity);
  }

  componentDidLoad() {
    new Moveable({
      lock: 'v',
      element: this.slider,
      wrapper: this.container,
    });

    this.sliderOffset = this.slider.offsetWidth / 2;
  }

  componentWillLoad() {
    this.setInternalOpacity(this.opacity);
    this.setInternalColor(this.color);
  }

  private setInternalOpacity(opacity: number) {
    const o = opacity ?? 100;
    this.currentOpacity = o > 1 ? o / 100 : o;
  }

  private setInternalColor(color) {
    this.currentColor = new HSVaColor(...parseToHSVA(color).values);
    this.currentColor.alpha = this.currentOpacity;
    this.currentRgb = this.currentColor.toRGB();
  }

  render() {
    return (
      <div class={ 'component-outer' } style={ {
        'margin-top': '16px',
      } }
           ref={ el => this.container = el as HTMLDivElement }>
        <div class={ 'checker-board component-selector' } />
        <div
          class={ 'component-selector' }
          style={ {
            'background': `linear-gradient(90deg, rgba(${ this.currentRgb[0] },${ this.currentRgb[1] },${ this.currentRgb[2] }, 0) 0%, rgba(${ this.currentRgb[0] },${ this.currentRgb[1] },${ this.currentRgb[2] }, 1) 100%)`
          } }
        />
        <div
          class={ 'selector__pickr' }
          style={ {
            'margin-top': '-4px',
            'left': `calc(${ this.getOpacityAsPercent() }% - ${ this.sliderOffset }px)`,
            'background': `rgba(${ this.currentRgb[0] },${ this.currentRgb[1] },${ this.currentRgb[2] }, ${ this.currentOpacity })`
          } }
          onChange={ this.handleOpacityChange }
          ref={ el => this.slider = el as HTMLDivElement } />
      </div>
    );
  }

}
