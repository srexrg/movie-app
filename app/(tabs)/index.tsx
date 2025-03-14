import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-slate-400">
      <Text>Hey</Text>
      <Link href="../onboarding">Onboarding</Link>
    </View>
  );
}
