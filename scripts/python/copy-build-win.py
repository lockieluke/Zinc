import os
from pathlib import Path
import shutil

def copytree(src: str, dst: str, symlinks:bool=False, ignore:bool=None):
    print("Copying build to builds folder...")
    index: int = 0
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        print("Copied " + str(index))
        if os.path.isdir(s):
            shutil.copytree(s, d, symlinks, ignore)
            index += 1
        else:
            shutil.copy2(s, d)
            index += 1
        pass
    pass
pass

buildpath = Path.joinpath(Path(os.getcwd()).parent, 'Zinc-win32-x64')

os.mkdir('../builds/Zinc-win32-x64')
copytree(buildpath, Path.joinpath(Path(os.getcwd()).parent, 'builds', 'Zinc-win32-x64'))

stream = os.popen('cd .. && rmdir Zinc-win32-x64 /S /Q')
output = stream.read()
print(output)
print("Removed old build")
print("Finished Building")