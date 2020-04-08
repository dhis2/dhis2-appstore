const debug = require('debug')('apphub:server:security')
/**
 * This returns true if the request is authenticated (e.g. contains a valid token)
 * @param {*} request
 */
const isAuthenticated = request => {
    try {
        debug('isAuthenticated:', request.auth.isAuthenticated)
        return request.auth.isAuthenticated === true
    } catch (err) {
        debug('isAuthenticated error:', err)
        return false
    }
}

/**
 * Returns true if the JWT/user for the request contains a role with the specified name
 * @param {*} request
 * @param {string} role
 */
const hasRole = (request, role) => {
    try {
        debug('hasRole:', request.auth.credentials.roles)
        return request.auth.credentials.roles.indexOf(role) !== -1
    } catch (err) {
        return false
    }
}

/**
 * Checks if the user on the request has permissions to delete an app
 * @param {*} request
 */
const canDeleteApp = request =>
    isAuthenticated(request) && hasRole(request, 'ROLE_MANAGER')

/**
 * Checks if the user on the request has permissions to change the status of an app
 * @param {*} request
 * @param {*} hapi
 */
const canChangeAppStatus = request =>
    isAuthenticated(request) && hasRole(request, 'ROLE_MANAGER')

/**
 * Checks if the user on the request has permissions to create an app version
 * @param {*} request
 */
const canCreateAppVersion = request => isAuthenticated(request)

/**
 * Checks if the user on the request has permissions to create an app
 * @param {*} request
 */
const canCreateApp = request => isAuthenticated(request)

/**
 * Checks if the user on the request has permissions to see all apps
 * @param {*} request
 */
const canSeeAllApps = request =>
    isAuthenticated(request) && hasRole(request, 'ROLE_MANAGER')

const currentUserIsManager = request =>
    isAuthenticated(request) && hasRole(request, 'ROLE_MANAGER')

const getCurrentUserFromRequest = request => {
    return new Promise((resolve, reject) => {
        try {
            const user = {
                id: request.auth.credentials.userId,
            }
            resolve(user)
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    canDeleteApp,
    canChangeAppStatus,
    canCreateApp,
    canCreateAppVersion,
    canSeeAllApps,
    createUserValidationFunc: require('./createUserValidationFunc'),
    getCurrentUserFromRequest,
    currentUserIsManager,
}
