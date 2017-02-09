const random = array => { return array[Math.floor(Math.random() * array.length)] }
const listTheRules = () => {
  const answers = "1- Bach created me, i work for him.\
  2- My job is to make your life easier.\
  3- No woman no cry."
  return answers;
}
module.exports = listTheRules
