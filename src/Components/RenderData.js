import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-native-markdown-display";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Divider,
  ScrollView,
} from "native-base";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const genAI = new GoogleGenerativeAI("AIzaSyA_bxer_o4sw7JJ2fOQ9VmqWWFcaLwXQgY");

const RenderData = () => {
  const [generativeDataLoaded, setGenerativeDataLoaded] = React.useState(true);
  const [generativeData, setGenerativeData] = React.useState(false);
  const [isValueLoading, setIsValueLoading] = useState(true);
  const [values, setValues] = useState({
    Humidity: "",
    SoliMoisture: "",
    Temperature: "",
  });

  async function run() {
    setGenerativeDataLoaded(false);
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    A user in Maharashtra, India wants to plant crops in the month of April. Given the current weather conditions:

Temperature: ${values.Temperature}°C
Humidity: ${values.Humidity}%
Soil Moisture: ${values.SoliMoisture} binary
Recommend the top 3 most profitable crops for these conditions. Include a suitability score, profit (in rupees) potential, and highlight key considerations for growth and potential earnings. Also add links to topics which can explored more
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    setGenerativeDataLoaded(true);
    setGenerativeData(text);
  }

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "EspData"));
    setIsValueLoading(false);
    querySnapshot.forEach((doc) => {
      data = doc.data();
      setValues({
        ...data,
      });
    });
  };

  useEffect(() => {
    getData();
    const fetchData = setInterval(() => {
      getData();
    }, 30000);

    return () => {
      clearInterval(fetchData);
    };
  }, []);

  if (isValueLoading) {
    return (
      <VStack
        space={"2"}
        p={"4"}
        alignItems={"start"}
        justifyItems={"start"}
        mt={"20"}
      >
        <Text fontWeight={"bold"} fontSize={"xl"}>
          Loading data please wait
        </Text>
      </VStack>
    );
  }

  return (
    <VStack
      space={"2"}
      p={"4"}
      alignItems={"start"}
      justifyItems={"start"}
      mt={"20"}
      mb={"10"}
    >
      <Text fontWeight={"bold"} fontSize={"xl"}>
        Welcome to Cropify!
      </Text>

      <HStack justifyContent={"space-between"}>
        <VStack
          space={2}
          p={2}
          borderColor={"gray.300"}
          borderWidth={1}
          rounded={"md"}
        >
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {values.Temperature + "°C"}
          </Text>
          <Text>Temperature</Text>
        </VStack>
        <VStack
          space={2}
          p={2}
          borderColor={"gray.300"}
          borderWidth={1}
          rounded={"md"}
        >
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {values.Humidity + "%"}
          </Text>
          <Text>Humidity</Text>
        </VStack>
        <VStack
          space={2}
          p={2}
          borderColor={"gray.300"}
          borderWidth={1}
          rounded={"md"}
        >
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {values.SoliMoisture + ""}
          </Text>
          <Text>SoliMoisture</Text>
        </VStack>
      </HStack>

      <Button
        onPress={run}
        isLoading={!generativeDataLoaded}
        colorScheme={"green"}
      >
        Get crop recommendation
      </Button>

      <Divider />

      {generativeData && (
        <ScrollView contentInsetAdjustmentBehavior="automatic" h="70%">
          <Markdown>{generativeData}</Markdown>
        </ScrollView>
      )}
    </VStack>
  );
};

export default RenderData;
