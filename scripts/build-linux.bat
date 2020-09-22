echo Building for Linux x64
cd ..
call electron-packager . Zinc --platform=linux --arch=x64 --asar --prune --icon="C:\Users\sherl\Documents\Proj\JavaScript\webby\artwork\Zinc.ico"
echo Finished Building
echo Copying build to builds folder
cd scripts

reg query "hkcu\software\Python"  
if ERRORLEVEL 1 GOTO NOPYTHON  
goto :HASPYTHON  
:NOPYTHON  
echo Please Install Python before proceeding && exit

:HASPYTHON  
call py python/copy-build-linux.py