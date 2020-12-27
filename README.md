# Zinc - A browser that focuses on performance and privacy

Zinc is a browser that focuses on performance and privacy while keeping itself running with low resource usage. The browser is written in TypeScript and it is based on Chromium and Electron framework(not to be scared). _Depending on Electron doesn't mean its performance is bad._

#### Different use case of languages in Zinc

`TypeScript` The language used the most in this browser which is used to make functions and the browser works properly.

`JavaScript` Yes, we are going to ditch JavaScript in this browser. The language is used to make things in pages like
New Tab work.

`SCSS` SCSS is used to easily styling the UI of this browser.

`HTML` HTML is used to construct most UI page and UI elements are added by TypeScript after page is fully loaded.

`Python` Python is used in Zinc Development Script to make the development much more easier.

`Java` Java is used in Zinc Native which makes some operations even faster and enables Multithreading capability. Native
Communication is conducted with WebSockets.

#### How to install Zinc

Option 1: Using the [Zinc Installer](https://github.com/lockieluke/ZincInstaller)(Currently developing)

Option 2: Downloading Zinc from releases page and extract

#### How to fork Zinc

1. Clone the repository

   ```bash
   git clone --depth=1 https://github.com/lockieluke/Zinc.git
   ```

2. Navigate into the directory

   ```bash
   cd Zinc
   ```

3. Install all dependencies(Zinc has switched to **Yarn** package manager!)

   ```bash
   yarn install
   ```

4. Download OpenJDK 15, and keep `bin` and `lib` folders.

5. Move those two folders into a subdirectory named `java` under `Zinc` project directory

6. Compile SCSS files with `sass`

   ```bash
   sass .
   ```

7. Start Zinc! (It compiles TypeScript files automatically now)

   ```bash
   yarn start
   ```

#### What convince me to use Zinc?

As I said, Zinc focuses on performance and privacy while use only a little portion of your system resources. Zinc manages to use just 80 MB of RAM with 3 tabs opened. Zinc also has exclusive features for different regions.

#### Hey, why are you using Electron for a browser?

Many people said Electron is a horrible framework for desktop applications but no, Zinc proves us wrong. Zinc keeps itself fast while using very little amount of RAM. Therefore, stop bringing complains about Electron here, thank you! Enjoy!

#### Other modules

[Windows GUI Installer for Zinc](https://github.com/lockieluke/ZincInstaller)

[Zinc's Website](https://github.com/lockieluke/ZincWebsite)
