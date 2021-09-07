import { newSpecPage } from '@stencil/core/testing';
import { ColorPickr } from '../color-pickr';

describe('color-pickr', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ColorPickr],
      html: `<color-pickr></color-pickr>`,
    });
    expect(page.root).toEqualHtml(`
      <color-pickr>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </color-pickr>
    `);
  });
});
