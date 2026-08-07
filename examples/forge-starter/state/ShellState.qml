pragma Singleton

import QtQuick

QtObject {
    property bool drawerOpen: false
    property real drawerProgress: drawerOpen ? 1 : 0
}
