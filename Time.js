/**
 * Time Class: manipulates time to strign or too seconds
 */
module.exports = class Time {

    constructor(hour, minutes = 0, seconds = 0) {
        this.hours = parseInt(hour[0] || hour)
        this.minutes = parseInt(hour[1] || minutes)
        this.seconds = parseInt(hour[2] || seconds)
        this.total = this.seconds + this.minutes * 60 + this.hours * 3600
    }
    /**
     * Returns the string time of the Time object
     */
    toString() {
        return `${this.hours} hours, ${this.minutes} minutes and ${this.seconds} seconds`
    }
    /**
     * Converts seconds to a Time object
     * @param {number} totalSeconds Number of seconds to be translated into a Time instance
     */
    static secondsToTime(totalSeconds) {
        const hours = Math.trunc(totalSeconds / (3600))
        totalSeconds = totalSeconds % (3600)
        let minutes = Math.trunc(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return new Time(hours, minutes, seconds)
    }
    /**
     * Converts hr:mm:ss format to a Time instance
     * @param {string} time Amount of time to be converted
     */
    static stringToTime(time = '0:00') {
        return new Time(time.split(':'))
    }
    /**
     * Returns the addition or substraction of two Time instances
     * @param {Time} starting Starting Time object 
     * @param {Time} finish Finishing Time Object
     * @param {boolean} add True to add, false to substract
     */
    static joinTime(starting, finish, add = true) {
        return Time.secondsToTime(add ? starting.total + finish.total : finish.total - starting.total)
    }
}