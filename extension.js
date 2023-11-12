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

export default class FirefoxPIPExtension extends Extension {
  /** @param {Meta.Window} window */
  static isPiP(window) {
    let locale = GLib.spawn_command_line_sync('/bin/bash -c "locale | grep LANG | cut -d\'=\' -f 2 | cut -d\'.\' -f 1"')[1];
    switch (locale) {
        case : 'ru_RU':
            return window.get_title() === 'Картинка в картинке';
            break;
        default: 
            return window.get_title() === 'Picture-in-picture';
            break;
    }
  }

  listenerId = 0;

  enable() {
    this.listenerId = global.display.connect('window-created', (_, window) =>
      window.get_compositor_private().connect('realize', () =>
        void this.onCreated(window)));
  }

  disable() {
    global.display.disconnect(this.listenerId);
  }

  /**
   * @param {Meta.Window} window
   */
  onCreated(window) {
    if (FirefoxPIPExtension.isPiP(window)) {
      window.make_above();
      window.stick();
    }
  }
}

