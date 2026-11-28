import { ApiError } from '@/api/client';
import { ErrorBanner } from '@/components/ErrorBanner';
import { useAuth } from '@/context/AuthContext';
import { errorMessage } from '@/utils/errors';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { width, height } = useWindowDimensions();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const isMobile = width < 600;
  const logoSize = isMobile ? 128 : 190;
  const logoMargin = height < 700 ? 4 : 0;

  const canSubmit =
    username.trim() !== '' && password !== '' && !submitting;

  const onSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      await signIn(username.trim(), password);
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError &&
          (caughtError.status === 400 || caughtError.status === 401)
          ? 'Usuario o contraseña inválidos.'
          : errorMessage(caughtError),
      );
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, dark && styles.containerDark]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.header,
            isMobile && styles.headerMobile,
            dark && styles.headerDark,
          ]}
        >
          <Text
            style={[
              styles.brand,
              isMobile && styles.brandMobile,
              dark && styles.textDark,
            ]}
          >
            ULAtorts
          </Text>
          <Pressable
            style={[
              styles.themeButton,
              isMobile && styles.themeButtonMobile,
              dark && styles.themeButtonDark,
            ]}
            onPress={() => setDark((current) => !current)}
            accessibilityRole="button"
            accessibilityLabel="Cambiar tema"
          >
            <Text style={styles.themeIcon}>{dark ? '☾' : '☀'}</Text>
          </Pressable>
        </View>

        <ScrollView
          style={[styles.scrollView, dark && styles.scrollViewDark]}
          contentContainerStyle={[
            styles.scrollContent,
            isMobile && styles.scrollContentMobile,
          ]}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          bounces={false}
        >
          <View
            style={[
              styles.content,
              isMobile && styles.contentMobile,
              dark && styles.contentDark,
            ]}
          >
            <Image
              source={require('../../assets/images/ulatorts-logo.png')}
              contentFit="contain"
              accessibilityLabel="Logo de ULATORTS"
              style={[
                styles.logo,
                {
                  width: logoSize,
                  height: logoSize,
                  marginBottom: logoMargin,
                },
              ]}
            />
            <Text
              style={[
                styles.title,
                isMobile && styles.titleMobile,
                dark && styles.textDark,
              ]}
            >
              Acceso de técnico
            </Text>

            <ErrorBanner message={error} />

            <View style={[styles.field, isMobile && styles.fieldMobile]}>
              <Text
                style={[
                  styles.label,
                  isMobile && styles.labelMobile,
                  dark && styles.textDark,
                ]}
              >
                USUARIO
              </Text>
              <TextInput
                style={[
                  styles.input,
                  isMobile && styles.inputMobile,
                  dark && styles.inputDark,
                ]}
                placeholder="Usuario"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={[styles.field, isMobile && styles.fieldMobile]}>
              <Text
                style={[
                  styles.label,
                  isMobile && styles.labelMobile,
                  dark && styles.textDark,
                ]}
              >
                CONTRASEÑA
              </Text>
              <TextInput
                style={[
                  styles.input,
                  isMobile && styles.inputMobile,
                  dark && styles.inputDark,
                ]}
                placeholder="Contraseña"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                textContentType="password"
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={canSubmit ? onSubmit : undefined}
              />
            </View>

            <Pressable
              style={[
                styles.button,
                isMobile && styles.buttonMobile,
                !canSubmit && styles.buttonDisabled,
              ]}
              onPress={onSubmit}
              disabled={!canSubmit}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Ingresar</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollViewDark: {
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollContentMobile: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
    backgroundColor: '#FFFFFF',
  },
  headerDark: {
    backgroundColor: '#0F172A',
  },
  headerMobile: {
    height: 60,
    paddingHorizontal: 20,
  },
  brand: {
    color: '#111827',
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '800',
  },
  brandMobile: {
    fontSize: 23,
    lineHeight: 28,
  },
  themeButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonMobile: {
    width: 42,
    height: 42,
    borderRadius: 10,
  },
  themeButtonDark: {
    backgroundColor: '#1E293B',
    borderColor: '#475569',
  },
  themeIcon: {
    color: '#F59E0B',
    fontSize: 21,
  },
  content: {
    flex: 0,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: 48,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
  },
  contentDark: {
    backgroundColor: '#0F172A',
  },
  contentMobile: {
    maxWidth: '100%',
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  logo: {
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    textAlign: 'center',
    fontWeight: '800',
    color: '#111827',
  },
  titleMobile: {
    fontSize: 26,
    lineHeight: 32,
  },
  field: {
    marginBottom: 16,
  },
  fieldMobile: {
    marginBottom: 13,
  },
  label: {
    color: '#111827',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
    marginBottom: 5,
  },
  labelMobile: {
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    height: 59,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#172554',
    backgroundColor: '#E4E4E4',
    fontSize: 17,
  },
  inputMobile: {
    height: 55,
    borderRadius: 11,
  },
  inputDark: {
    color: '#F8FAFC',
    backgroundColor: '#1E293B',
    borderColor: '#64748B',
  },
  button: {
    height: 66,
    backgroundColor: '#59ACD0',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonMobile: {
    height: 62,
    borderRadius: 13,
    marginTop: 21,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  textDark: {
    color: '#F8FAFC',
  },
});
