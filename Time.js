module.exports = class Time {
    constructor(hour, minutes = 0, seconds = 0) {
        this.hours = parseInt(hour[0] || hour)
        this.minutes = parseInt(hour[1] || minutes)
        this.seconds = parseInt(hour[2] || seconds)
        this.total = this.seconds + this.minutes * 60 + this.hours * 3600
    }

    toString() {
        return `${this.hours} hours, ${this.minutes} minutes and ${this.seconds} seconds`
    }
    static secondsToTime(totalSeconds) {
        const hours = Math.trunc(totalSeconds / (3600))
        totalSeconds = totalSeconds % (3600)
        let minutes = Math.trunc(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return new Time(hours, minutes, seconds)
    }
    static stringToTime(time = '0:00') {
        return new Time(time.split(':'))
    }
    static joinTime(starting, finish, add = true) {
        return Time.secondsToTime(add ? starting.total + finish.total : finish.total - starting.total)
    }
}