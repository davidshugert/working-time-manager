let lunchBreak
const readline = require('readline')
let colors = require('colors')
const Time = require('./Time.js')
let program = require('commander')
let busTimes = require('./busTimes')
const defaultValues = require('./config.json')
let arrivalT, requiredT, actualT
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const initial = (time) => {
    arrivalT = Time.joinTime(Time.stringToTime(time), lunchBreak)
    requiredT = Time.stringToTime(defaultValues.requiredTime)
    actualT = Time.stringToTime(new Date(Date.now()).toLocaleTimeString())

    console.log(`\nArrival Time with Brake:${arrivalT}\n`)
    console.log(`You must leave at ${Time.joinTime(arrivalT, requiredT).toString()}`.yellow.underline)
    console.log(`If you leave right now you will have: ${Time.joinTime(arrivalT, actualT, false).toString()}\n`.blue.underline)
}

const calculate = (time) => {
    desiredT = Time.stringToTime(time)
    console.log(`\nIf you leave at ${desiredT.toString()} you would have worked ${Time.joinTime(arrivalT, desiredT, false)}`.yellow.underline)
    busTimes = busTimes.map(time => Time.stringToTime(time))
    matchingBusIndex = busTimes.map(time => Math.abs(Time.joinTime(desiredT, time, false).total)).reduce((iMin, x, i, arr) => x < arr[iMin] ? i : iMin, 0);
    console.log(`You should take the bus that leaves at ${busTimes[matchingBusIndex].toString()}`.blue.underline)
    countdown(busTimes[matchingBusIndex])
    process.exit(0)
}

countdown = (timeToLeave) => {
    actualT = Time.stringToTime(new Date(Date.now()).toLocaleTimeString())
    while (actualT.total < timeToLeave.total) {
        setTimeout(() => {
            process.stdout.write("\r\x1b[K")
            console.log(`Time left: ${joinTime(actualT, timeToLeave, false).toString}`)
        }, 1000)
        actualT = Time.stringToTime(new Date(Date.now()).toLocaleTimeString())

    }
    console.log('finish')
}
program
    .version(require('./package.json').version, '-v', '--version')
    .description('Gitlab Command Line Tool for MBB')
    .option('-t, --time <arrivalTime>', 'Defines the time of arrival of the worker')
    .option('-l, --lunch [time]', 'Lunch pause, if left empty it will remove the lunch brake time')
    .parse(process.argv)

lunchBreak = Time.stringToTime(program.lunch ? typeof program.lunch === 'string' ? program.lunch : null : defaultValues.breakTime)

if (program.time) {
    initial(program.time)
    rl.question('Desired time to leave? \n'.bold, (answer) => {
        calculate(answer)
    })
} else {
    rl.question('Arrival Time? Format HR:Min accepted \n'.bold, (answer) => {
        initial(answer)
        process.exit(0)
    })
}






