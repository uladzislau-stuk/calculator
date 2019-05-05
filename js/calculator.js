const keys = document.querySelector('.calculator_keys')
const display = document.querySelector('.calculator_display')
const calculator = document.querySelector('.calculator')
const clearKey = document.querySelector('.key-clear')

const calculateValue = (operator) => new Function('n1', 'n2', `return parseFloat(n1)${operator}parseFloat(n2)`)
const operators = Array.from(document.querySelectorAll('.keys-operator'))

const deselectOperators = () => operators.forEach(operator => operator.classList.remove('is-depressed'))

const clearActions = (actions) => {
	let names = Object.getOwnPropertyNames(actions)

	names.forEach(name => delete actions[name])
}

keys.addEventListener('click', (e) => {
	const key = e.target
	const keyValue = key.dataset.operator || key.textContent
	const displayNum = display.textContent
	const actions = calculator.dataset
	const action = key.dataset.action

	let { firstNum, secondNum, prevKey } = actions

	deselectOperators()

	if (
		action === 'add' ||
		action === 'subtract' ||
		action === 'multiply' ||
		action === 'divide'
	) {
		let firstValue = actions.firstNum
		let operatorValue = actions.operatorValue
		let secondNum

		if (firstValue && operatorValue && prevKey !== 'operator' && prevKey !== 'calculate') {
			secondNum = displayNum
			display.textContent = calculateValue(operatorValue)(firstValue, secondNum)
			actions.firstNum = display.textContent
		} else {
			actions.firstNum = displayNum
		}
		
		key.classList.add('is-depressed')
		actions.operatorValue = keyValue
		actions.prevKey = 'operator'
	}

	if (!action) {
		if (displayNum === '0' || prevKey === 'operator') {
			display.textContent = keyValue
		} else {
			display.textContent += keyValue
		}

		actions.prevKey = 'number'
	}

	if (action === 'decimal') {
		if (prevKey === 'operator' || prevKey === 'calculate') {
			display.textContent = '0.'
		} else if (!displayNum.includes('.')) {
			display.textContent += '.'
		}

		actions.prevKey = action
	}

	if (action === 'clear') {
		if (prevKey === action) {
			clearActions(actions)
		} else {
			display.textContent = '0'
			clearKey.textContent = 'AC'
			actions.prevKey = action
		}
	}

	if (action !== 'clear') {
		clearKey.textContent = 'CE'
	}

	if (action === 'calculate') {
		if (firstNum && prevKey !== 'operator' && prevKey !== action) {
			actions.secondNum = displayNum
		} else if (secondNum && prevKey === action) {
			actions.secondNum = secondNum
		} else if (prevKey === 'operator') {
			actions.secondNum = firstNum
		} else {
			return
		}

		display.textContent = calculateValue(actions.operatorValue)(actions.firstNum, actions.secondNum)
		actions.firstNum = display.textContent
		actions.prevKey = action
	}
})




