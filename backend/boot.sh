#!/bin/bash

make_post() {
    JSON=$1
    URL=$2
    cat "$JSON" | jq -c '.[]' | while read object; do
        curl -X POST --location "$URL" -H 'Content-Type: application/json' -d "$object" 0&>/dev/null
    done
}

fill_database() {
    USERS_JSON="./DB/test-data/users.json"
    BOOKS_JSON="./DB/test-data/books.json"
    AUTHORS_JSON="./DB/test-data/authors.json"
    VALORATIONS_JSON="./DB/test-data/valorations.json"

    API_PORT=$(head -n 1 .env | awk '{ print $4 }' | sed "s/'//g")

    URL_API="http://127.0.0.1:$API_PORT"
    
    echo "[+] Espera 8 segundos para la carga de datos mientras inicia el server..."
    sleep 8
    
    # Fill users table with auth and mail sender
    make_post "$USERS_JSON" "$URL_API/auth/register"
    # Fill users table with normal post method (now is commented)
    # make_post "$USERS_JSON" "$URL_API/users"
    # Fill author table
    make_post "$AUTHORS_JSON" "$URL_API/authors"
    # Fill books table
    make_post "$BOOKS_JSON" "$URL_API/books"
    # Fill valorations table
    make_post "$VALORATIONS_JSON" "$URL_API/valorations"

}

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
            echo "[?] Invalid Input"
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
    echo "[+] Se ha encontrado una base de datos en \"$database\" - ¿Desea llenarla con datos de prueba?"
else
    echo "[+] No se ha encontrado base de datos ¿Desea crear una y llenarla con datos de prueba?"
fi
if [ $(yes_no_validate "[!] Cuidado, va a cargar datos falsos en la base de datos! [S/n]: " "s") == "s" ]; then
    echo "[+] Iniciando la app y llenando la base de datos..."
    (fill_database) &
    start_app
else
    echo "[+] Iniciando la app..."
    start_app
fi