progress = require('progress')
let bar = new progress(' [:bar][:percent][:elapsed]', 10)
main = async () => {
    process.stderr.write('hello')
    for (let i = 0; i < 10; i++) {
        await wait(1000)
        updateLine(`${i} seconds have elapsed`)
        bar.tick()
    }
}

updateLine = message => {
    process.stderr.clearLine()
    process.stderr.cursorTo(0)
    process.stderr.write(message)
}

wait = (time) => new Promise((resolve) => setTimeout(() => resolve(), time))

main()
    .catch((err) => console.log(err))

