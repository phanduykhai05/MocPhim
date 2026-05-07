package mocphim.com.backend_web.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisClientConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.util.StringUtils;
import redis.clients.jedis.DefaultJedisClientConfig;
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisClientConfig;
import redis.clients.jedis.UnifiedJedis;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisConfig {

    @Value("${redis.host}")
    private String host;

    @Value("${redis.port}")
    private int port;

    @Value("${redis.user:}")
    private String user;

    @Value("${redis.password:}")
    private String password;

    @Value("${redis.timeout-ms:2000}")
    private int timeoutMs;

    @Bean
    public UnifiedJedis unifiedJedis() {
        HostAndPort hostAndPort = new HostAndPort(host, port);
        DefaultJedisClientConfig.Builder builder = DefaultJedisClientConfig.builder()
                .connectionTimeoutMillis(timeoutMs)
                .socketTimeoutMillis(timeoutMs);
        if (StringUtils.hasText(user)) builder.user(user);
        if (StringUtils.hasText(password)) builder.password(password);
        JedisClientConfig config = builder.build();
        return new UnifiedJedis(hostAndPort, config);
    }

    @Bean
    public JedisConnectionFactory jedisConnectionFactory() {
        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration(host, port);
        if (StringUtils.hasText(user)) redisConfig.setUsername(user);
        if (StringUtils.hasText(password)) redisConfig.setPassword(password);
        JedisClientConfiguration jedisConfig = JedisClientConfiguration.builder()
                .connectTimeout(Duration.ofMillis(timeoutMs))
                .readTimeout(Duration.ofMillis(timeoutMs))
                .build();
        return new JedisConnectionFactory(redisConfig, jedisConfig);
    }

    @Bean
    public RedisCacheManager redisCacheManager(JedisConnectionFactory factory,
                                               com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        RedisCacheConfiguration base = RedisCacheConfiguration.defaultCacheConfig()
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer(objectMapper)));

        Map<String, RedisCacheConfiguration> configs = new HashMap<>();
        configs.put("home",          base.entryTtl(Duration.ofMinutes(5)));
        configs.put("movieDetail",   base.entryTtl(Duration.ofMinutes(10)));
        configs.put("movieList",     base.entryTtl(Duration.ofMinutes(5)));
        configs.put("categories",    base.entryTtl(Duration.ofMinutes(30)));
        configs.put("countries",     base.entryTtl(Duration.ofMinutes(30)));
        configs.put("years",         base.entryTtl(Duration.ofMinutes(60)));
        configs.put("syncedMovies",  base.entryTtl(Duration.ofMinutes(2)));
        configs.put("searchHistory", base.entryTtl(Duration.ofMinutes(5)));
        configs.put("users",         base.entryTtl(Duration.ofHours(1)));

        return RedisCacheManager.builder(factory)
                .cacheDefaults(base)
                .withInitialCacheConfigurations(configs)
                .build();
    }
}
