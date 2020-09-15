reg query "hkcu\software\Python"  
if ERRORLEVEL 1 GOTO NOPYTHON  
goto :HASPYTHON  
:NOPYTHON  
echo Please Install Python before proceeding && exit

:HASPYTHON  
call py python/install-dep.py