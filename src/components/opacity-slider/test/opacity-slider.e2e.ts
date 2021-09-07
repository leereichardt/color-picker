import { newE2EPage } from '@stencil/core/testing';

describe('opacity-slider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<opacity-slider></opacity-slider>');

    const element = await page.find('opacity-slider');
    expect(element).toHaveClass('hydrated');
  });
});
