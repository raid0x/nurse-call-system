/*
 * Project controlCenter
 * Description: Firmware for the control center of nurse call system.
 * Author: Raidox
 * Date: September 15, 2018
 */

 // Prevents device from automatically trying to connect to the particle cloud.
 SYSTEM_MODE(MANUAL);

#include "Spark-Websockets.h"

WebSocketClient client;

const char* server = "<SERVER_IP_HERE>";

// Buttons------------------------
const int redButton = D0;
const int greenButton = D1;
const int blueButton = D2;
const int whiteButton = D3;

// LEDs---------------------------
const int redLED = D7;
const int greenLED = D6;
const int blueLED = D5;
const int whiteLED = D4;

bool redButtonPressed = false;
bool greenButtonPressed = false;
bool blueButtonPressed = false;
bool whiteButtonPressed = false;

void activated(char* device, uint8_t state = HIGH) {
  if (strcmp(device ,"red") == 0) {
    digitalWrite(redLED, state);
  } else if (strcmp(device, "green") == 0) {
    digitalWrite(greenLED, state);
  } else if (strcmp(device, "blue") == 0) {
    digitalWrite(blueLED, state);
  }
}

void deactivated(char* device) {
  activated(device, LOW);
  digitalWrite(whiteLED, LOW);
}

void onMessage (WebSocketClient client, char* message) {
  char* command;
  char* device;

  command = strtok(message, " ");
  device = strtok(NULL, " ");

  if (strcmp(command, "activated") == 0) {
    activated(device);
  } else if (strcmp(command, "deactivated") == 0) {
    deactivated(device);
  }
}

void setupComplete() {
  digitalWrite(redLED, HIGH);
  digitalWrite(greenLED, HIGH);
  digitalWrite(blueLED, HIGH);
  digitalWrite(whiteLED, HIGH);
  delay(1000);
  digitalWrite(redLED, LOW);
  digitalWrite(greenLED, LOW);
  digitalWrite(blueLED, LOW);
  digitalWrite(whiteLED, LOW);
}

void setup () {
  //Serial.begin(9600);

  pinMode(redButton, INPUT);
  pinMode(greenButton, INPUT);
  pinMode(blueButton, INPUT);
  pinMode(whiteButton, INPUT);

  pinMode(redLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
  pinMode(blueLED, OUTPUT);
  pinMode(whiteLED, OUTPUT);

  digitalWrite(redLED, LOW);
  digitalWrite(greenLED, LOW);
  digitalWrite(blueLED, LOW);
  digitalWrite(whiteLED, LOW);

  client.onMessage(onMessage);
  client.connect(server, 3000);

  setupComplete();
}

void loop () {
  client.monitor();

  if (digitalRead(redButton) == HIGH) {
    redButtonPressed = true;
  }

  if (redButtonPressed && digitalRead(redButton) == LOW) {
    client.send("activate red");
    redButtonPressed = false;
  }

  if (digitalRead(greenButton) == HIGH) {
    greenButtonPressed = true;
  }

  if (greenButtonPressed && digitalRead(greenButton) == LOW) {
    client.send("activate green");
    greenButtonPressed = false;
  }

  if (digitalRead(blueButton) == HIGH) {
    blueButtonPressed = true;
  }

  if (blueButtonPressed && digitalRead(blueButton) == LOW) {
    client.send("activate blue");
    blueButtonPressed = false;
  }

  if (digitalRead(whiteButton) == HIGH) {
    whiteButtonPressed = true;
  }

  if (whiteButtonPressed && digitalRead(whiteButton) == LOW) {
    client.send("activate white");
    whiteButtonPressed = false;
  }

  if (digitalRead(redLED) == HIGH && digitalRead(greenLED) == HIGH && digitalRead(blueLED) == HIGH) {
    digitalWrite(whiteLED, HIGH);
  }
}
