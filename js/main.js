const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

  //Función para pasar atributos como argumento en un string
const attrsToString = (obj = {}) => {
  const keys = Object.keys(obj)
  const attrs = []

  for (let i = 0; i < keys.length; i++) {
    let attr = keys[i]
    attrs.push(`${attr}="${obj[attr]}"`)
  }

  const string = attrs.join(' ')

  return string
}

  //Función para crear etiquetas dinamicamente y poblar la tabla con los items agregados o clases
const tagAttrs = obj => (content = '') =>
  `<${obj.tag}${obj.attrs ? ' ' :	 ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`

  //Función para pasar un objeto o un string
const tag = t => {
  if(typeof t === 'string') {
    return tagAttrs({ tag: t })
  }
  return tagAttrs(t)
}

//Función para construir las filas
const tableRowTag = tag('tr') 
const tableRow = items => compose(tableRowTag, tableCells)(items)

//Función para construir celdas
const tableCell = tag('td')
const tableCells = items => items.map(tableCell).join('')

//Función para generar el icono para eliminar
const trashIcon = tag({tag: 'i', attrs: {class: 'fas fa-trash-alt'}})('')

//Variables para cada uno de los inputs
let description = $('#description')
let calories = $('#calories')
let carbs = $('#carbs')
let protein = $('#protein')

//Inicializamos arreglo para los elementos conforme se vayan agregando
let list = []

//Método eliminar clase is-invalid al presionar una tecla
description.keypress(() => {
  description.removeClass('is-invalid')
})

calories.keypress(() => {
  calories.removeClass('is-invalid')
})

carbs.keypress(() => {
  carbs.removeClass('is-invalid')
})

protein.keypress(() => {
  protein.removeClass('is-invalid')
})

//Función asignada al botón
const validateInputs = () => {
         //validamos que el valor del input sea un string vacio
  description.val() ? '' : description.addClass('is-invalid')
  calories.val() ? '' : calories.addClass('is-invalid')
  carbs.val() ? '' : carbs.addClass('is-invalid')
  protein.val() ? '' : protein.addClass('is-invalid')

  //Validación para agregar los item a la lista
  if(
    description.val() &&
    calories.val() &&
    carbs.val() &&
    protein.val()
  ) add()
}

//Función add para llenar con los valores del input
const add = () => {
  const newItem = {
    description: description.val(),
    calories: parseInt(calories.val()),
    carbs: parseInt(carbs.val()),
    protein: parseInt(protein.val())
  }
    //Agregar al arreglo mediante push
  list.push(newItem)
  updateTotals()
  cleanInputs()
  renderItems()
}

const removeItem = (index) => {
  list.splice(index, 1)

  updateTotals()
  renderItems()
}

  //Función para sumar cada uno de los valores de la lista
const updateTotals = () => {
  let calories = 0, carbs = 0, protein = 0

  list.map(item => {
    calories += item.calories,
    carbs += item.carbs,
    protein += item.protein
  })
    //Objetos mediante jquery
  $('#totalCalories').text(calories)
  $('#totalCarbs').text(carbs)
  $('#totalProtein').text(protein)
}

//Función para limpiar inputs cada que se agregan a la lista
const cleanInputs = () => {
  description.val('')
  calories.val('')
  carbs.val('')
  protein.val('')
}
  //Función para mostrar las filas y celdas de la tabla
const renderItems = () => {
  $('tbody').empty()

  list.map((item, index) => {

      //Función integración de botón para limpiar elementos
    const removeButton = tag({
      tag: 'button',
      attrs: {
        class: 'btn btn-outline-danger',
        onclick: `removeItem(${index})`
      }
    })(trashIcon)

    $('tbody').append(tableRow([item.description, item.calories, item.carbs, item.protein, removeButton]))
  })
}