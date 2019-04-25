let transactionRequestListener = async () => {
    return {
        confirmed: false,
        reason: 'Dialoag not registered'
    }
}

export const requestTransaction = async (...args) => transactionRequestListener(...args)

export const listenForRequest = listener => {
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    console.log(listener)
    transactionRequestListener = listener
}
