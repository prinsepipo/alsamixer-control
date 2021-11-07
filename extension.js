const {St, Clutter} = imports.gi;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const GLib = imports.gi.GLib;

let pmSwitch;


function init() {
  // `init` will be called first to initialize the extension.
  log("================Alsamixer Control================");

  let alsamixerAutoMuteMode = getAlsamixerAutoMuteMode() === "Enabled";

  pmSwitch = new PopupMenu.PopupSwitchMenuItem("Auto-Mute Mode", alsamixerAutoMuteMode);
  pmSwitch.connect("toggled", (event, enabled) => {
    if (enabled) {
      setAlsamixerAutoMuteMode("Enabled");
    } else {
      setAlsamixerAutoMuteMode("Disabled");
    }
  });

  Main.panel.statusArea.aggregateMenu.menu.addMenuItem(pmSwitch, 1);
}

function enable() {
  // `enable` will be called when user enables the extension.
  pmSwitch.show();
}

function disable() {
  // `disable` will be called when user disables the extension.
  pmSwitch.hide();
}


// Helper Functions

function getAlsamixerAutoMuteMode() {
  let [ok, out, err, exit] = GLib.spawn_command_line_sync("amixer -c 0 get 'Auto-Mute Mode'");

  // An error occurred. So we set a default value for `Auto-Mute Mode`.
  if (!ok) {
    return "Enabled";
  }

  // We got a byte-array so we convert it to string.
  out = new Uint8Array(out);
  out = String.fromCharCode.apply(String, out);

  // We only need the value part of the information returned by amixer command.
  // In this case, `Item0` holds the state of Auto-Mute Mode.
  return out.match(/Item0: '(Enabled|Disabled)'/)[0].replace("Item0: ", "");
}

function setAlsamixerAutoMuteMode(mode) {
  const [ok, out, err, exit] = GLib.spawn_command_line_sync(`amixer -c 0 set 'Auto-Mute Mode' ${mode}`);
}
