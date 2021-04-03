#!/bin/bash
#Stopping existing node servers
echo "Deteniendo servicios desplegados en NodeJS"
sudo kill -9 $(sudo lsof -t -i:3010)