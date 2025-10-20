import layout from './en-US/layout';
import component from './en-US/component';
import menu from './en-US/menu';
import pages from './en-US/pages';
import settings from './en-US/settings';
import dict from './en-US/dict';

export default {
  'app.tools.fullscreen.on': 'Enter Full Screen',
  'app.tools.fullscreen.off': 'Exit Full Screen',
  'app.tools.fullscreen.unsupport':
    'Full screen is not supported in this browser',
  'app.tools.fullscreen.on.error': 'Failed to enter full screen: ',
  'app.tools.fullscreen.off.error': 'Failed to exit full screen: ',
  ...pages,
  ...menu,
  ...settings,
  ...layout,
  ...component,
  ...dict,
};
