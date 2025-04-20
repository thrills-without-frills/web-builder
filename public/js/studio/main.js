const editor = grapesjs.init({
    container: '#wcEditorCanvas',
    fromElement: true,
    width: 'auto',
    height: '100%',
    storageManager: false,
    panels: { defaults: [] },
    layerManager: {
        appendTo: '.layers-container',
    },
    blockManager: {
        appendTo: '#wcEditorBlocks',
        blocks: [
            {
                id: 'section',
                label: '<b>Section</b>',
                attributes: { class: 'gjs-block-section' },
                content: `<section>
              <h1>This is a simple title</h1>
              <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
            </section>`,
            },
            {
                id: 'text',
                label: 'Text',
                content: '<div data-gjs-type="text">Insert your text here</div>',
            },
            {
                id: 'image',
                label: 'Image',
                select: true,
                content: { type: 'image' },
                activate: true,
            },
        ],
    },
    selectorManager: {
        appendTo: '.styles-container',
    },
    styleManager: {
        appendTo: '.styles-container',
        sectors: [
            {
                name: 'Dimension',
                open: false,
                // Use built-in properties
                buildProps: ['width', 'min-height', 'padding'],
                // Use `properties` to define/override single property
                properties: [
                    {
                        // Type of the input,
                        // options: integer | radio | select | color | slider | file | composite | stack
                        type: 'integer',
                        name: 'The width', // Label for the property
                        property: 'width', // CSS property (if buildProps contains it will be extended)
                        units: ['px', '%'], // Units, available only for 'integer' types
                        defaults: 'auto', // Default value
                        min: 0, // Min value, available only for 'integer' types
                    },
                ],
            },
            {
                name: 'Extra',
                open: false,
                buildProps: ['background-color', 'box-shadow', 'custom-prop'],
                properties: [
                    {
                        id: 'custom-prop',
                        name: 'Custom Label',
                        property: 'font-size',
                        type: 'select',
                        defaults: '32px',
                        // List of options, available only for 'select' and 'radio'  types
                        options: [
                            { value: '12px', name: 'Tiny' },
                            { value: '18px', name: 'Medium' },
                            { value: '32px', name: 'Big' },
                        ],
                    },
                ],
            },
        ],
    },
    traitManager: {
        appendTo: '.traits-container',
    },
    deviceManager: {
        devices: [
            {
                name: 'Desktop',
                width: '', // default size
            },
            {
                name: 'Mobile',
                width: '320px', // this value will be used on canvas width
                widthMedia: '480px', // this value will be used in CSS @media
            },
        ],
    },

});

editor.Panels.addPanel({
    id: 'panel-top',
    el: '.panel__top',
});
editor.Panels.addPanel({
    id: 'basic-actions',
    el: '.panel__basic-actions',
    buttons: [
        {
            id: 'visibility',
            active: true,
            className: 'btn-toggle-borders',
            label: '<i class="fa fa-square-dashed"></i>',
            command: 'sw-visibility',
        },
        {
            id: 'export',
            className: 'btn-open-export',
            label: '<i class="fa fa-code"></i>',
            command: 'export-template',
            context: 'export-template',
        },
        {
            id: 'show-json',
            className: 'btn-show-json',
            label: '<i class="fa fa-code"></i>',
            context: 'show-json',
            command(editor) {
                editor.Modal.setTitle('Components JSON')
                    .setContent(
                        `<textarea style="width:100%; height: 250px;">
                        ${JSON.stringify(editor.getComponents())}
                        </textarea>`,
                    )
                    .open();
            },
        },
    ],
});
editor.Panels.addPanel({
    id: 'layers',
    el: '.panel__right',
    resizable: {
        maxDim: 350,
        minDim: 200,
        tc: false,
        cl: true,
        cr: false,
        bc: false,
        keyWidth: 'flex-basis',
    },
});
editor.Panels.addPanel({
    id: 'panel-switcher',
    el: '.panel__switcher',
    buttons: [
        {
            id: 'show-layers',
            active: true,
            label: '<i class="fa fa-layer-group"></i>',
            command: 'show-layers',
            togglable: false,
        },
        {
            id: 'show-style',
            active: true,
            label: '<i class="fa fa-paintbrush"></i>',
            command: 'show-styles',
            togglable: false,
        },
        {
            id: 'show-traits',
            active: true,
            label: '<i class="fa fa-user-gear"></i>',
            command: 'show-traits',
            togglable: false,
        },
    ],
});
editor.Panels.addPanel({
    id: 'panel-devices',
    el: '.panel__devices',
    buttons: [
        {
            id: 'device-desktop',
            label: '<i class="fa fa-desktop"></i>',
            command: 'set-device-desktop',
            active: true,
            togglable: false,
        },
        {
            id: 'device-mobile',
            label: '<i class="fa fa-mobile"></i>',
            command: 'set-device-mobile',
            togglable: false,
        },
    ],
});
editor.Commands.add('export-template', {
    run(editor, sender) {
        const code = editor.getHtml() + '\n' + editor.getCss();
        editor.Modal.setTitle('Export template')
            .setContent(
                `<textarea style="width:100%; height: 250px;">${code}</textarea>`,
            )
            .open();
    },
});

editor.Commands.add('show-layers', {
    getRowEl(editor) {
        return editor.getContainer().closest('.editor-row');
    },
    getLayersEl(row) {
        return row.querySelector('.layers-container');
    },

    run(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = '';
    },
    stop(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = 'none';
    },
});
editor.Commands.add('show-styles', {
    getRowEl(editor) {
        return editor.getContainer().closest('.editor-row');
    },
    getStyleEl(row) {
        return row.querySelector('.styles-container');
    },

    run(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = '';
    },
    stop(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = 'none';
    },
});
editor.Commands.add('show-traits', {
    getTraitsEl(editor) {
        const row = editor.getContainer().closest('.editor-row');
        return row.querySelector('.traits-container');
    },
    run(editor, sender) {
        this.getTraitsEl(editor).style.display = '';
    },
    stop(editor, sender) {
        this.getTraitsEl(editor).style.display = 'none';
    },
});
editor.Commands.add('set-device-desktop', {
    run: (editor) => editor.setDevice('Desktop'),
});
editor.Commands.add('set-device-mobile', {
    run: (editor) => editor.setDevice('Mobile'),
});