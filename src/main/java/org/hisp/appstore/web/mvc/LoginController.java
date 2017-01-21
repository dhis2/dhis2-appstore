package org.hisp.appstore.web.mvc;

import com.auth0.NonceUtils;
import com.auth0.SessionUtils;
import org.hibernate.SessionFactory;
import org.hisp.appstore.Configuration.WebApplicationSecurityConfigurer;
import org.hisp.appstore.api.UserService;
import org.hisp.appstore.api.domain.AppStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by zubair on 10.12.16.
 */
@Controller
public class LoginController
{
    @Autowired
    private WebApplicationSecurityConfigurer securityConfigurer;

    @Autowired
    private UserService userService;

    @Autowired
    private SessionFactory sessionFactory;

    @RequestMapping(value="/login", method = RequestMethod.GET)
    protected String login( Map<String, Object> model, final HttpServletRequest request )
    {
        detectError(model);
        NonceUtils.addNonceToStorage( request );
        model.put("clientId", securityConfigurer.getClientId());
        model.put("clientDomain", securityConfigurer.getDomain());
        model.put("loginCallback", securityConfigurer.getLoginCallback());
        model.put("state", SessionUtils.getState( request ));

        return "login";
    }

    private void detectError(final Map<String, Object> model)
    {
        if (model.get( "error") != null )
        {
            model.put( "error", true );
        }
        else
        {
            model.put( "error", false );
        }
    }
}
