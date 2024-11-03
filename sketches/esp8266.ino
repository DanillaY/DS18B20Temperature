#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define SERVER_IP "192.168.1.1:3210"
#define ONE_WIRE_BUS D4

#define STASSID "ssid"
#define STAPSK "password"


OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {

  Serial.begin(115200);

  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("\nConnected! IP address: ");
  Serial.print(WiFi.localIP());
  sensors.begin();
}

void loop() {

  if ((WiFi.status() == WL_CONNECTED)) {

    WiFiClient client;
    HTTPClient http;

    http.begin(client, "http://" SERVER_IP "/addTempToDB/");  // HTTP
    http.addHeader("Content-Type", "application/json");

    Serial.print("[HTTP] POST...\n");
    sensors.requestTemperatures();
    float tempC = sensors.getTempCByIndex(0);

    String jsonKey = "{\"temperature\": ";
    String jsonResult = jsonKey + tempC + "}";
    int httpCode = http.POST(jsonResult);

    if (httpCode > 0) {

      if (httpCode == HTTP_CODE_OK) {
        const String& payload = http.getString();
        Serial.println("received payload: "+ payload);
      }
    } else {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  }

  delay(1800000); //30 min
}
