import { newSpecPage } from '@stencil/core/testing';
import { ColorPalette } from '../color-palette';

describe('color-palette', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ColorPalette],
      html: `<color-palette></color-palette>`,
    });
    expect(page.root).toEqualHtml(`
      <color-palette>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </color-palette>
    `);
  });
});
