#!/bin/bash

yes_no_validate() {
    message="$1"
    default="$2"
    while true; do
        read -p "$message" input
        input=$(echo "$input" | tr '[:upper:]' '[:lower:]')
        if [[ -z "$input" ]]; then
            input="$default"
            break
        elif [[ "$input" == "s" || "$input" == "si" ]]; then
            input="s"
            break
        elif [[ "$input" == "n" || "$input" == "no" ]]; then
            input="n"
            break
        else
            echo "[?] Entrada Invalida."
        fi
    done
    echo $input
}

start_app() {
    source $(find . -type f -name activate | grep .)
    if [ $? -eq "0" ] ; then
        python3 app.py
    else
        echo '[!] No se ha encontrado un entorno virtual!'
        exit 1
    fi
}

echo "[+] Iniciando..."
database=$(find . -type f -name database.db | grep .)
if [ $? -eq "0" ] ; then
    echo "[+] Se ha encontrado una base de datos en \"$database\" continuando..."
else
    echo "[+] No se ha encontrado base de datos, creando una nueva..."
fi
if [ $(yes_no_validate "[!] ¿Desea crear una y llenarla con datos de prueba? [s/N]: " "n") == "s" ]; then
    echo "[+] Iniciando la app y llenando la base de datos..."
    python3 -m DB.fill_database
    start_app
else
    echo "[+] Iniciando la app..."
    start_app
fi