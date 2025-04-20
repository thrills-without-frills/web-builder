const editor = grapesjs.init({
    container: '#wcEditorCanvas',
    fromElement: true,
    width: 'auto',
    height: '100vh',
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
            label: '<u>B</u>',
            command: 'sw-visibility',
        },
        {
            id: 'export',
            className: 'btn-open-export',
            label: 'Exp',
            command: 'export-template',
            context: 'export-template',
        },
        {
            id: 'show-json',
            className: 'btn-show-json',
            label: 'JSON',
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
            label: 'Layers',
            command: 'show-layers',
            togglable: false,
        },
        {
            id: 'show-style',
            active: true,
            label: 'Styles',
            command: 'show-styles',
            togglable: false,
        },
    ],
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