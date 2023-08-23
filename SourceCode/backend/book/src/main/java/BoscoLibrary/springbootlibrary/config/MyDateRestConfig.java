package BoscoLibrary.springbootlibrary.config;

import BoscoLibrary.springbootlibrary.entity.Book;
import BoscoLibrary.springbootlibrary.entity.Checkout;
import BoscoLibrary.springbootlibrary.entity.Message;
import BoscoLibrary.springbootlibrary.entity.Review;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDateRestConfig implements RepositoryRestConfigurer {

private String theAllowedOrigins = "http://localhost:3000";


        @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
                                                     CorsRegistry cors){


            HttpMethod[] theUnsupportedAction = {HttpMethod.POST,
                                                    HttpMethod.DELETE,
                                                        HttpMethod.PATCH,
                                                            HttpMethod.PUT};




            config.exposeIdsFor(Book.class); // expose to entity id
            config.exposeIdsFor(Review.class); // expose to entity id
            config.exposeIdsFor(Message.class); // expose to entity id



           disableHttpMethods(Book.class,config,theUnsupportedAction);
            disableHttpMethods(Review.class,config,theUnsupportedAction);
            disableHttpMethods(Message.class,config,theUnsupportedAction);


            cors.addMapping(config.getBasePath()+"/**").allowedOrigins(theAllowedOrigins);




    }
        //prevent the global http method for a entity
    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedAction) {
        config.getExposureConfiguration().forDomainType(theClass)
                .withItemExposure((metadata,httpMethods)->
                        httpMethods.disable(theUnsupportedAction))
                .withCollectionExposure((metadata,httpMethods)->
                        httpMethods.disable(theUnsupportedAction));



    }


}
