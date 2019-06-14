import fontSize from 'res/fontSize';
import colors from 'res/colors';
import fonts from 'res/fonts';

const themes = {
  dark: {
    Text: {
      style: {
        fontFamily: fonts.text,
        color: colors.text,
      },
      h4Style: {
        color: colors.text,
        fontSize: fontSize.h4,
        fontFamily: fonts.text,
      },
      h3Style: {
        color: colors.text,
        fontSize: fontSize.h3,
        fontFamily: fonts.text,
      },
    },
    CustomListItem: {
      leftAvatar: {
        rounded: true,
        size: 45,
      },
      containerStyle: {
        backgroundColor: colors.logoBack,
      },
      titleStyle: {
        color: colors.text,
        paddingBottom: 2,
      },
      subtitleStyle: {
        color: colors.text,
        paddingBottom: 2,
      },
    },
    Button: {
      buttonStyle: {
        backgroundColor: colors.logo,
        borderRadius: 20,
        height: 40,
      },
      titleStyle: {
        color: 'white',
      },
    },
    SearchBar: {
      containerStyle: {
        backgroundColor: colors.logoBack,
      },
      inputContainerStyle: {
        backgroundColor: colors.darkerLogoBack,
        height: 32,
      },
      inputStyle: {
        color: colors.text,
        fontSize: fontSize.h4,
      },
      keyboardAppearance: 'dark',
    },
  },
  light: {
    Text: {
      h4Style: {
        color: colors.text,
        fontSize: fontSize.h4,
      },
      h3Style: {
        color: colors.text,
        fontSize: fontSize.h3,
      },
    },
    Button: {
      buttonStyle: {
        backgroundColor: colors.logoBack,
        borderRadius: 18,
      },
      titleStyle: {
        color: colors.text,
      },
    },
  },
};

export default themes;
