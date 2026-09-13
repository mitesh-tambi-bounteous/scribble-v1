// Design: .arc/designs/SCRIBBLE-V2-STORY-001-design.html, Screens 1 (default),
// 2 (submitting), 7 (validation errors). Not renderable/testable in this
// sandbox -- no network access to install Expo/React Native (see the
// story's implementation summary). Logic this file binds to
// (disabled-while-submitting, loading indicator, field-scoped errors) is
// fully unit-tested in `src/controllers/signUpFormController.ts`.
import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../src/theme.ts";
import { createSignUpFormController } from "../src/controllers/signUpFormController.ts";
import { LocalAuthAdapter } from "../src/services/auth/adapters/local.ts";

const adapter = new LocalAuthAdapter({ baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000" });

export default function SignUpScreen() {
  const router = useRouter();
  const [controller] = useState(() => createSignUpFormController(adapter));
  const [state, setState] = useState(controller.getState());

  useEffect(() => controller.subscribe(() => setState(controller.getState())), [controller]);

  useEffect(() => {
    if (state.result?.kind === "verification_required") {
      router.push({ pathname: "/verify-email", params: { email: state.result.email } });
    } else if (state.result?.kind === "parental_consent_required") {
      router.push({
        pathname: "/(auth)/parental-consent",
        params: { email: state.fields.email, consentRequestId: state.result.consentRequestId },
      });
    }
  }, [state.result, router, state.fields.email]);

  const fieldError = (field: string) => (state.error?.field === field ? state.error.message : null);
  const bannerMessage = state.error && !state.error.field ? state.error.message : null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.bg, alignItems: "center", padding: theme.space[7] }}>
      <View
        style={{
          width: "100%",
          maxWidth: 440,
          backgroundColor: theme.color.surface,
          borderWidth: 1,
          borderColor: theme.color.border,
          borderRadius: theme.radius.lg,
          padding: theme.space[6],
        }}
      >
        <Text style={{ color: theme.color.accentTeal, fontWeight: "700", marginBottom: theme.space[2] }}>
          ● Create your account
        </Text>
        <Text style={{ fontFamily: theme.font.display, fontSize: 28, fontWeight: "700", color: theme.color.fg }}>
          Join Scribl
        </Text>
        <Text style={{ color: theme.color.muted, marginBottom: theme.space[5] }}>
          A prompt a day, drawn with the people who know you best.
        </Text>

        {bannerMessage ? (
          <View
            style={{
              backgroundColor: theme.color.dangerBg,
              borderRadius: theme.radius.md,
              padding: theme.space[4],
              marginBottom: theme.space[5],
            }}
          >
            <Text style={{ color: theme.color.danger, fontWeight: "700" }}>Unsupported sign-up method</Text>
            <Text style={{ color: theme.color.danger }}>{bannerMessage}</Text>
          </View>
        ) : null}

        <Field label="Email">
          <TextInput
            testID="su-email"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="you@example.com"
            value={state.fields.email}
            onChangeText={(email) => controller.setFields({ ...state.fields, email })}
            style={inputStyle(!!fieldError("email"))}
          />
          <FieldError message={fieldError("email")} />
        </Field>

        <Field label="Password">
          <TextInput
            testID="su-password"
            secureTextEntry
            autoComplete="new-password"
            placeholder="12+ characters"
            value={state.fields.password}
            onChangeText={(password) => controller.setFields({ ...state.fields, password })}
            style={inputStyle(!!fieldError("password"))}
          />
          <Text style={{ fontSize: 12, color: theme.color.muted, marginTop: theme.space[1] }}>
            At least 12 characters. Cognito's policy also requires a mix of cases and a number.
          </Text>
          <FieldError message={fieldError("password")} />
        </Field>

        <Field label="Display name">
          <TextInput
            testID="su-name"
            autoComplete="nickname"
            placeholder="What should we call you?"
            value={state.fields.displayName}
            onChangeText={(displayName) => controller.setFields({ ...state.fields, displayName })}
            style={inputStyle(false)}
          />
          <Text style={{ fontSize: 12, color: theme.color.muted, marginTop: theme.space[1] }}>
            Shown on your dashboard greeting and to people you draw with.
          </Text>
        </Field>

        <Field label="Date of birth">
          <TextInput
            testID="su-dob"
            placeholder="YYYY-MM-DD"
            value={state.fields.dateOfBirth}
            onChangeText={(dateOfBirth) => controller.setFields({ ...state.fields, dateOfBirth })}
            style={inputStyle(!!fieldError("dateOfBirth"))}
          />
          <Text style={{ fontSize: 12, color: theme.color.muted, marginTop: theme.space[1] }}>
            Used only to apply the right sign-up path -- we ask once, at sign-up.
          </Text>
          <FieldError message={fieldError("dateOfBirth")} />
        </Field>

        <Pressable
          testID="su-submit-btn"
          accessibilityState={{ disabled: state.submitDisabled }}
          disabled={state.submitDisabled}
          onPress={() => controller.submit()}
          style={{
            backgroundColor: state.submitDisabled ? theme.color.surfaceSunken : theme.color.brand,
            borderRadius: theme.radius.md,
            padding: theme.space[3],
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: theme.space[2],
          }}
        >
          {state.showLoadingIndicator ? <ActivityIndicator color={theme.color.brandFg} /> : null}
          <Text style={{ color: state.submitDisabled ? theme.color.muted : theme.color.brandFg, fontWeight: "700" }}>
            {state.showLoadingIndicator ? "Creating account…" : "Create account"}
          </Text>
        </Pressable>

        <Text style={{ textAlign: "center", color: theme.color.muted, marginTop: theme.space[5] }}>
          already have an account?{" "}
          <Text style={{ color: theme.color.accentTeal, fontWeight: "700" }} onPress={() => router.push("/sign-in")}>
            Sign in instead
          </Text>
        </Text>
      </View>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: theme.space[4] }}>
      <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: theme.space[2], color: theme.color.fg }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

function FieldError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Text style={{ color: theme.color.danger, fontSize: 12, marginTop: theme.space[2] }}>⚠ {message}</Text>
  );
}

function inputStyle(invalid: boolean) {
  return {
    width: "100%" as const,
    padding: theme.space[3],
    borderWidth: 1,
    borderColor: invalid ? theme.color.danger : theme.color.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
    color: theme.color.fg,
  };
}
