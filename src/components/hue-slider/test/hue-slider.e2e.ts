import { newE2EPage } from '@stencil/core/testing';

describe('hue-slider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<hue-slider color=#FF0000></hue-slider>');

    const element = await page.find('hue-slider');
    expect(element).toHaveClass('hydrated');
  });
});
