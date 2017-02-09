const random = array => { return array[Math.floor(Math.random() * array.length)] }
const getInsults = () => {
  const answers = [
    'Watch your mouth man!',
    'chill out dude',
    'not your mamma',
    'even bitches are respectfull ',
  ]
  return random(answers)
}
module.exports = getInsults
