/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

import _GLib from 'gi://GLib';
/** @type {import('@girs/glib-2.0')} */
const GLib = _GLib;

import { locales } from './lib/locales.js';

export default class FirefoxPIPExtension extends Extension {
  /** @param {import('@girs/meta-13').Window} window */
  static isPiP(window) {
    if (window.get_wm_class().match(/firefox/) || window.get_sandboxed_app_id().match(/firefox/)) {
      const title = window.get_title();
      for (const lang of GLib.get_language_names())
        if (title === locales.get(lang))
          return true;
    }
    return false;
  }

  listenerId = 0;

  enable() {
    this._settings = this.getSettings();

    this.listenerId = global.display.connect('window-created', (_, window) =>
      window.get_compositor_private().connect('realize', () =>
        void this.onCreated(window)));
  }

  disable() {
    global.display.disconnect(this.listenerId);
  }

  /** @param {import('@girs/meta-13').Window} window */
  onCreated(window) {
    if (FirefoxPIPExtension.isPiP(window)) {
      window.raise_and_make_recent();

      if (this._settings.get_boolean("remember-position")) {
        window.connect('unmanaged', () => {
          this.onClosed(window);
        });

        window.move_frame(false, this._settings.get_uint("saved-position-x"), this._settings.get_uint("saved-position-y"));
      }
      else if (this._settings.get_boolean("enable-custom-position")) {
        window.move_frame(false, this._settings.get_uint("custom-position-x"), this._settings.get_uint("custom-position-y"));
      }

      if (this._settings.get_boolean("always-on-top")) {
        window.make_above();
      }
      if (this._settings.get_boolean("always-on-visible-workspace")) {
        window.stick();
      }
    }
  }

  /** @param {import('@girs/meta-13').Window} window */
  onClosed(window) {
    this._settings.set_uint("saved-position-x", window.get_frame_rect().x);
    this._settings.set_uint("saved-position-y", window.get_frame_rect().y);
  }
}

