import Quickshell
import QtQuick

ShellRoot {
    Variants {
        model: Quickshell.screens

        PanelWindow {
            required property ShellScreen modelData
            screen: modelData
            anchors {
                top: true
                left: true
                right: true
            }
            implicitHeight: 42
            color: "transparent"

            Rectangle {
                anchors.fill: parent
                color: "#211a2d"
                radius: 14

                Text {
                    anchors.centerIn: parent
                    color: "#f7f2ff"
                    text: "My living shell"
                }
            }
        }
    }
}
