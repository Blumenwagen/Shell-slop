import QtQuick

Rectangle {
    required property bool hovered
    required property bool pressed
    color: pressed ? "#33ffffff" : hovered ? "#1fffffff" : "transparent"
    Behavior on color { ColorAnimation { duration: 120 } }
}
