package org.hisp.appstore.web.api;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.RenderService;
import org.hisp.appstore.api.UserService;
import org.hisp.appstore.api.domain.App;
import org.hisp.appstore.api.domain.Review;
import org.hisp.appstore.api.domain.User;
import org.hisp.appstore.util.WebMessageException;
import org.hisp.appstore.util.WebMessageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Set;

/**
 * Created by zubair on 13.12.16.
 */
@Controller
@RequestMapping ( value = "/users" )
public class UserController extends AbstractCrudController<User>
{
    @Autowired
    private UserService userService;

    @Autowired
    private RenderService renderService;

    @RequestMapping ( value = "/me", method = RequestMethod.GET )
    public void getProfile( HttpServletResponse response, HttpServletRequest request )
            throws IOException, WebMessageException
    {
        User user = userService.getCurrentUser();

        renderService.toJson( response.getOutputStream(), user );
    }

    @RequestMapping ( value = "/me", method = RequestMethod.PUT )
    public void updateProfile( HttpServletResponse response, HttpServletRequest request )
            throws IOException, WebMessageException
    {
        User user = renderService.fromJson( request.getInputStream(), User.class );

        userService.updateUser( user );

        renderService.renderAccepted( response, request, "User updated");
    }
}
