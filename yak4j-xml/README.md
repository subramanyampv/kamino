# yak4j-xml

XML utilities.

[![Maven Central](https://img.shields.io/maven-central/v/com.github.ngeor/yak4j-xml.svg?label=Maven%20Central)](https://search.maven.org/search?q=g:%22com.github.ngeor%22%20AND%20a:%22yak4j-xml%22)
[![Build Status](https://travis-ci.org/ngeor/yak4j-xml.svg?branch=master)](https://travis-ci.org/ngeor/yak4j-xml)
[![Coverage Status](https://coveralls.io/repos/github/ngeor/yak4j-xml/badge.svg?branch=master)](https://coveralls.io/github/ngeor/yak4j-xml?branch=master)

## Usage

You can easily serialize and (de)serialize objects into XML with
`XmlSerializer`.

Any checked `JAXBException` will be wrapped inside the runtime (unchecked)
`XmlRuntimeException`.

```java
class Demo {
    void serialize() {
        XmlSerializer serializer = new XmlSerializer();
        String xml = serializer.serialize(myObject, MyObject.class);
    }
}
```

```java
class Demo {
    void deserialize() {
        XmlSerializer serializer = new XmlSerializer();
        String xml = "<MyObject><Name>hello, world</Name></MyObject>";
        MyObject myObject = serializer.deserialize(xml, MyObject.class);
    }
}
```
