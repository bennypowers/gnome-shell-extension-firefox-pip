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

/* exported init */

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

/** @param {Meta.Window} window */
function isPiP(window) {
  return window.get_title() === 'Picture-in-Picture';
}

function init() {
  Extension.prototype.log.call(null, 'initializing');
  return new Extension();
}

class Extension {
  /** @param {string} message */
  log(message) {
    log(`firefox-pip: ${message}`);
  }

  enable() {
    this.log('enabling');
    global.display.connect('window-created', (_, window) => void this.onCreated(window));
  }

  disable() {
    this.log('disabling');
  }

  /**
   * @param {Meta.Window} window
   */
  async onCreated(window) {
    // TODO: find out when Meta.Window#get_title() is ready
    await new Promise(r => setTimeout(r, 10));
    if (isPiP(window)) {
      this.log('found PiP!')
      window.make_above();
      window.stick();
    }
  }
}
