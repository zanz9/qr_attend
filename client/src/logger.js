class Logger {
    static log(...message) {
        let now = new Date()
        console.log(`[LOGGER] ${now}`)
        console.log(message)
    }
}

export default Logger