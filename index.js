const readline = require('readline')
const inquirer = require('inquirer')
let colors = require('colors')
let program = require('commander')

const Time = require('./Time.js')
let busTimes = require('./busTimes')
const defaultValues = require('./config.json')

let arrivalT, requiredT, actualT, lunchBreak, minimumTime

const main = async () => {
    program
        .version(require('./package.json').version, '-v', '--version')
        .description('Gitlab Command Line Tool for MBB')
        .option('-t, --time <arrivalTime>', 'Defines the time of arrival of the worker')
        .option('-l, --lunch [time]', 'Lunch pause, if left empty it will remove the lunch brake time')
        .parse(process.argv)

    lunchBreak = Time.stringToTime(program.lunch ? typeof program.lunch === 'string' ? program.lunch : null : defaultValues.breakTime)
    initial(program.time ? program.time : (await inquirer.prompt(askArrival)).time)
    departureTime = await inquirer.prompt(
        {
            type: 'input',
            name: 'time',
            message: 'Desired time to leave? \n'.bold,
            default: minimumTime
        }
    )
    calculate(departureTime.time)
}



const askArrival = {
    type: 'input',
    name: 'time',
    message: 'Arrival Time? Format HR:Min accepted \n'.bold,
    default: new Date(Date.now()).toLocaleTimeString()
}

const initial = (time) => {
    arrivalT = Time.joinTime(Time.stringToTime(time), lunchBreak)
    requiredT = Time.stringToTime(defaultValues.requiredTime)
    actualT = Time.stringToTime(new Date(Date.now()).toLocaleTimeString())
    minimumTime = Time.joinTime(arrivalT, requiredT).toString()
    console.log(`\nArrival Time with Brake:${arrivalT}\n`)
    console.log(`You must leave at ${minimumTime}`.yellow.underline)
    console.log(`If you leave right now you will have: ${Time.joinTime(arrivalT, actualT, false).toString()}\n`.blue.underline)
}

const calculate = (time) => {
    desiredT = Time.stringToTime(time)
    console.log(`\nIf you leave at ${desiredT.toString()} you would have worked ${Time.joinTime(arrivalT, desiredT, false)}`.yellow.underline)
    busTimes = busTimes.map(time => Time.stringToTime(time))
    matchingBusIndex = busTimes.map(time => Math.abs(Time.joinTime(desiredT, time, false).total)).reduce((iMin, x, i, arr) => x < arr[iMin] ? i : iMin, 0);
    console.log(`You should take the bus that leaves at ${busTimes[matchingBusIndex].toString()}`.blue.underline)
    //countdown(busTimes[matchingBusIndex])
    process.exit(0)
}

countdown = (timeToLeave) => {
    actualT = Time.stringToTime(new Date(Date.now()).toLocaleTimeString())
    while (actualT.total < timeToLeave.total) {
        setTimeout(() => {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            console.log(`Time left: ${joinTime(actualT, timeToLeave, false).toString}`)
        }, 1000)
        actualT = Time.stringToTime(new Date(Date.now()).toLocaleTimeString())

    }
    console.log('finish')
}

main().catch(err => console.error(err))







