
import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = { txt: '' }) {
    if (!filterBy.txt) filterBy.txt = ''
    if (!filterBy.maxPrice) filterBy.maxPrice = Infinity
    if (!filterBy.labels) filterBy.labels = []

    const regExp = new RegExp(filterBy.txt, 'i')

    const filteredToys = toys.filter(toy => {
        const nameMatches = regExp.test(toy.name)
        const priceMatches = toy.price <= filterBy.maxPrice
        const stockMatches = (filterBy.inStock === undefined) || (toy.inStock === filterBy.inStock)
        const labelMatches = (filterBy.labels.length === 0 || filterBy.labels.some(label => toy.labels.includes(label)))

        return nameMatches && priceMatches && stockMatches && labelMatches
    })

    if (filterBy.sortBy) {
        const sortBy = filterBy.sortBy
        filteredToys.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name)
            if (sortBy === 'price') return a.price - b.price
            if (sortBy === 'created') return new Date(a.createdAt) - new Date(b.createdAt)
            return 0
        })
    }

    return Promise.resolve(filteredToys)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId, loggedinUser) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such Toy')

    const toy = toys[idx]
    if (!loggedinUser.isAdmin &&
        toy.owner._id !== loggedinUser._id) {
        return Promise.reject('Not your toy')
    }
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy, loggedinUser) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        if (!loggedinUser.isAdmin &&
            toyToUpdate.owner._id !== loggedinUser._id) {
            return Promise.reject('Not your toy')
        }
        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
        toy = toyToUpdate
    } else {
        toy._id = utilService.makeId()
        toy.owner = loggedinUser
        toys.push(toy)
    }
  
    return _saveToysToFile().then(() => toy)
}


function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 2)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to toy file', err)
                return reject(err)
            }
            resolve()
        })
    })
}