export default function createContants(...constants) {
  return constants.reduce((acc, constant) => {
    acc[constant] = constant
  }, {})
}

