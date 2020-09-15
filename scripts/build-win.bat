echo Building for Windows x64
cd ..
call electron-packager . Webby --platform=win32 --arch=x64
echo Finished Building
echo Copying build to builds folder
cd scripts

reg query "hkcu\software\Python"  
if ERRORLEVEL 1 GOTO NOPYTHON  
goto :HASPYTHON  
:NOPYTHON  
echo Please Install Python before proceeding && exit

:HASPYTHON  
call py python/copy-build-win.py