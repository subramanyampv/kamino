package com.github.ngeor.bitbucket;

import java.io.IOException;
import java.io.InputStream;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.ngeor.bitbucket.models.PaginatedRepositories;
import com.github.ngeor.json.ObjectMapperFactory;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit test for deserialization.
 */
class JsonTest {
  @Test
  void repositories() throws IOException {
    InputStream stream = getClass().getResourceAsStream("/repositories.json");
    ObjectMapper objectMapper = ObjectMapperFactory.create();

    PaginatedRepositories paginatedRepositories =
        objectMapper.reader()
            .forType(PaginatedRepositories.class)
            .readValue(stream);
    assertThat(paginatedRepositories).isNotNull();
  }
}
