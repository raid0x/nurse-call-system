/*
 * Project alarm
 * Description: Firmware for the alarms of nurse call system.
 * Author: Raidox
 * Date: September 16, 2018
 */

// Prevents device from automatically trying to connect to the particle cloud.
SYSTEM_MODE(MANUAL);

#include "Spark-Websockets.h"
#include <time.h>

WebSocketClient client;

const char* server = "<SERVER_IP_HERE>";
const char* deviceName = "<DEVICE_NAME_HERE>";
const char* activated = "activated ";
const char* deactivated = "deactivated ";
const int buzzer = D7;

time_t lastDing = time(NULL);

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

  } else if (strcmp(command, "ding") == 0) {

    lastDing = time(NULL);

  }
}

void setup() {
  pinMode(buzzer, OUTPUT);
  digitalWrite(buzzer, LOW);

  client.onMessage(onMessage);
  client.connect(server, 3000);
}

void loop() {
  if (difftime(lastDing, time(NULL)) > (5 * 60)) {
    // Restart device since we haven't heard from the server in over 5 minutes.
    System.reset();
  }

  client.monitor();
}
