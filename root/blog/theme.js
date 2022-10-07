$(() => {
    const themeSelect = $('#js-theme-select')[0];

    const themeModal = $('#js-theme-modal');
    const themeModalInput = $('#js-theme-modal-input')[0];
    const themeModalInputError = $('#js-theme-modal-error');

    $('#js-theme-add-btn').click(openModal);
    $('#js-theme-modal-close-btn').click(closeModal);
    $('#js-theme-modal-save-btn').click(() => {
        const theme = themeModalInput.value;
        addThemeAndCloseModal(theme);
    });
    $(themeModalInput).keydown(e => {
        if (e.key === 'Enter') {
            const theme = e.target.value;
            addThemeAndCloseModal(theme);
        }
    })

    function openModal() {
        themeModal.addClass('active');
    }

    function closeModal() {
        themeModal.removeClass('active');
        clear();
    }

    function addThemeAndCloseModal(theme) {
        if (validateTheme(theme)) {
            $('<option>')
                .attr({value: theme})
                .text(theme)
                .prop('selected', true)
                .appendTo(themeSelect);

            closeModal();
        }
    }

    /**
     * @param {string} theme
     * @returns {boolean}
     */
    function validateTheme(theme) {
        theme = theme.trim();

        if (theme === '') {
            showError('テーマを入力してください。')
            return false;
        }
        if (themeExists(theme)) {
            showError('登録済のテーマです。')
            return false;
        }
        return true;
    }

    /**
     * テーマ存在チェック
     * @param {string} theme
     * @returns {boolean}
     */
    function themeExists(theme) {
        const themes = [...themeSelect.options]
            .map(option => option.value);
        return themes.includes(theme);
    }

    /**
     * エラーメッセージを表示する
     * @param {string} msg
     */
    function showError(msg) {
        themeModalInputError.html(msg);
    }

    /**
     * 入力文字やエラーメッセージなどを消す
     */
    function clear() {
        showError('');
        themeModalInput.value = '';
    }
});
