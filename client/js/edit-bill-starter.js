require.config({
    baseUrl: "/js",
    paths: thirdPartyConfig,
    shims: thirdPartyShims,
    noGlobal: true
});

require(['edit-bill'], function(editBill) {
    editBill.start();
});
