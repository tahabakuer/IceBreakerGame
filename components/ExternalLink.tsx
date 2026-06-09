import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';
import { type Href } from 'expo-router';

export function ExternalLink(props: Omit<React.ComponentProps<typeof Link>, 'href'> & { href: Href }) {
  return (
    <Link
      target="_blank"
      {...props}
      // @ts-ignore Web tarafında güvenli çalışması için
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== 'web') {
          e.preventDefault();
          WebBrowser.openBrowserAsync(props.href as string);
        }
      }}
    />
  );
}
