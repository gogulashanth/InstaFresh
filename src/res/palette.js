import colors from './colors';
import fonts from './fonts';
import fontSize from './fontSize';

const palette = {
  heading: {
    color: colors.title,
    fontSize: 20,
  },
  text: {
    color: colors.text,
    fontSize: 12,
  },
  header: {
    backgroundColor: '#333333',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    opacity: 1,
  },
  emptyContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    flexDirection: 'column',
  },
};
export default palette;
