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
      h2Style: {
        color: colors.text,
        fontSize: fontSize.h2,
        fontFamily: fonts.text,
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
        backgroundColor: colors.darkerLogoBack,
        borderBottomWidth: 0.5,
        borderColor: colors.textOp(0.3),
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
        fontSize: fontSize.h3,
      },
    },
    SearchBar: {
      containerStyle: {
        backgroundColor: colors.logoBack,
        borderWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
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
};

export default themes;
