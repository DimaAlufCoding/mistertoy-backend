import { loggerService } from '../../services/logger.service.js'
import { toyService } from './toy.service.js'


export async function getToys(req, res) {
    try {
        const { txt, inStock, labels, pageIdx, sortBy, fetchAll = false } = req.query
        const filterBy = {
            txt: txt || '',
            inStock: inStock || undefined,
            labels: labels || [],
            pageIdx: +pageIdx || 0,
            sortBy: sortBy || { type: '', sortDir: 1 },
            fetchAll: fetchAll === 'true'
        }
        const toys = await toyService.query(filterBy)
        res.send(toys)
    } catch (error) {
        loggerService.error('Cannot load toys', error)
        res.status(500).send('Cannot load toys')
    }
}


export async function getToyById(req, res) {
    try {
        const { toyId } = req.params
        const toy = await toyService.getById(toyId)
        res.send(toy)
    } catch (error) {
        loggerService.error('Cannot get toy', error)
        res.status(500).send(error)
    }
}

export async function addToy(req, res) {
    const toy = req.body

    try {
        const updatedToy = await toyService.update(toy)
        res.send(updatedToy)

    } catch (error) {
        loggerService.error('Cannot update toy', error)
        res.status(500).send('Cannot update toy')
    }
}


export async function updateToy(res, res) {
    const { body: toy } = req

    try {
        const updatedToy = await toyService.update(toy)
        res.send(updateToy)
    } catch (error) {
        loggerService.error('Cannot update toy', error)
        res.status(500).send('Cannot update toy')
    }
}

export async function removeToy(req, res) {
    try {
        const { toyId } = req.params
        await toyService.remove(toyId)
        res.send()
    } catch (error) {
        loggerService.error('Cannot delete toy', error)
        res.status(500).send('Cannot delete toy,' + error)
    }
}

export async function addToyMsg(req, res) {
    const { loggedinUser } = req

    try {
        const { toyId } = req.params
        const { txt } = req.body
        const { _id, fullname } = loggedinUser

        const msg = {
            txt,
            by: { _id, fullname },
        }
        const addedMsg = await toyService.addMsg(toyId, msg)
        res.send(addedMsg)
    } catch (error) {
        loggerService.error('Cannot add message to toy', error)
        res.status(500).send('Cannot add message to toy')
    }
}

export async function removeToyMsg(req, res) {
    try {
        const { toyId, msgId } = req.params 
        await toyService.removeMsg(toyId, msgId)
        res.send(msgId)
    } catch (error) {
        loggerService.error('Cannot delete message from toy', error)
        res.status(500).send('Cannot delete messgae from toy')
    }
}