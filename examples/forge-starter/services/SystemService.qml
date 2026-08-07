pragma Singleton

import QtQuick

QtObject {
    readonly property bool ready: true
    readonly property string status: ready ? "ready" : "unavailable"
}
