#!/bin/bash
#Stopping existing node servers
echo "Deteniendo servicios desplegados en NodeJS"

if [ sudo lsof -t -i:3020 ]; then
  sudo kill -9 $(sudo lsof -t -i:3000) 
else
  echo "Not working"
fi