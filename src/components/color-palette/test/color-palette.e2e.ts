import { newE2EPage } from '@stencil/core/testing';

describe('color-palette', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<color-palette color="#FF0000"></color-palette>');

    const element = await page.find('color-palette');
    expect(element).toHaveClass('hydrated');
  });
});
