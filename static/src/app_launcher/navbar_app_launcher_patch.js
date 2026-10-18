import { patch } from "@web/core/utils/patch";
import { NavBar } from "@web/webclient/navbar/navbar";

patch(NavBar.prototype, {
    /**
     * The stock Odoo 19 community navbar opens a compact dropdown from the
     * desktop Apps icon. Route that icon to the full-screen launcher instead.
     *
     * The launcher is opened as a client ACTION (not a transient in-memory
     * overlay) so that its state lives in the URL / browser history: refreshing
     * the page while the launcher is open re-opens the launcher, rather than the
     * app that happened to be open before it. Odoo's menu service stays the
     * source of the app list.
     */
    openCustomAppLauncher() {
        this._closeAppMenuSidebar();
        this.env.services.action.doAction("custom_web_app_launcher.action_app_launcher");
    },
});
