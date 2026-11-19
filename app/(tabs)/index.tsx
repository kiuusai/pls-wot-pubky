import { Button, ButtonText } from '@/components/ui/button';
import { useAppTheme } from '@/components/ui/app-theme';
import { Text, View } from 'react-native';

export default function TabOneScreen() {
  const { theme, toggleTheme } = useAppTheme();

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-background px-6">
      <View className="items-center gap-2">
        <Text className="text-2xl font-bold text-foreground">Gluestack UI</Text>
        <Text className="text-center text-muted-foreground">
          UniWind and semantic theme tokens are ready.
        </Text>
      </View>
      <View className="rounded-xl border border-border bg-card p-5">
        <Text className="text-center text-foreground">Current theme: {theme}</Text>
      </View>
      <Button onPress={toggleTheme}>
        <ButtonText>Switch to {theme === 'dark' ? 'light' : 'dark'} theme</ButtonText>
      </Button>
    </View>
  );
}
