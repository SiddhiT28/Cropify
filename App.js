import { NativeBaseProvider } from "native-base";
import React from "react";
import { SafeAreaView } from "react-native";
import "react-native-gesture-handler";
import RenderData from "./src/Components/RenderData";

export default function App() {
  return (
    <NativeBaseProvider>
      <SafeAreaView>
        <RenderData />
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
