package org.hisp.appstore.configuration;
import com.auth0.spring.security.api.Auth0SecurityConfig;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

/**
 * Created by zubair on 19.01.17.
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity( prePostEnabled = true )
@Order( SecurityProperties.ACCESS_OVERRIDE_ORDER )
public class WebApplicationSecurityConfigurer extends Auth0SecurityConfig
{
    @Bean
    public Auth0Client auth0Client()
    {
        return new Auth0Client( clientId, issuer );
    }

    @Bean
    public CustomAccessDeniedHandler getAccessDeniedHandler()
    {
        CustomAccessDeniedHandler customAccessDeniedHandler = new CustomAccessDeniedHandler();

        return customAccessDeniedHandler;
    }
    
    @Bean
    public AuthenticationEntryPoint getAuthenticationEntryPoint()
    {
        AuthenticationEntryPoint authenticationEntryPoint = new AuthenticationEntryPoint()
        {
            @Override
            public void commence( HttpServletRequest request, HttpServletResponse response,
                                  AuthenticationException e ) throws IOException, ServletException
            {
                response.sendRedirect("/api/401");
            }
        };

        return authenticationEntryPoint;
    }

    @Override
    protected void authorizeRequests( final HttpSecurity http ) throws Exception
    {
    }
}
