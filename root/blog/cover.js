$(() => {
    const coverHelpBalloon = $('#js-cover-help-balloon');

    const coverInputField = $('input[name="cover"]')[0];
    const coverPreview = $('#js-cover-preview')[0];
    const coverUploadBtn = $('#js-cover-upload-btn');
    const coverDeleteBtn = $('#js-cover-delete-btn');

    $('#js-cover-help').click(() => {
        coverHelpBalloon.addClass('active');
    });
    $('#js-cover-help-balloon-close').click(() => {
        coverHelpBalloon.removeClass('active');
    });

    coverUploadBtn.click(() => {
        coverInputField.click();
    });
    coverDeleteBtn.click(function () {
        coverPreview.src = "";
        $(this).removeClass('active');
    });
    coverInputField.addEventListener('change', function () {
        const reader = new FileReader();
        reader.onload = function (e) {
            coverPreview.src = e.target.result;
            coverDeleteBtn.addClass('active');
        }
        reader.readAsDataURL(this.files[0]);
    });
});
