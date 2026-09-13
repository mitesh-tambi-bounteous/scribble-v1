// Design: .arc/designs/SCRIBBLE-V2-STORY-001-design.html, Screen 6
// (parental consent required). Not renderable/testable in this sandbox --
// see sign-up.tsx's header note. Reached from the sign-up screen's
// `parental_consent_required` branch (AC2); per ADR-0012 "Option A", no
// account has been created at this point (AC3).
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { theme } from "../../src/theme.ts";

export default function ParentalConsentScreen() {
  const router = useRouter();
  const { email, consentRequestId } = useLocalSearchParams<{ email: string; consentRequestId: string }>();

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
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: theme.color.surfaceSunken,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: theme.space[4],
          }}
        >
          <Text style={{ fontSize: 32 }}>🛡</Text>
        </View>
        <Text style={{ color: theme.color.accentTeal, fontWeight: "700" }}>● Parental consent needed</Text>
        <Text style={{ fontFamily: theme.font.display, fontSize: 24, fontWeight: "700", textAlign: "center" }}>
          Let's bring in a parent or guardian
        </Text>
        <Text style={{ color: theme.color.muted, textAlign: "center", marginBottom: theme.space[5] }}>
          The date of birth you entered means Scribl needs a parent or guardian's consent before an
          account can be created.
        </Text>

        <View
          style={{
            width: "100%",
            backgroundColor: theme.color.warningBg,
            borderRadius: theme.radius.md,
            padding: theme.space[4],
            marginBottom: theme.space[4],
          }}
        >
          <Text style={{ color: theme.color.warning, fontWeight: "700" }}>No account has been created yet</Text>
          <Text style={{ color: theme.color.warning }}>
            Scribl isn't currently able to enroll accounts for people under 13. This path is being built
            out -- check back soon, or ask a parent to sign up on your behalf once it's available.
          </Text>
        </View>

        <KvRow label="Email submitted" value={email} />
        <KvRow label="Consent request" value={consentRequestId} />
        <KvRow label="Status" value="Not started" pill />

        <Pressable
          onPress={() => router.push("/sign-up")}
          style={{
            width: "100%",
            marginTop: theme.space[4],
            backgroundColor: theme.color.surface,
            borderWidth: 1,
            borderColor: theme.color.border,
            borderRadius: theme.radius.md,
            padding: theme.space[3],
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme.color.fg, fontWeight: "700" }}>Back to sign up</Text>
        </Pressable>
      </View>
    </View>
  );
}

function KvRow({ label, value, pill }: { label: string; value?: string; pill?: boolean }) {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: theme.space[2],
        borderBottomWidth: 1,
        borderBottomColor: theme.color.border,
      }}
    >
      <Text style={{ color: theme.color.muted }}>{label}</Text>
      <Text
        style={
          pill
            ? {
                fontWeight: "700",
                fontSize: 12,
                backgroundColor: theme.color.surfaceSunken,
                color: theme.color.muted,
                paddingHorizontal: theme.space[3],
                paddingVertical: theme.space[1],
                borderRadius: theme.radius.full,
              }
            : { fontWeight: "600" }
        }
      >
        {value}
      </Text>
    </View>
  );
}
