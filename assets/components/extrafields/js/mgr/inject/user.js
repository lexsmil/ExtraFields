Ext.ComponentMgr.onAvailable('modx-user-tabs', function() {
    let tabs = this.items;
    let fields = [];

    tabs.forEach((tab, tab_index) => {
        ExtraFields.fields.forEach(field => {
            if (fields.includes(field.id)) return;

            let issetField = false;
            field.abs.forEach(abs => {
                if (issetField) return;
                let areas = abs.areas.split('_');
                if (!Ext.isEmpty(abs.areas) && areas.length == 1 && tab_index == areas[0]) {
                    if (ExtraFields.utils.checkAbs(abs)) return;
                    field = Object.assign(field, abs);
                    if (tab_index) field.cls = 'main-wrapper';
                    tab.items.splice(abs.index, 0, ExtraFields.utils.getXtype(field));
                    if (!fields.includes(field.id)) {
                        fields.push(field.id);
                    }
                    issetField = true;
                }
            });

            if (issetField || !tab.items) return;
            let columns = tab.items[0];
            if (columns.layout != 'column') return;
            columns.items.forEach((column, column_index) => {
                field.abs.forEach(abs => {
                    if (issetField) return;
                    let areas = abs.areas.split('_');
                    if (areas.length == 1) return;
                    if (tab_index != areas[0] || column_index != areas[1]) return;
                    if (!Ext.isEmpty(abs.areas)) {
                        if (ExtraFields.utils.checkAbs(abs)) return;
                        field = Object.assign(field, abs);
                        column.items.splice(abs.index, 0, ExtraFields.utils.getXtype(field));
                        if (!fields.includes(field.id)) {
                            fields.push(field.id);
                        }
                        issetField = true;
                    }
                });

            });
        });
    });

    ExtraFields.tabs.forEach(tab => {
        if (ExtraFields.utils.checkAbs(tab)) return;

        let items = [];
        if (tab.categories.length) {
            let categories = [];
            tab.categories.forEach(category => {
                if (ExtraFields.utils.checkAbs(category)) return;

                let c_items = [];
                if (category.description) {
                    c_items.push({
                        html: category.description,
                        cls: 'panel-desc ef-panel-desc',
                    });
                }

                ExtraFields.fields.forEach(field => {
                    if (fields.includes(field.id)) return;
                    let issetField = false;
                    field.abs.forEach(abs => {
                        if (issetField) return;
                        if (tab.id == abs.tab_id && category.id == abs.category_id) {
                            if (ExtraFields.utils.checkAbs(abs)) return;
                            field = Object.assign(field, abs);
                            c_items.push(ExtraFields.utils.getXtype(field));
                            if (!fields.includes(field.id)) {
                                fields.push(field.id);
                            }
                            issetField = true;
                        }
                    });
                });

                categories.push({
                    title: category.name,
                    layout: 'anchor',
                    items: c_items
                });
            });
            items = [{
                xtype: 'modx-vtabs',
                items: categories
            }]
        } else {
            ExtraFields.fields.forEach((field, index) => {
                if (fields.includes(field.id)) return;
                let issetField = false;
                field.abs.forEach(abs => {
                    if (issetField) return;
                    if (tab.id == abs.tab_id) {
                        if (ExtraFields.utils.checkAbs(abs)) return;
                        field = Object.assign(field, abs);
                        items.push(ExtraFields.utils.getXtype(field));
                        if (!fields.includes(field.id)) {
                            fields.push(field.id);
                        }
                        issetField = true;
                    }
                });
            });
            items = [{
                layout: 'form',
                labelAlign: 'top',
                width: '100%',
                items: items
            }];
        }

        tabs.splice(tab.index, 0, {
            title: tab.name,
            layout: 'form',
            bodyCssClass: 'main-wrapper',
            cls: 'modx-extrafields-tab extrafields-' + (tab.categories.length ? 'vtabs' : 'tab'),
            id: 'modx-extrafields-tab-' + tab.id,
            hideMode: 'offsets',
            items: items
        });

    });
});