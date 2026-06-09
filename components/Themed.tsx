import { Text as DefaultText, View as DefaultView, StyleSheet } from 'react-native';
import { FLIPSIDE_THEME } from '@/constants/theme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

/**
 * Projedeki <Text> bileşenlerini merkezi monokrom yazı rengimize bağlar.
 * Dışarıdan ekstra inline style verilirse onu da ezmeden üzerine ekler.
 */
export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  return <DefaultText style={[styles.defaultText, style]} {...otherProps} />;
}

/**
 * Projedeki <View> bileşenlerini merkezi brutalist arka plan siyahımıza bağlar.
 */
export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  return <DefaultView style={[styles.defaultView, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  defaultText: {
    color: FLIPSIDE_THEME.colors.textPrimary, // Saf kemik beyazı / açık gri
  },
  defaultView: {
    backgroundColor: FLIPSIDE_THEME.colors.background, // Saf brutalist siyah (#0a0a0a)
  },
});