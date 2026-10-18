import { Component, onMounted, onWillUnmount } from "@odoo/owl";
import { browser } from "@web/core/browser/browser";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { standardActionServiceProps } from "@web/webclient/actions/action_service";
import { computeAppsAndMenuItems } from "@web/webclient/menus/menu_helpers";

export class CustomWebAppLauncher extends Component {
    static template = "custom_web_app_launcher.AppLauncher";
    static props = {
        ...standardActionServiceProps,
        action: { type: Object, optional: true },
        close: { type: Function, optional: true },
        dismiss: { type: Function, optional: true },
    };

    setup() {
        this.menuService = useService("menu");

        onMounted(() => {
            document.querySelector(".o_web_client")?.classList.add("o_custom_app_launcher_open");
        });
        onWillUnmount(() => {
            document.querySelector(".o_web_client")?.classList.remove("o_custom_app_launcher_open");
        });
    }

    get apps() {
        return computeAppsAndMenuItems(this.menuService.getMenuAsTree("root")).apps;
    }

    async openApp(app) {
        // selectMenu navigates to the app, which REPLACES the launcher action;
        // the launcher stays visible until it resolves, so no previously-open
        // view ever flashes. (dismiss is only present in legacy overlay mode.)
        try {
            await this.menuService.selectMenu(app.id);
        } finally {
            this.props.dismiss?.();
        }
    }

    goBack() {
        // Overlay mode: close the overlay. Action mode (the launcher is a real
        // URL-addressable action): step back to the previously-open app.
        if (this.props.close) {
            this.props.close();
        } else {
            browser.history.back();
        }
    }
}

registry.category("actions").add("custom_web_app_launcher.app_launcher", CustomWebAppLauncher);
