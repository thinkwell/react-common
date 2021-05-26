import {getByText, queryByText, queryByClass, fireClick} from './TestHelper'
import Util from 'Util';

describe('components/Util', () => {
  describe('redirect', () => {
    let url, reload;
    beforeEach(() => {
      url = reload = undefined
      window.location.pathname = '/account/login'
      window.location.replace = (_url) => { url = _url }
      window.location.reload = () => { reload = true }
      Util.redirect({location: '/account/login#recover', message: 'somemessage'})
    })
    it('should call location.replace()', () => {
      expect(url).toBe('/account/login?message=somemessage#recover')
    });
    it('should NOT trigger location.reload()', () => {
      expect(reload).toBe(undefined)
    });
  })

  describe('getParam', () => {
    it('should return param value', () => {
      const value = Util.getParam('https://example.org/path/to?param1=test', 'param1')
      expect(value).toBe('test')
    });
  })

  describe('getParam without match', () => {
    it('should return false', () => {
      const value = Util.getParam('https://example.org/path/to?param1=test', 'param2')
      expect(value).toBe(false)
    });
  })

  describe('setParam', () => {
    it('should add param to url', () => {
      const url = Util.setParam('https://example.org/path/to?param1=test', 'param2', 'test2')
      expect(url).toBe('https://example.org/path/to?param1=test&param2=test2')
    });
  })

  describe('setParam with existing param', () => {
    it('should update param in url', () => {
      const url = Util.setParam('https://example.org/path/to?param1=test', 'param1', 'test2')
      expect(url).toBe('https://example.org/path/to?param1=test2')
    });
  })

  describe('flattenDeep', () => {
    it('should return array of error strings', () => {
      const errors = Util.flattenDeep({section: {organizationId: [], sectionId: []}, duration: "Required Duration"})
      expect(errors).toStrictEqual(["Required Duration"])
    });
  })
});
