import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FLIPSIDE_THEME } from '@/constants/theme';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>FLIPSIDE v1.0.0</Text>
        <Text style={styles.description}>
          A brutalist social deduction interaction matrix. Align with the collective subconscious or risk absolute isolation.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SYSTEM LOCATION</Text>
        <Text style={styles.pathText}>{path}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: FLIPSIDE_THEME.colors.background,
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: FLIPSIDE_THEME.colors.surface,
    borderWidth: 1,
    borderColor: FLIPSIDE_THEME.colors.border,
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
  },
  title: {
    color: FLIPSIDE_THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 10,
  },
  description: {
    color: FLIPSIDE_THEME.colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: FLIPSIDE_THEME.colors.textMuted,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 6,
  },
  pathText: {
    color: FLIPSIDE_THEME.colors.textSecondary,
    fontSize: 11,
    fontFamily: 'Courier',
    backgroundColor: FLIPSIDE_THEME.colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});