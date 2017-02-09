const random = array => { return array[Math.floor(Math.random() * array.length)] }
const getGreetings = () => {
  const answers = [
    'Hello!',
    'Yo ;)',
    'Hey, nice to see you.',
    'Welcome back!',
    'Hi, how can I help you?',
    'Hey, what do you need?',
  ]
  return random(answers)
}
module.exports = getGreetings
