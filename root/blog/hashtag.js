$(() => {
    const TAG_MAX_NUM = 10;

    const tagList = $('#js-hashtag-list');
    const tagInputValue = $('input[name="hashtag"]')[0];

    const tagModal = $('#js-hashtag-modal');
    const tagModalLength = $('#js-hashtag-modal-length');
    const tagModalTagList = $('#js-hashtag-modal-tagList');
    const tagModalTagListItemClass = 'js-hashtag-modal-tagList-item';
    const tagModalDeleteBtnClass = 'js-hashtag-modal-delete';
    const tagModalInputBox = $('#js-hashtag-modal-input');
    const tagModalInputError = $('#js-hashtag-input-error');

    const tagModalHistoryList = $('.js-hashtag-modal-history-item').toArray();
    const tagModalAddFromHistoryBtnClass = 'js-hashtag-modal-addFromHistory';

    // モーダルを開く
    $('#js-edit-hashtag-btn').click(openModal);

    // 編集を保存せずにモーダルを閉じる
    $('#js-hashtag-modal-close').click(closeModal);

    // 編集を保存してモーダルを閉じる
    $('#js-hashtag-modal-save-btn').click(saveAndCloseModal);

    // 自動補完
    $(tagModalInputBox.find('input'))
        .autocomplete({
            delay: 500,
            position: {'my': 'left top+10'},
            source: (request, response) => {
                const result = Array(5).fill(request.term)
                    .map((v, i) => `${v}${i + 1}`);
                response(result);
            },
            select: function (e, ui) {
                e.preventDefault();
            }
        })
        .keydown(function (e) {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                $(this).trigger('autocompleteselect', {item: {value: e.target.value}});
            }
        })
        .on('autocompleteselect', function (e, ui) {
            e.stopImmediatePropagation()

            if (validateTag(ui.item.value)) {
                addTag(ui.item.value);
                clear();
            }
        });

    tagModal.click((e) => {
        const target = e.target;

        // タグ削除
        if (target.classList.contains(tagModalDeleteBtnClass)) {
            clear();
            deleteTag(target);
            return;
        }

        // タグ履歴からタグを追加
        if (target.classList.contains(tagModalAddFromHistoryBtnClass)) {
            clear();
            addTag(target.closest('[data-tag]').dataset.tag);
            return;
        }
    });

    /**
     * モーダル初期化
     */
    function openModal() {
        const tags = tagInputValue.value.split(' ').filter(s => s !== '');
        tags.forEach(addTag);
        tagModal.addClass('active');
        tagModalInputBox.find('input')[0].focus();
    }

    /**
     * モーダルを閉じる
     */
    function closeModal() {
        getModalListItems().forEach((item) => item.remove());
        tagModal.removeClass('active');
        clear();
    }

    /**
     * 編集を保存してモーダルを閉じる
     */
    function saveAndCloseModal() {
        const tags = getModalTags();
        tagList.html(tags.map(tag => '#' + tag).join(' '));
        tagInputValue.value = tags.join(' ');
        closeModal();
    }

    /**
     * モーダルの中のタグ要素リストを取得
     * @returns {Array<Element>}
     */
    function getModalListItems() {
        return $('.' + tagModalTagListItemClass).toArray();
    }

    /**
     * モーダルの中のタグ一覧を取得
     * @returns {Array<string>}
     */
    function getModalTags() {
        return getModalListItems().map(elem => elem.dataset.tag);
    }

    /**
     * 入力したタグをバリデートする
     *
     * @param {string} tag
     * @returns {boolean}
     */
    function validateTag(tag) {
        if (tag === '#' || tag === '') {
            showError('タグを入力してください。');
            return false;
        }
        if (/^.(?=.*#)/.test(tag)) {
            showError('２文字目以降に#記号は使用できません。');
            return false;
        }
        if (/[!"$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]/.test(tag)) {
            showError('ハッシュタグに記号は使用できません。');
            return false;
        }
        if (getModalTags().includes(tag)) {
            showError('このハッシュタグはすでに設定済みです。');
            return false;
        }
        return true;
    }

    /**
     * タグを追加
     * @param {string} tag
     */
    function addTag(tag) {
        const items = getModalListItems();
        if (items.length === TAG_MAX_NUM) {
            showError('これ以上タグを登録することはできません。');
            return;
        }

        tag = tag.replaceAll('#', '');

        const template = tagModalTagList.data('template');
        const newTagHtml = template.replaceAll('__TAG__', tag);
        tagModalInputBox.closest('li').before(newTagHtml);


        if (items.length + 1 === TAG_MAX_NUM) {
            tagModalInputBox.removeClass('active');
        } else {
            tagModalInputBox.addClass('active');
        }

        updateTagListLength();
        updateHistory();
    }

    /**
     * 指定のタグを削除
     * @param {Element} tagItem
     */
    function deleteTag(tagItem) {
        tagItem.closest('.' + tagModalTagListItemClass).remove();

        if (getModalListItems().length < TAG_MAX_NUM) {
            tagModalInputBox.addClass('active');
        }

        updateTagListLength();
        updateHistory();
    }

    /**
     * エラーメッセージを表示する
     * @param {string} msg
     */
    function showError(msg) {
        tagModalInputError.html(msg);
    }

    /**
     * 入力文字やエラーメッセージなどを消す
     */
    function clear() {
        showError('');
        tagModalInputBox.find('input')[0].value = '';
        $('.ui-autocomplete').hide();
    }

    /**
     * 設定可能なタグの個数を更新する
     */
    function updateTagListLength() {
        tagModalLength.html(TAG_MAX_NUM - getModalListItems().length);
    }

    /**
     * タグ履歴を更新
     */
    function updateHistory() {
        const tags = getModalTags();
        tagModalHistoryList.forEach(elem => {
            if (tags.includes(elem.dataset.tag)) {
                $(elem).removeClass('active');
            } else {
                $(elem).addClass('active');
            }
        });
    }
});
