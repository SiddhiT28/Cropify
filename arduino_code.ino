
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
// #define FIREBASE_HOST "ioe-mini-project-43c17-default-rtdb.firebaseio.com"
// #define FIREBASE_AUTH "VCsIxXq3pRXPJcLG3wVpHE4m5h8yCEXZb0fhg6IG"
// #define WIFI_SSID "Outcast"
// #define WIFI_PASSWORD "Yadav@123"

// Define DHT sensor parameters
#define DHTPIN D2
#define DHTTYPE DHT11
#define SOIL_MOISTURE_PIN A0  // Analog pin for soil moisture sensor

// Define WiFi credentials
#define WIFI_SSID "Outcast"
#define WIFI_PASSWORD "Yadav@123"

// Define Firebase API Key, Project ID, and user credentials
#define API_KEY "AIzaSyAz2cf9yj45qEP-wroy1Ee_XP1fXM0n5as"
#define FIREBASE_PROJECT_ID "ioe-mini-project-43c17"
#define USER_EMAIL "pyadav5000@gmail.com"
#define USER_PASSWORD "Amigo@123"

// Define Firebase Data object, Firebase authentication, and configuration
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Initialize the DHT sensor
DHT dht(DHTPIN, DHTTYPE);


void setup() {
  // Initialize serial communication for debugging
  Serial.begin(115200);

  // Initialize the DHT sensor
  dht.begin();

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // Print Firebase client version
  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  // Assign the API key
  config.api_key = API_KEY;

  // Assign the user sign-in credentials
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  // Assign the callback function for the long-running token generation task
  config.token_status_callback = tokenStatusCallback;  // see addons/TokenHelper.h

  // Begin Firebase with configuration and authentication
  Firebase.begin(&config, &auth);

  // Reconnect to Wi-Fi if necessary
  Firebase.reconnectWiFi(true);
}

void loop() {
  delay(2000);  // Wait a few seconds between measurements

  // Define the path to the Firestore document
  String documentPath = "EspData/DHT11";

  // Create a FirebaseJson object for storing data
  FirebaseJson content;

  // Read temperature and humidity from the DHT sensor
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Read soil moisture
  int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);
  int dryValue = 1023;  // Replace with your calibrated dry value
  int wetValue = 0;     // Replace with your calibrated wet value
  int soilMoisturePercent = map(soilMoistureRaw, wetValue, dryValue, 100, 0);


  // Print temperature and humidity values
  Serial.println(temperature);
  Serial.println(humidity);
  Serial.println(soilMoisturePercent);

  // Check if the values are valid (not NaN)
  if (!isnan(temperature) && !isnan(humidity)) {
    // Set the 'Temperature', 'Humidity' and 'SoilMoisture' fields in the FirebaseJson object
    content.set("fields/Temperature/stringValue", String(temperature, 2));
    content.set("fields/Humidity/stringValue", String(humidity, 2));
    content.set("fields/SoliMoisture/stringValue", String(soilMoisturePercent, 2));

    Serial.print("Update/Add DHT Data... ");

    // Use the patchDocument method to update the Temperature and Humidity Firestore document
    if (Firebase.Firestore.patchDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), content.raw(), "Temperature") && Firebase.Firestore.patchDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), content.raw(), "Humidity")&& Firebase.Firestore.patchDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), content.raw(), "SoliMoisture")) {
      Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
    } else {
      Serial.println(fbdo.errorReason());
    }
  } else {
    Serial.println("Failed to read DHT data.");
  }

  // Delay before the next reading
  delay(10000);
}
