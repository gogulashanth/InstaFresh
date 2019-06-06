import colors from './colors';
import fonts from './fonts';
import fontSize from './fontSize';

const palette = {
  heading: {
    color: colors.title,
    fontSize: fontSize.heading,
    fontFamily: fonts.text,
  },
  text: {
    color: colors.text,
    fontSize: fontSize.text,
    fontFamily: fonts.text,
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
  themeDark: {
    Text: {
      h6Style: {
        color: 'white',
      },
    },
  },
  theme: {
    Button: {
      titleStyle: {
        color: colors.logo,
      },
      containerStyle: {
        backgroundColor: colors.logo,
      },
    },

  }
};
export default palette;
