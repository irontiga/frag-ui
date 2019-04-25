let transactionRequestListener = () => {
    return {
        confirmed: false,
        reason: 'Dialoag not registered'
    }
}

export const requestTransaction = (...args) => transactionRequestListener(...args)

export const listenForRequest = listener => {
    transactionRequestListener = listener
}
