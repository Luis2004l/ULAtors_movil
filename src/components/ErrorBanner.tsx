import { theme } from '@/theme';
import { StyleSheet, Text, View } from 'react-native';

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FEE2E2',
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  text: {
    color: '#991B1B',
  },
});
