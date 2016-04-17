#!/bin/bash

for i in `xfconf-query --channel xfce4-desktop --list | grep last-image`;
do
    echo  $i:`xfconf-query --channel xfce4-desktop --property $i`
done

echo "Current Workspace:"
wmctrl -d | grep \* | cut -d' ' -f1

