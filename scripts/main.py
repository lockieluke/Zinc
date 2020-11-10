import os
import os.path
import shutil
import time
from colorama import Fore, Style, init
from consolemenu import *
from consolemenu.items import *
import subprocess

init(convert=True)
menu = ConsoleMenu(Fore.GREEN + "Welcome to Zinc Development Script - Make Zinc Development easier!" + Fore.RESET, "", exit_option_text="Quit")

def cleanUp():
    global menu
    menu.clear_screen()
    print("Cleaning scripts...")
    for file_name in os.listdir(os.getcwd()):
        currentHandlingFile: str = os.path.join(os.getcwd(), file_name)
        if (file_name != "main.py"):
            os.remove(currentHandlingFile)
            pass
    pass
    pass

def build():
    global menu
    clear_terminal()
    print(os.popen('cd ' + os.getcwd() + ' && ' + 'py build.py').readline())
    exit()
    pass

def redownloadScripts():
    downloadCachePath: str = os.path.join(os.getcwd(), "download-cache")
    os.popen('rmdir ' + downloadCachePath + " /s /q")
    print("Downloading Zinc Development Scripts...")
    print(os.popen('git clone https://www.github.com/lockieluke/ZincScripts.git ' + downloadCachePath).readline())
    for file_name in os.listdir(downloadCachePath):
        currentHandlingFile: str = os.path.join(downloadCachePath, file_name)
        if file_name not in (".git", ".gitignore", "README.md"):
            shutil.move(currentHandlingFile, os.getcwd())
            print("Unpacking " + file_name)
        pass
    pass
    print("Finished unpacking all files...")
    os.popen('rmdir ' + downloadCachePath + " /s /q")
    print("Run this script again to open the developer menu")
    pass
pass

def updateScripts():
    cleanUp()
    redownloadScripts()
    pass

if (len([name for name in os.listdir('.') if os.path.isfile(name)]) == 1):
    redownloadScripts()
else:
    cleanMenu: MenuItem = MenuItem("Clean Scripts", menu=menu, should_exit=True)
    cleanMenu.action = cleanUp
    buildMenu: MenuItem = MenuItem("Build Zinc", menu=menu, should_exit=True)
    buildMenu.action = build
    updateMenu: MenuItem = MenuItem("Update Scripts", menu=menu, should_exit=True)
    updateMenu.action = updateScripts
    menu.append_item(buildMenu)
    menu.append_item(cleanMenu)
    menu.append_item(updateMenu)
    menu.show()
    pass