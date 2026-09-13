// Design: .arc/designs/SCRIBBLE-V2-STORY-001-design.html, Screens 3 (default
// + tabbed states), 4 (confirming/loading), 5 (authenticated). Not
// renderable/testable in this sandbox -- see sign-up.tsx's header note.
// State logic is fully unit-tested in
// `src/controllers/verifyEmailFormController.ts`.
import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { theme } from "../src/theme.ts";
import { createVerifyEmailFormController } from "../src/controllers/verifyEmailFormController.ts";
import { LocalAuthAdapter } from "../src/services/auth/adapters/local.ts";
import { postAuthRoute } from "../src/lib/postAuthRoute.ts";

const adapter = new LocalAuthAdapter({ baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000" });

const BANNER_COPY: Record<string, { title: string; body: string; tone: "danger" | "warning" } | null> = {
  none: null,
  wrong: {
    tone: "danger",
    title: "That code isn't right",
    body: "Double-check the 6 digits from your email and try again. No session has been created.",
  },
  locked: {
    tone: "danger",
    title: "Too many attempts",
    body: "You've reached the limit of failed codes. Try again after the cooldown, or request a fresh code by email.",
  },
  "resend-cooldown": {
    tone: "warning",
    title: "Hold on a moment",
    body: "We already sent one -- check spam if it hasn't arrived, then try resending again shortly.",
  },
  "resend-limit": {
    tone: "danger",
    title: "Resend limit reached",
    body: "You've used all your code resends for this hour. No further code has been sent.",
  },
};

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email, displayName } = useLocalSearchParams<{ email: string; displayName?: string }>();
  const [controller] = useState(() => createVerifyEmailFormController(adapter, email));
  const [state, setState] = useState(controller.getState());

  useEffect(() => {
    const interval = setInterval(() => setState(controller.getState()), 50);
    return () => clearInterval(interval);
  }, [controller]);

  useEffect(() => {
    if (state.authenticated) router.replace(postAuthRoute());
  }, [state.authenticated, router]);

  const banner = BANNER_COPY[state.bannerState];
  const initial = (displayName ?? email ?? "?").trim().charAt(0).toUpperCase();

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
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: theme.color.brand,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: theme.space[4],
          }}
        >
          <Text style={{ color: theme.color.brandFg, fontFamily: theme.font.display, fontWeight: "700", fontSize: 20 }}>
            {initial}
          </Text>
        </View>
        <Text style={{ color: theme.color.accentTeal, fontWeight: "700" }}>● Check your inbox</Text>
        <Text style={{ fontFamily: theme.font.display, fontSize: 28, fontWeight: "700", textAlign: "center" }}>
          Verify your email
        </Text>
        <Text style={{ color: theme.color.muted, textAlign: "center", marginBottom: theme.space[5] }}>
          We sent a 6-digit code to {email}.
        </Text>

        {banner ? (
          <View
            style={{
              width: "100%",
              backgroundColor: banner.tone === "danger" ? theme.color.dangerBg : theme.color.warningBg,
              borderRadius: theme.radius.md,
              padding: theme.space[4],
              marginBottom: theme.space[5],
            }}
          >
            <Text style={{ color: banner.tone === "danger" ? theme.color.danger : theme.color.warning, fontWeight: "700" }}>
              {banner.title}
            </Text>
            <Text style={{ color: banner.tone === "danger" ? theme.color.danger : theme.color.warning }}>{banner.body}</Text>
          </View>
        ) : null}

        <TextInput
          testID="verify-code"
          keyboardType="number-pad"
          maxLength={6}
          editable={!state.codeInputDisabled}
          value={state.code}
          onChangeText={controller.setCode}
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: 20,
            fontWeight: "700",
            letterSpacing: 6,
            padding: theme.space[3],
            borderWidth: 1,
            borderColor: theme.color.border,
            borderRadius: theme.radius.md,
            marginBottom: theme.space[4],
          }}
        />

        <Pressable
          testID="verify-submit-btn"
          disabled={state.submitDisabled || state.submitting}
          accessibilityState={{ disabled: state.submitDisabled || state.submitting }}
          onPress={() => controller.confirm()}
          style={{
            width: "100%",
            backgroundColor: state.submitDisabled ? theme.color.surfaceSunken : theme.color.brand,
            borderRadius: theme.radius.md,
            padding: theme.space[3],
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: theme.space[2],
          }}
        >
          {state.submitting ? <ActivityIndicator color={theme.color.brandFg} /> : null}
          <Text style={{ color: theme.color.brandFg, fontWeight: "700" }}>
            {state.submitting ? "Confirming…" : "Confirm and continue"}
          </Text>
        </Pressable>

        <View style={{ flexDirection: "row", gap: theme.space[2], marginTop: theme.space[4] }}>
          <Text style={{ color: theme.color.muted }}>Didn't get it?</Text>
          <Text
            testID="resend-btn"
            onPress={() => (!state.resendDisabled ? controller.resend() : undefined)}
            style={{ color: state.resendDisabled ? theme.color.muted : theme.color.accentTeal, fontWeight: "700" }}
          >
            {state.resending ? "Sending…" : "Resend code"}
          </Text>
        </View>
      </View>
    </View>
  );
}
