import smtplib
from datetime import datetime
import time
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO

GPIO.cleanup()

# Set the mode of numbering the pins.
GPIO.setmode(GPIO.BCM)
#GPIO pin 5 is the LED output.
GPIO.setup(5, GPIO.OUT)
#GPIO pin 4 is the Button input.
GPIO.setup(17, GPIO.IN)

def getDetails():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def publish_mqtt_msg():
    msg = "DOOR OPEN @ " + getDetails()
    mqttc.publish("security",msg)
    print(msg)


mqtt_broker = "Pedros-MacBook-Pro.local"
door_status = False # false -> close true -> open

mqttc = mqtt.Client("BedroomDoor")
mqttc.connect (mqtt_broker, 1883)
mqttc.publish ("security","Conection established from Raspi")

#mqttc.loop_forever()

try:
    while True:
        if GPIO.input(17)== 0:
            if door_status == False:
                publish_mqtt_msg()
                door_status = True
                GPIO.output(5,1)
            else:
                print("Door is Open")
        else:
            door_status = False
            GPIO.output(5,0)

        time.sleep(0.2)

except KeyboardInterrupt:
    GPIO.cleanup()

