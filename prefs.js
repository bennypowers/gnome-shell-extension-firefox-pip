import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class FirefoxPIPPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        // Create preferences window
        const page = new Adw.PreferencesPage({
            title: _("General"),
            icon_name: "dialog-information-symbolic",
        });
        window.add(page);

        const general_group = new Adw.PreferencesGroup({
            title: _("General")
        });
        page.add(general_group);

        const always_on_top_row = new Adw.SwitchRow({
            title: _("Always on top")
        });
        general_group.add(always_on_top_row);

        const always_on_visible_workspace_row = new Adw.SwitchRow({
            title: _("Always on visible workspace")
        });
        general_group.add(always_on_visible_workspace_row);

        const position_group = new Adw.PreferencesGroup({
            title: _("Position"),
            description: _("Set initial position of a PIP window")
        });
        page.add(position_group);

        const remember_position_row = new Adw.SwitchRow({
            title: _("Remember position"),
        });
        position_group.add(remember_position_row);

        const custom_position_group = new Adw.PreferencesGroup();
        page.add(custom_position_group);

        const custom_position_row = new Adw.SwitchRow({
            title: _("Use custom position")
        });
        custom_position_group.add(custom_position_row);

        const custom_position_x_row = new Adw.SpinRow({
            title: _("Position x:"),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 8000,
                page_increment: 100,
                step_increment: 1,
            })
        });
        custom_position_group.add(custom_position_x_row);

        const custom_position_y_row = new Adw.SpinRow({
            title: _("Position y:"),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 8000,
                page_increment: 100,
                step_increment: 1,
            })
        });
        custom_position_group.add(custom_position_y_row);

        // Bind settings
        window._settings = this.getSettings();

        window._settings.bind("always-on-top", always_on_top_row,
            "active", Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind("always-on-visible-workspace", always_on_visible_workspace_row,
            "active", Gio.SettingsBindFlags.DEFAULT);

        window._settings.bind("remember-position", remember_position_row,
            "active", Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind("remember-position", custom_position_group,
            "sensitive", Gio.SettingsBindFlags.INVERT_BOOLEAN);

        window._settings.bind("enable-custom-position", custom_position_row,
            "active", Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind("enable-custom-position", custom_position_x_row.get_child(),
            "sensitive", Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind("enable-custom-position", custom_position_y_row.get_child(),
            "sensitive", Gio.SettingsBindFlags.DEFAULT);

        window._settings.bind("custom-position-x", custom_position_x_row,
            "value", Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind("custom-position-y", custom_position_y_row,
            "value", Gio.SettingsBindFlags.DEFAULT);
    }
}