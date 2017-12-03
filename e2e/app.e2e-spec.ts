import { EthdevRPSPage } from './app.po';

describe('ethdev-rps App', () => {
  let page: EthdevRPSPage;

  beforeEach(() => {
    page = new EthdevRPSPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
