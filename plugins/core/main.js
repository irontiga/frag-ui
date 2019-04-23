const parentEpml = new Epml({
    type: 'WINDOW',
    source: window.parent
})

console.log('core', parentEpml)
setTimeout(() => console.log('core', parentEpml), 4000)

parentEpml.ready().then(() => {

    parentEpml.request('registerUrl', {
        url: 'wallet',
        page: 'core/wallet/index.html',
        title: 'Wallet',
        // icon: 'credit_card',
        icon: 'account_balance_wallet',
        menus: [],
        parent: false
    })

    parentEpml.request('registerUrl', {
        url: 'send-money',
        page: 'core/send-money/index.html',
        title: 'Send Money',
        icon: 'send',
        menus: [],
        parent: false
    })
})
