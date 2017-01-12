Page({
    onLoad: function() {
        wx.setNavigationBarTitle({
            title: '日本手工陶瓷茶具'
        });
        console.log('topic onload');
    },
    autoImageHeight: function(e) {
        console.log(e);
    }
});