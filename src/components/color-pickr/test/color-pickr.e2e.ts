import { newE2EPage } from '@stencil/core/testing';

describe('color-pickr', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<color-pickr></color-pickr>');

    const element = await page.find('color-pickr');
    expect(element).toHaveClass('hydrated');
  });
});
