import fontSize from 'res/fontSize';
import colors from 'res/colors';

const themes = {
  dark: {
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
    ListItem: {
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
      rightTitleStyle: {
        color: colors.text,
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
