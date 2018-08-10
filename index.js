const inquirer = require('inquirer')
let colors = require('colors')
let program = require('commander')
const fs = require('fs')
const configPath = './config.json'

const Time = require('./Time.js')
let busTimes = require('./busTimes')


const main = async () => {
    program
        .version(require('./package.json').version, '-v', '--version')
        .description('CLI tools for informing you what time to leave work')
        .option('-t, --time <arrivalTime>', 'Defines the time of arrival of the worker')
        .option('-l, --lunch [time]', 'Lunch pause, if left empty it will remove the lunch brake time')
        .option('-r, --requiredTime <time>', 'Changes de default required time of work')
        .option('-b, --breakTime <time>', 'Changes default brake/lunch time')

    program
        .description('Changes the bus times')
        .command('changeBus')
        .action(() => {
            changeBusFile(inquirer) 
            process.exit
        })
    program.parse(process.argv)

    if (program.requiredTime) {
        updateDefaultFile('requiredTime', program.requiredTime)
    }
    if (program.breakTime) {
        updateDefaultFile('breakTime', program.breakTime)
    }
    defaultValues = require(configPath)
    let time = {
        lunchBreak: Time.stringToTime(program.lunch ? typeof program.lunch === 'string' ? program.lunch : null : defaultValues.breakTime),
        actual: Time.stringToTime(new Date(Date.now()).toLocaleTimeString())
    }
    time['arrival'] = Time.joinTime(Time.stringToTime(program.time ? program.time : (await inquirer.prompt(askArrival)).time), time.lunchBreak)
    time['minimum'] = Time.joinTime(time.arrival, Time.stringToTime(defaultValues.requiredTime)).toString()


    initialMessages(time.arrival, time.minimum, time.actual)
    departureTime = await inquirer.prompt(
        {
            type: 'input',
            name: 'time',
            message: 'Desired time to leave? \n'.bold,
            default: time.minimum
        }
    )
    time['desired'] = Time.stringToTime(departureTime.time)
    await calculate(time.desired, time.arrival, time.actual)
}
const changeBusFile = async (inquirer, busTimes = []) => {
    let questions = [
        {
            type: 'input',
            name: 'busTime',
            message: 'Insert the first bus time'
        },
        {
            type: 'input',
            name: 'confirm',
            message: 'Do you want to enter another bus time?(y/n)',
            default: 'y'
        }
    ]
    response = await inquirer.promt(questions)
    busTimes.push(response.busTime)
    if (response.confirm) {
        await changeBusFile(inquirer, busTimes)
    }
    return busTimes


}
const updateDefaultFile = (key, value) => {
    defaultValues = require(configPath)
    defaultValues[key] = value
    fs.writeFileSync(configPath, JSON.stringify(defaultValues, "", 4))
    return require(configPath)
}

const askArrival = {
    type: 'input',
    name: 'time',
    message: 'Arrival Time? Format HR:Min accepted \n'.bold,
    default: new Date(Date.now()).toLocaleTimeString()
}


const initialMessages = (arrivalTime, minimumTime, actualTime) => {
    console.log(`\nArrival Time with Brake:${arrivalTime}\n`)
    console.log(`You must leave at ${minimumTime}`.yellow.underline)
    console.log(`If you leave right now you will have: ${Time.joinTime(arrivalTime, actualTime, false).toString()}\n`.blue.underline)
}

const calculate = async (desiredTime, arrivalTime) => {
    console.log(`\nIf you leave at ${desiredTime.toString()} you would have worked ${Time.joinTime(arrivalTime, desiredTime, false)}`.yellow.underline)
    busTimes = busTimes.map(time => Time.stringToTime(time))
    matchingBusIndex = busTimes.map(time => Math.abs(Time.joinTime(desiredTime, time, false).total)).reduce((iMin, x, i, arr) => x < arr[iMin] ? i : iMin, 0);
    console.log(`You should take the bus that leaves at ${busTimes[matchingBusIndex].toString()}\n`.blue.underline)
    await countdown(desiredTime)
    process.exit(0)
}

countdown = async (timeToLeave) => {
    actualTime = Time.stringToTime(new Date(Date.now()).toLocaleTimeString())
    difference = Time.joinTime(actualTime, timeToLeave, false)
    total = difference.total
    process.stderr.write(`You have to wait ${Time.secondsToTime(total).toString()} `)
    for (let i = 0; i < total; i++) {
        await wait(1)
        updateLine(`You have to wait ${Time.secondsToTime(total - i)} `)
    }
    updateLine('')
    console.log('\n You can leave now!'.rainbow.bold)

}

/**
 * Updates string line on stdout (removes old then creates new message)
 * @param {string} message String to be updated
 */
let updateLine = message => {
    process.stderr.clearLine()
    process.stderr.cursorTo(0)
    process.stderr.write(message)
}
/**
 * Wait function
 * @param {number} seconds Amount of seconds you wish to await for. 
 */
const wait = (seconds) => new Promise((resolve) => setTimeout(() => resolve(), seconds * 1000))

main().catch(err => console.error(err))







