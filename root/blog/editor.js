document.addEventListener("DOMContentLoaded", () => {

    let globalEditor;

    const watchdog = new CKSource.EditorWatchdog();
    window.watchdog = watchdog;
    watchdog.setCreator((element, config) => {
        return CKSource.Editor
            .create(element, {
                ...config,
                wordCount: {
                    displayWords: false
                }
            })
            .then(editor => {
                // 文字数カウント
                const wordCountPlugin = editor.plugins.get('WordCount');
                document.querySelector('#js-word-count')
                    .appendChild(wordCountPlugin.wordCountContainer);

                // タグ除外
                const dataFilter = editor.plugins.get('DataFilter');
                dataFilter.disallowAttributes({
                    name: /^(html|head|body|frame|frameset|iframe|object|param|server|javascript|form|input|embed|textarea|script|meta|button|option|title)$/
                });

                globalEditor = editor;
                return editor;
            })
    });

    watchdog.setDestructor(editor => editor.destroy());

    watchdog.on('error', handleError);

    watchdog
        .create(document.querySelector('#js-editor'), {
            toolbar: {
                items: [
                    'fontSize', 'heading', 'bold', 'italic', 'underline', 'strikethrough',
                    'fontColor', 'highlight', 'removeFormat', '-', 'link', 'imageUpload',
                    '|', 'alignment:left', 'alignment:center', 'alignment:right',
                    '|', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo',
                    '|', 'sourceEditing'

                ],
                shouldNotGroupWhenFull: true
            },
            removePlugins: [
                'Markdown',
                'MediaEmbed',
                'MediaEmbedToolbar'
            ],
            extraPlugins: [
                function (editor) {
                    editor.plugins.get('FileRepository')
                        .createUploadAdapter = loader => new uploadAdaptor(loader);
                }
            ],
            language: 'ja',
            image: {
                toolbar: [
                    'toggleImageCaption',
                    'imageTextAlternative',
                    'imageStyle:block',
                    'imageStyle:inline',
                    'imageStyle:side',
                    'linkImage'
                ]
            }
        })
        .catch(handleError);

    function handleError(error) {
        console.error(error);
    }

    class uploadAdaptor {
        constructor(loader) {
            this.loader = loader;
        }

        upload() {
            return this.loader.file
                .then(file => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve({default: reader.result});
                    reader.onerror = error => reject(error);
                }));
        }
    }

});
