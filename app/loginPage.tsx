import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Menu } from 'react-native-feather';
import rabbitHoleClient from './rabbitHoleClient';
import * as SecureStore from 'expo-secure-store';
import { WebView } from 'react-native-webview';

export default function LoginPage() {
  let webview = null;
  const [token, setToken] = useState('');

  SecureStore.getItemAsync("token").then(token => {
    router.replace({pathname: "/JournalMain"})
  })

  const handleLogin = async() => {
    await SecureStore.setItemAsync("token", token);
    setToken("");
    router.replace({pathname: "/JournalMain"})
  };
  const getToken = `window.fetch = new Proxy(window.fetch, {apply: function (target, that, args) {let temp = target.apply(that, args); if(args[1]) {try {window.ReactNativeWebView.postMessage(JSON.parse(args[1].body).accessToken);} catch(e) {}}; return temp;},}); true;`;
  const pageChange = async(newNavState) => {
    const {url} = newNavState;
    if(!url) return;
    if(url.includes(".tech/journal")) {
      webview.injectJavaScript(getToken);
    }
  }
  const onMessage = async(event) => {
    const message = event.nativeEvent.data;
    // alert(message);
    webview.stopLoading();
    await SecureStore.setItemAsync("token", message);
    router.replace({pathname: "/JournalMain"})
  }
    return (
        <WebView
        ref={(ref) => (webview = ref)}
        onNavigationStateChange={pageChange}
        onMessage={onMessage}
        originWhitelist={['*']}
        source={{uri: "https://hole.rabbit.tech/journal"}}
        />
    )

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* <KeyboardAvoidingView 
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.keyboardAvoidingView}
//       > */}
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.logo}>rabbithole</Text>
//           <TouchableOpacity accessibilityRole="button" accessibilityLabel="Menu">
//             <Menu stroke="white" width={24} height={24} />
//           </TouchableOpacity>
//         </View>

//         {/* Login Form */}
//         <View style={styles.formContainer}>
//           <Text style={styles.title}>Login</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Token..."
//             placeholderTextColor="#6b7280"
//             value={token}
//             onChangeText={setToken}
//             accessibilityLabel="Token input"
//           />
//           <TouchableOpacity 
//             style={styles.button} 
//             onPress={handleLogin}
//             accessibilityRole="button"
//             accessibilityLabel="Confirm login"
//           >
//             <Text style={styles.buttonText}>Confirm</Text>
//           </TouchableOpacity>
//         </View>
//       {/* </KeyboardAvoidingView> */}
//     </SafeAreaView>
//   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  formContainer: {
    flex: 1,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#111827',
    borderRadius: 8,
    color: 'white',
    fontSize: 16,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#1c1c1b',//'#3b82f6',
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});