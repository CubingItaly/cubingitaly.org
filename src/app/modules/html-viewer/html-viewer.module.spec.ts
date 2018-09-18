import { HtmlViewerModule } from './html-viewer.module';

describe('HtmlViewerModule', () => {
  let htmlViewerModule: HtmlViewerModule;

  beforeEach(() => {
    htmlViewerModule = new HtmlViewerModule();
  });

  it('should create an instance', () => {
    expect(htmlViewerModule).toBeTruthy();
  });
});
