#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "time.h"

// I2C LCD Settings
#define LCD_I2C_ADDRESS 0x27
LiquidCrystal_I2C lcd(LCD_I2C_ADDRESS, 16, 2);

// WiFi and Firebase credentials
#define WIFI_SSID "Home"
#define WIFI_PASSWORD "CXCJ@050217"
#define API_KEY "AIzaSyBdNOR_Ef9X4z8besQSUEZLpMK7MUJnaQU"
#define DATABASE_URL "https://bantaybaha-a979c-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define USER_EMAIL "carljoshualepaopao18@gmail.com"
#define USER_PASSWORD "Lepaopao1437"

// Sensor and I2C pins
const int TRIGGER_PIN = 17;
const int ECHO_PIN = 16;
const int I2C_SDA = 25;
const int I2C_SCL = 26;

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// NTP server settings
const char *ntpServer1 = "pool.ntp.org";
const char *ntpServer2 = "time.nist.gov";
const long gmtOffset_sec = 8 * 3600; // UTC+8
const int daylightOffset_sec = 0;

// Container height in feet
const float H_CONTAINER_FEET = 60.96;

// Function to measure distance
float measureDistanceCm() {
  digitalWrite(TRIGGER_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIGGER_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGGER_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  float distanceCm = (duration / 2.0) * 0.0343; // Calculate distance in centimeters
  return distanceCm;  
}

// Function to calculate water level
float calculateWaterLevel(float distanceFeet) {
  float waterLevel = H_CONTAINER_FEET - distanceFeet;
  if (waterLevel < 0) {
    waterLevel = 0;
  }
  return waterLevel;
}

// Function to get formatted date-time
void printLocalTime(String &formattedTime) {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("No time available (yet)");
    formattedTime = "Unavailable";
    return;
  }
  char buffer[20];
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo);
  formattedTime = String(buffer);
}

// Function to update LCD
void updateLCD(float waterLevelCM, const String &formattedTime) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(formattedTime); // Display date and time
  lcd.setCursor(0, 1);
  lcd.print("WaterLevel:");
  lcd.print(waterLevelCM, 2);
  lcd.print("cm");
}

// Function to connect to WiFi
void connectToWiFi() {
  Serial.print("Connecting to Wi-Fi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nConnected to Wi-Fi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

// Function to initialize Firebase
void initializeFirebase() {
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectNetwork(true);
}


// Function to update Firebase
void updateFirebase(const String &sensorPath, const String &historyPath, float waterLevelCM, const String &formattedTime) {
  if (Firebase.setFloat(fbdo, sensorPath, waterLevelCM)) {
    Serial.println("Sensor data updated successfully");
  } else {
    Serial.println("Failed to update sensor data");
  }

  if (Firebase.setFloat(fbdo, historyPath, waterLevelCM)) {
    Serial.println("History data updated successfully");
  } else {
    Serial.println("Failed to update history data");
  }
}

void setup() {
  Serial.begin(115200);

  // Initialize I2C and LCD
  Wire.begin(I2C_SDA, I2C_SCL);
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.print("BANTAYBAHA READY!");
  lcd.setCursor(0, 1);
  lcd.print("Initializing...");

  // Initialize other components
  connectToWiFi();
  initializeFirebase();
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer1, ntpServer2);

  // Initialize sensor pins
  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  // Get measurements
  float distanceFeet = measureDistanceCm();
  float waterLevelCM = calculateWaterLevel(distanceFeet);

  // Get formatted date and time
  String formattedTime;
  printLocalTime(formattedTime);

  // Update LCD
  updateLCD(waterLevelCM, formattedTime);

  // Update Firebase
  String sensorPath = "/sensors/1/reading";
  String historyPath = "/history/Cebu Roosevelt Memorial Colleges/" + formattedTime;
  updateFirebase(sensorPath, historyPath, waterLevelCM, formattedTime);

  Serial.printf("Distance: %.2f cm\n", distanceFeet);
  Serial.printf("Water Level: %.2f cm\n", waterLevelCM);
  Serial.print("Timestamp: ");
  Serial.println(formattedTime);

  delay(1000); // Delay for 1 second
}
