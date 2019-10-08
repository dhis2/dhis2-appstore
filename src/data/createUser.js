const uuid = require('uuid/v4')
const joi = require('@hapi/joi')

const paramsSchema = joi
    .object()
    .keys({
        email: joi
            .string()
            .email()
            .required(),
        name: joi.string(),
    })
    .options({ allowUnknown: true })

/**
 * @typedef CreateUserResult
 * @property {number} id The inserted database id for the user
 * @property {string} uuid The generated UUID for the user
 * @property {string} email Email stored for the user
 * @property {string} name Name of the user
 */

/**
 * Creates a new user
 *
 * @param {object} params
 * @param {string} params.email The user email
 * @param {string} params.name The name of the user
 * @param {*} knex
 * @returns {Promise<CreateUserResult>}
 */
const createUser = async (params, knex, transaction) => {
    const validation = joi.validate(params, paramsSchema)

    if (validation.error !== null) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    if (!transaction) {
        throw new Error('No transaction passed to function')
    }

    const { email, name } = params
    const newUuid = uuid()

    try {
        const [id] = await knex
            .transacting(transaction)
            .insert({
                email,
                name,
                uuid: newUuid,
                created_at: knex.fn.now(),
            })
            .into('users')
            .returning('id')

        return { id, email, uuid: newUuid, name }
    } catch (err) {
        throw new Error(
            `Could not create user: ${params.email}. ${err.message}`
        )
    }
}

module.exports = createUser
