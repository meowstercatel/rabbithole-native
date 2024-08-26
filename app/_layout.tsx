import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="JournalMain"/>
      {/* <Stack.Screen name="index" /> */}
    </Stack>
    </ThemeProvider>
  );
}
