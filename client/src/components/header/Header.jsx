import React from 'react'
import { connect } from 'react-redux'
import Toolbar from '../../material/Toolbar/Toolbar'
import ToolbarSection from '../../material/Toolbar/ToolbarSection'
import ToolbarTitle from '../../material/Toolbar/ToolbarTitle'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import { Auth } from '../../api/api'
import { Link } from 'react-router-dom'
import Theme from '../../styles/theme'
import Avatar from 'material-ui/Avatar'
import logo from '../../assets/img/dhis2_logo_reversed.svg'
import { getUserInfo, getUserProfile } from '../../selectors/userSelectors'

const styles = {
    logo: {
        height: 32,
    },
}
const renderProfileButton = props => {
    const avatarUrl = props.avatarImg
    const isLoggedIn = Auth.isLoggedIn()
    const avatar = <Avatar size={24} src={avatarUrl} />
    const notLoggedInIcon = (
        <FontIcon color="white" className="material-icons">
            account_circle
        </FontIcon>
    )
    const button = (
        <IconButton
            style={{ transform: 'translate(12px)' }}
            onClick={() => (!isLoggedIn ? Auth.login() : {})}
            title="Account"
        >
            {isLoggedIn && typeof props.avatarImg === 'string'
                ? avatar
                : notLoggedInIcon}
        </IconButton>
    )
    return isLoggedIn ? <Link to="/user">{button}</Link> : button
}

const Header = props => (
    <Toolbar
        style={{
            backgroundColor: Theme.palette.primary1Color,
            padding: '0 24px',
        }}
    >
        <ToolbarSection
            align="center"
            style={{
                maxWidth: Theme.container.maxWidth - 48,
                margin: '0 auto',
            }}
        >
            <Link to="/" style={styles.logo}>
                <img src={logo} style={styles.logo} />
            </Link>
            <ToolbarTitle align="center" titleStyle={{ margin: 0 }}>
                <Link to="/">App Hub</Link>
            </ToolbarTitle>

            {renderProfileButton(props)}
        </ToolbarSection>
    </Toolbar>
)

const mapStateTopProps = state => ({
    avatarImg: getUserProfile(state).picture,
    authenticated: getUserInfo(state).authenticated,
})

export default connect(mapStateTopProps)(Header)
