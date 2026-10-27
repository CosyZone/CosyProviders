/**
 * Layout Provider — 布局契约 + 默认实现。
 */
import { createContribution, defineProviderToken, } from "@coffic/cosy-kernel";
export const LayoutProvidingToken = defineProviderToken("site.layout");
const DEFAULT_ORDER = 200;
/**
 * 布局契约默认宿主实现：聚合各插件注入的具名布局与区域视图。
 *
 * 由组合根（factory 的 registerProviders）注册，而非某个业务插件。
 */
export class DefaultLayoutProvider {
    layoutsByID = new Map();
    viewsByRegion = new Map();
    registerLayout(ownerPluginID, layout) {
        if (this.layoutsByID.has(layout.id)) {
            throw new Error(`Duplicate layout '${layout.id}'`);
        }
        this.layoutsByID.set(layout.id, {
            id: layout.id,
            component: layout.component,
            order: layout.order ?? DEFAULT_ORDER,
        });
        return createContribution(ownerPluginID, () => {
            if (this.layoutsByID.get(layout.id)?.component !== layout.component) {
                return;
            }
            this.layoutsByID.delete(layout.id);
        });
    }
    getLayout(id) {
        const layout = this.layoutsByID.get(id);
        if (!layout) {
            throw new Error(`Layout '${id}' is not registered`);
        }
        return layout;
    }
    hasLayout(id) {
        return this.layoutsByID.has(id);
    }
    layouts() {
        return [...this.layoutsByID.values()].sort((left, right) => (left.order ?? DEFAULT_ORDER) - (right.order ?? DEFAULT_ORDER));
    }
    register(ownerPluginID, region, view) {
        const views = this.viewsByRegion.get(region) ?? [];
        if (views.some((existing) => existing.id === view.id)) {
            throw new Error(`Duplicate layout view '${view.id}' in '${region}'`);
        }
        views.push({
            id: view.id,
            component: view.component,
            order: view.order ?? DEFAULT_ORDER,
        });
        this.viewsByRegion.set(region, views);
        return createContribution(ownerPluginID, () => {
            const current = this.viewsByRegion.get(region);
            if (!current)
                return;
            const remaining = current.filter((existing) => existing.id !== view.id);
            if (remaining.length === 0) {
                this.viewsByRegion.delete(region);
            }
            else {
                this.viewsByRegion.set(region, remaining);
            }
        });
    }
    views(region) {
        return (this.viewsByRegion.get(region) ?? [])
            .slice()
            .sort((a, b) => (a.order ?? DEFAULT_ORDER) - (b.order ?? DEFAULT_ORDER));
    }
}
//# sourceMappingURL=layout.js.map