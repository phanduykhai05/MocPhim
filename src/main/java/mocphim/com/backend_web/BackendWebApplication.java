package mocphim.com.backend_web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableCaching
@EnableScheduling
@EnableJpaAuditing
public class BackendWebApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendWebApplication.class, args);
    }
}
