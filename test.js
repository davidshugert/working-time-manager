let word = 'troport'
consolccisPalindrome(word)
isPalindrome = (word) => {
    flag = false
    for (let [i, v] of word) {
        if (word[word.length - i] === v) {
            flag = true
        }
    }
}
