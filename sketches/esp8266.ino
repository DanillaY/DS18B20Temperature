
//Comment out the Serial function usage when uploading the code to the esp8266

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define SERVER_IP "192.168.1.1:3210"
#define ONE_WIRE_BUS D4
#define ANALOG_VOLTAGE_PIN A0

#define STASSID "ssid"
#define STAPSK "password"

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

const unsigned short int sleepMinute = 60000;
const unsigned long sleepDurationMinute = sleepMinute * 30;

void setup() {
  Serial.begin(115200);
  sensors.begin();
}

void loop() {

	sensors.requestTemperatures();
	float tempC = sensors.getTempCByIndex(0);
	String jsonTemperature = "{\"temperature\": " + String(tempC) + "}";
	sendPostRequest(String("/addTempToDB/"),jsonTemperature);

	int adcValue = analogRead(ANALOG_VOLTAGE_PIN);
    float voltageA0 = adcValue * (3.3 / 1023.0);
	String jsonVoltage = "{\"currentVoltage\": " + String(voltageA0) + "}";
	sendPostRequest(String("/currentVoltage/"),jsonVoltage);

	delay(sleepDurationMinute);

}

void sendPostRequest(String api_path,String jsonResult) {
	WiFi.forceSleepWake();
	delay(1);
	connectToWifi();
	
	if ((WiFi.status() == WL_CONNECTED)) {

		WiFiClient client;
		HTTPClient http;

		//http.begin(client, "http://" SERVER_IP "/addTempToDB/");
		http.begin(client, "http://" SERVER_IP api_path);
		http.addHeader("Content-Type", "application/json");

		Serial.print("[HTTP] POST...\n");
		int httpCode = http.POST(jsonResult);

		if (httpCode == HTTP_CODE_OK) {

			const String& payload = http.getString();
			Serial.println("received payload: "+ payload);

		} else {
		Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
		}

		http.end();
	}

	//ESP.deepSleep(sleepDurationMicroseconds); use this instead of the code below if your esp has the correct deep sleep functions
	WiFi.disconnect();
	WiFi.forceSleepBegin();
}

void connectToWifi() {
  WiFi.begin(STASSID, STAPSK);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
}
