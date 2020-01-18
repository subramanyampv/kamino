# yak4j-utc-time-zone-mapper

Java utility library to map between OffsetDateTime and LocalDateTime in UTC.

[![Maven Central](https://img.shields.io/maven-central/v/com.github.ngeor/yak4j-utc-time-zone-mapper.svg?label=Maven%20Central)](https://search.maven.org/search?q=g:%22com.github.ngeor%22%20AND%20a:%22yak4j-utc-time-zone-mapper%22)
[![Build Status](https://travis-ci.org/ngeor/yak4j-utc-time-zone-mapper.svg?branch=master)](https://travis-ci.org/ngeor/yak4j-utc-time-zone-mapper)
[![Coverage Status](https://coveralls.io/repos/github/ngeor/yak4j-utc-time-zone-mapper/badge.svg?branch=master)](https://coveralls.io/github/ngeor/yak4j-utc-time-zone-mapper?branch=master)

## Usage

The package contains currently only one class, `UtcTimeZoneMapper`.

```java
import com.github.ngeor.yak4j.UtcTimeZoneMapper;

UtcTimeZoneMapper mapper = new UtcTimeZoneMapper();

// map from OffsetDateTime to LocalDateTime
LocalDateTime localDateTime = mapper.asLocalDateTime(OffsetDateTime.now());

// map from LocalDateTime to OffsetDateTime
OffsetDateTime offsetDateTime = mapper.asOffsetDateTime(localDateTime);
```
