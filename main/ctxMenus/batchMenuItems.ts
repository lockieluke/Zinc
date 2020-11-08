export default function addMenuItems(menu: Electron.Menu, menuItems: Electron.MenuItem[]) {
    for (let i = 0; i < menuItems.length; i++) {
        menu.append(menuItems[i]);
    }
}