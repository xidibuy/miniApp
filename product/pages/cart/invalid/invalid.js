const app = getApp();

Page({
    data: {
        img: app.globalData.img,
        dataUrl: app.globalData.data
    },

    onLoad: function () {
        this.reloadTapEvent()
    },
    reloadTapEvent() {
        app.netWorkState(this.refreshCurrentPage, this, true)
    },
    refreshCurrentPage() {
        let self = this;
        let listUrl = app.globalData.dataRemote + 'cart/unValidList';
        // 获取列表
        app.fetchApi(listUrl, function (resp) {
            if (resp.code == 0) {
                self.setData({
                    list: resp.data
                });
            } else {
                app.showTip(self, resp.msg)
            }

        })
    },
    // 删除
    deleteCart(e) {
        let self = this;
        wx.showModal({
            title: '',
            content: '确定删除该商品吗？',
            success: function (res) {
                if (res.confirm) {
                    let url = app.globalData.dataRemote + 'cart/delete';
                    let id = e.currentTarget.dataset.id;
                    let num = e.currentTarget.dataset.num;
                    let obj = {
                        productIds: {}
                    };
                    let list = self.data.list;
                    obj.productIds[id] = num;
                    app.postApi(url, obj, function (resp) {
                        if (resp.code == 0) {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 1000
                            });

                            self.setData({
                                list: list.filter(item => {
                                    return item.goodsId != id
                                })
                            })
                        } else {
                            app.showTip(self, resp.msg);
                        }
                    })
                }
            }
        })
    }
});