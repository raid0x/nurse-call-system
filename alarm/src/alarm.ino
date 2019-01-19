/*
 * Project alarm
 * Description: Firmware for the alarms of nurse call system.
 * Author: Raidox
 * Date: September 16, 2018
 */

#include "Spark-Websockets.h"

WebSocketClient client;

const char* server = "<SERVER_IP_HERE>";
const char* deviceName = "<DEVICE_NAME_HERE>";
const char* activated = "activated ";
const char* deactivated = "deactivated ";
const int buzzer = D7;

void onMessage (WebSocketClient client, char* message) {
  char* command;
  char* device;

  command = strtok(message, " ");
  device = strtok(NULL, " ");

  if (strcmp(command, "activate") == 0 && (strcmp(device, deviceName) == 0 || strcmp(device, "white") == 0)) {

    digitalWrite(buzzer, HIGH);

    char newMessage[20];
    strcpy(newMessage, activated);
    strcat(newMessage, deviceName);

    client.send(newMessage);

  } else if (strcmp(command, "deactivate") == 0) {

    digitalWrite(buzzer, LOW);

    char newMessage[20];
    strcpy(newMessage, deactivated);
    strcat(newMessage, deviceName);

    client.send(newMessage);

  }
}

void setup() {
  pinMode(buzzer, OUTPUT);
  digitalWrite(buzzer, LOW);

  client.onMessage(onMessage);
  client.connect(server, 3000);
}

void loop() {
  client.monitor();
}
