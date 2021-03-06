import Zero from 'auth0-lock'
import { isTokenExpired } from './jwtHelper'
import History from './history'
import store from '../store'
import Theme from '../styles/theme'
import logo from '../assets/img/dhis2.svg'

export default class AuthService {
    constructor(clientId, domain) {
        // Configure Auth0
        this.lock = new Zero(clientId, domain, {
            auth: {
                redirectUrl: `${window.location.protocol}//${window.location.host}/user`,
                responseType: 'token',
                params: {
                    scope: 'openid roles user_id email profile',
                },
            },
            theme: {
                logo: `${logo}`,
                primaryColor: Theme.palette.primary1Color,
            },
            languageDictionary: {
                title: 'Log in',
            },
        })

        // Add callback for lock `authenticated` event
        this.lock.on('authenticated', this._doAuthentication.bind(this))
        // binds login functions to keep this context
        this.login = this.login.bind(this)
    }

    _doAuthentication(authResult) {
        // Saves the user token
        this.setToken(authResult.idToken)
        store.dispatch({ type: 'USER_AUTHENTICATED' })
    }

    login() {
        // Call the show method to display the widget.
        this.lock.show()
    }

    isLoggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken()
        return !!token && !isTokenExpired(token)
    }

    isManager() {
        const profile = this.getProfile()
        if (profile) {
            return profile.roles.includes('ROLE_MANAGER')
        }
        return null
    }

    setProfile(profile) {
        localStorage.setItem('profile', JSON.stringify(profile))
    }

    getProfile() {
        return localStorage.getItem('profile')
    }

    setToken(idToken) {
        // Saves user token to local storage
        localStorage.setItem('id_token', idToken)
    }

    setAccessToken(accessToken) {
        localStorage.setItem('access_token', accessToken)
    }

    getToken() {
        // Retrieves the user token from local storage
        return localStorage.getItem('id_token')
    }

    getAccessToken() {
        return localStorage.getItem('access_token')
    }

    logout() {
        // Clear user token and profile data from local storage
        localStorage.removeItem('id_token')
        localStorage.removeItem('profile')
        History.push('/')
    }
}
