package com.kh.app;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"app.seed.enabled=false",
		"spring.jpa.hibernate.ddl-auto=none",
		"spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect"
})
class AppApplicationTests {

	@Test
	void contextLoads() {
	}

}
