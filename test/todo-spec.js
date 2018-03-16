describe('Homepage Hello World', function() {
  it('should have text', function() {
    browser.get('http://localhost:8080/');
    expect(element(by.css('h1')).getText()).toEqual('Hello world');
  });
});