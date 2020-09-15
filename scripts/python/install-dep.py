import os

print("Checking for package.json")
prevdir = os.listdir('../')
for dir in prevdir:
    if (dir == 'package.json'):
        print("Found package.json")
        break
    pass
pass

print("Installing Dependencies...")
stream = os.popen('cd .. && npm install')
output = stream.read()
print(output)
print("Installed Dependencies")
print("Checking Dependencies...")
node_dir = os.listdir('../node_modules')
for dir in node_dir:
    if (dir != 'bin'):
        print("Found " + dir + "module")
        pass
    pass
pass

print("Installing electron-packager for exporting the application...")
stream = os.popen('cd .. && npm install electron-packager -g')
output = stream.read()
print(output)

print("Finished")