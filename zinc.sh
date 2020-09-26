/usr/lib/electron10/electron index.js --enable-transparent-visuals --disable-gpu
if [ "$?" -ne "0" ]; then
	echo "Zinc failed to execute. Zinc requires electron 10."
	echo "Arch: yay -S electron10"
	echo "Deb: sudo apt install electron10"
fi

