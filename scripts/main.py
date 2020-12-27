import os
import os.path
import shutil
import subprocess
import time

from colorama import Fore, Style, init
from consolemenu import *
from consolemenu.items import *

init(convert=True)
menu = ConsoleMenu(Fore.GREEN + "Welcome to Zinc Development Script - Make Zinc Development easier!" + Fore.RESET, "",
                   exit_option_text="Quit")


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

def runProcess(exe):
    p = subprocess.Popen(exe, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    while True:
        # returns None while subprocess is running
        retcode = p.poll()
        line = p.stdout.readline()
        yield line
        if retcode is not None:
            break


def downloadJdk():
    global menu
    clear_terminal()
    for line in runProcess(('py ' + os.path.join(os.getcwd(), 'jdk.py')).split()):
        print(line)
        pass
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
    print("CWD: " + os.getcwd())
    redownloadScripts()
else:
    cleanMenu: MenuItem = MenuItem("Clean Scripts", menu=menu, should_exit=True)
    cleanMenu.action = cleanUp
    buildMenu: MenuItem = MenuItem("Build Zinc", menu=menu, should_exit=True)
    buildMenu.action = build
    jdkMenu: MenuItem = MenuItem("Download OpenJDK for Zinc Native", menu=menu, should_exit=True)
    jdkMenu.action = downloadJdk
    updateMenu: MenuItem = MenuItem("Update Scripts", menu=menu, should_exit=True)
    updateMenu.action = updateScripts
    menu.append_item(buildMenu)
    menu.append_item(jdkMenu)
    menu.append_item(cleanMenu)
    menu.append_item(updateMenu)
    menu.show()
    pass
