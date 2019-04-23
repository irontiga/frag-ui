import { Epml } from '../../../src/epml'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

parentEpml.ready().then(() => {
    console.log('I\'m the wallet plugin...and my parent is ready :)')

    parentEpml.request('registerUrl', {
        url: 'fail',
        page: 'core/fail',
        title: 'Test failure',
        // icon: 'credit_card',
        icon: 'error_outline',
        menus: [],
        parent: false
    })
})
