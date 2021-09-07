import { newSpecPage } from '@stencil/core/testing';
import { HueSlider } from '../hue-slider';

describe('hue-slider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [HueSlider],
      html: `<hue-slider></hue-slider>`,
    });
    expect(page.root).toEqualHtml(`
      <hue-slider>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </hue-slider>
    `);
  });
});
