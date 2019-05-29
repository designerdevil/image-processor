
const progress = {
    config: () => {
        return [
            'Sit back and relax',
            'Drink a coffee',
            'Have a quick nap',
            'Watch a video',
            'Call a friend',
            'Read a blog',
            'Dance around',
            'Use the internet',
            'Cut your nails',
            'Do Yoga'
        ]
    },
    triggerMouseEvent: (node, eventType) => {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
    },
    doSpaceJump: () => {
        const targetNode = $("#spaceJump")[0]
        progress.triggerMouseEvent(targetNode, "mousedown");
        setTimeout(() => {
            progress.triggerMouseEvent(targetNode, "mouseup");
        }, 600)
    },
    ajax: (url, callback) => {
        $.ajax({
            url,
            success: function (data) {
                callback(data);
            }
        });
    },
    flipText: () => {
        const texts = progress.config()
        const randomizeSpaceJump = (Math.floor(Math.random() * 20) + 10) * 1000;
        let lastNumber = 0
        setInterval(() => {
            const which = Math.floor(Math.random() * texts.length) + 1;
            $("#spaceJump").fadeOut(function () {
                $(this).text(texts[which]).fadeIn();
            });
        }, 3000);
        setInterval(() => {
            progress.doSpaceJump()
        }, randomizeSpaceJump);
    },
    startCheck: () => {
        const intervalCount = 1500;
        const interval = setInterval(()=>{
            progress.ajax(url, (data)=>{
                if(data.errorCode != "NONE") {
                    $("#congratulations .main-msg").empty().text("Something Went wrong! Check Logs")
                }
                if(!data.isUploading) {
                    clearInterval(interval)
                    $("#spaceJump").fadeOut(()=>{
                        $("#spaceJump").css({opacity: 0})
                        $("#congratulations").fadeIn()
                    })
                }
            })
        }, intervalCount);
    },
    init: () => {
        progress.flipText();
        progress.startCheck();
    }
}

progress.init();