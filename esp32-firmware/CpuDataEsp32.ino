#include <WiFi.h>
#include <HTTPClient.h>

// Replace these with your network credentials
const char* ssid = "<EDIT YOUR SSID>";
const char* password = "<YOUR PASSWORD>";

// Backend URL (your backend's IP or domain name) 
const char* backendUrl = "http://192.168.1.31:3000/cpu-data";  // Update with your actual backend URL

// CPU Data function (mock CPU temperature data for PoC)
float getCpuTemperature() {
    return random(40, 80);  // Mock temperature between 40 and 80 degrees Celsius
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Create JSON payload with CPU data
    float temperature = getCpuTemperature();
    String payload = "{\"cpuTemperature\":" + String(temperature) + "}";

    // Send HTTP POST request to backend
    http.begin(backendUrl);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Response from server: " + response);
    } else {
      Serial.println("Error on sending POST: " + String(httpResponseCode));
    }

    http.end();
  }

  delay(300000);  // 5 minutes = 300000 milliseconds
}
