
const imageProcessor = {
    registerEvents: () => {
        const settingVal = $('#settings').val();
        if (!settingVal) return;
        const json = JSON.parse(settingVal)
        $('#settings').val(JSON.stringify(json, undefined, 4))
        $('#uploadForm').submit(function () {
            $("#uploadSubmit").prop("disabled", true)
            $("#status").show();
            $("#buttontxt").empty().text("Uploading...")
            $(this).ajaxSubmit({
                error: function (xhr) {
                    status('Error: ' + xhr.status);
                },
                success: function (response) {
                    console.log(response)
                    $("#status").empty().text(response);
                }
            });
        });
    },
    handleDragResize: () => {
        const currentWidthHeight = (that) => {
            const img = that.next()
            const anchorContainer = that.parent();
            const mainContainer = anchorContainer.parent();
            const cropContainer = mainContainer.find('.crop-container');
            const imageWidth = img[0].naturalWidth
            const imageHeight = img[0].naturalHeight
            const widthRatio = imageWidth / anchorContainer.outerWidth()
            const heightRatio = imageHeight / anchorContainer.outerHeight()
            const w = that.outerWidth() * widthRatio
            const h = that.outerHeight() * heightRatio
            const x = that.position().left * widthRatio
            const y = that.position().top * heightRatio
            cropContainer.find('.x').val(parseInt(x))
            cropContainer.find('.y').val(parseInt(y))
            cropContainer.find('.w').val(parseInt(w))
            cropContainer.find('.h').val(parseInt(h))
            const trigger = cropContainer.find('a')
            const href = `${trigger.attr('data-href')}&x=${x}&y=${y}&w=${w}&h=${h}`
            if (x != NaN && y != NaN && w != NaN && h != NaN) {
                trigger.attr('href', href);
            }
        }
        $(".cropper").each(function () {
            const cropperWidth = $(this).width();
            const cropperHeight = $(this).height();
            $(this).resizable({
                containment: "parent",
                maxHeight: cropperHeight,
                maxWidth: cropperWidth,
                minHeight: 5,
                minWidth: 5,
                resize: function (event, ui) {
                    currentWidthHeight($(this))
                }
            }).draggable({
                containment: "parent",
                drag: function () {
                    currentWidthHeight($(this))
                }
            });
        })

    },
    init: () => {
        imageProcessor.registerEvents();
        imageProcessor.handleDragResize();
    }
}

imageProcessor.init();