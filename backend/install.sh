#!/bin/bash

activate=$(find . -type f -name activate | grep .)

if [ $? -eq "0" ] ; then
    echo '[+] Entorno existente encontrado...'
else
    echo '[+] Creando entorno virtual de nombre env'
    python3 -m venv env
    activate="env/bin/activate"
fi

echo '[+] Activando entorno virtual'
source $activate
echo '[+] Instalando dependencias'
pip3 install -r requirements.txt  &>/dev/null 