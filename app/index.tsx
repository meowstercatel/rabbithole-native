import { Text, View } from "react-native";
import JournalMain from './JournalMain' 
import { StatusBar } from "expo-status-bar";
import LoginPage from "./loginPage";
export default function Index() {
  return (
    <>
    <StatusBar translucent={true}/>
    <View style={{marginTop: 20}}></View>
    <JournalMain/>
    {/* <JournalMain/> */}
    </>
  );
    /*<View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>*/
}
