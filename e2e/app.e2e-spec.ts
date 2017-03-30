import { Ng2PersonalSitePage } from './app.po';

describe('ng2-personal-site App', () => {
  let page: Ng2PersonalSitePage;

  beforeEach(() => {
    page = new Ng2PersonalSitePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
