package com.github.ngeor.kubeconfig;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import java.io.File;
import java.io.IOException;

public class KubeConfigParser {
    public KubeConfig parse() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper(new YAMLFactory());

        return objectMapper.readValue(new File(System.getProperty("user.home") + "/.kube/config"), KubeConfig.class);
    }
}
