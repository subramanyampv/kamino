package com.github.ngeor.kubeconfig;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public class KubeConfig {
    private String apiVersion;
    private List<Cluster> clusters;
    private List<Context> contexts;
    private String currentContext;
    private String kind;
    private Map<String, String> preferences;
    private List<User> users;

    public String getApiVersion() {
        return apiVersion;
    }

    public void setApiVersion(String apiVersion) {
        this.apiVersion = apiVersion;
    }

    public List<Cluster> getClusters() {
        return clusters;
    }

    public void setClusters(List<Cluster> clusters) {
        this.clusters = clusters;
    }

    public List<Context> getContexts() {
        return contexts;
    }

    public void setContexts(List<Context> contexts) {
        this.contexts = contexts;
    }

    @JsonProperty("current-context")
    public String getCurrentContext() {
        return currentContext;
    }

    public void setCurrentContext(String currentContext) {
        this.currentContext = currentContext;
    }

    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public Map<String, String> getPreferences() {
        return preferences;
    }

    public void setPreferences(Map<String, String> preferences) {
        this.preferences = preferences;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public static class Cluster {
        private ClusterInfo cluster;
        private String name;

        public ClusterInfo getCluster() {
            return cluster;
        }

        public void setCluster(ClusterInfo cluster) {
            this.cluster = cluster;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public static class ClusterInfo {
            private String server;
            private String certificateAuthority;
            private String certificateAuthorityData;

            @JsonProperty("server")
            public String getServer() {
                return server;
            }

            public void setServer(String server) {
                this.server = server;
            }

            @JsonProperty("certificate-authority")
            public String getCertificateAuthority() {
                return certificateAuthority;
            }

            public void setCertificateAuthority(String certificateAuthority) {
                this.certificateAuthority = certificateAuthority;
            }

            @JsonProperty("certificate-authority-data")
            public String getCertificateAuthorityData() {
                return certificateAuthorityData;
            }

            public void setCertificateAuthorityData(String certificateAuthorityData) {
                this.certificateAuthorityData = certificateAuthorityData;
            }
        }
    }

    public static class Context {
        private ContextInfo context;
        private String name;

        public ContextInfo getContext() {
            return context;
        }

        public void setContext(ContextInfo context) {
            this.context = context;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public static class ContextInfo {
            private String cluster;
            private String namespace;
            private String user;

            public String getCluster() {
                return cluster;
            }

            public void setCluster(String cluster) {
                this.cluster = cluster;
            }

            public String getNamespace() {
                return namespace;
            }

            public void setNamespace(String namespace) {
                this.namespace = namespace;
            }

            public String getUser() {
                return user;
            }

            public void setUser(String user) {
                this.user = user;
            }
        }
    }

    public static class User {
        private String name;
        private UserInfo user;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public UserInfo getUser() {
            return user;
        }

        public void setUser(UserInfo user) {
            this.user = user;
        }

        public static class UserInfo {
            private String clientCertificate;
            private String clientCertificateData;
            private String clientKey;
            private String clientKeyData;
            private Exec exec;

            @JsonProperty("client-certificate")
            public String getClientCertificate() {
                return clientCertificate;
            }

            public void setClientCertificate(String clientCertificate) {
                this.clientCertificate = clientCertificate;
            }

            @JsonProperty("client-certificate-data")
            public String getClientCertificateData() {
                return clientCertificateData;
            }

            public void setClientCertificateData(String clientCertificateData) {
                this.clientCertificateData = clientCertificateData;
            }

            @JsonProperty("client-key")
            public String getClientKey() {
                return clientKey;
            }

            public void setClientKey(String clientKey) {
                this.clientKey = clientKey;
            }

            @JsonProperty("client-key-data")
            public String getClientKeyData() {
                return clientKeyData;
            }

            public void setClientKeyData(String clientKeyData) {
                this.clientKeyData = clientKeyData;
            }

            public Exec getExec() {
                return exec;
            }

            public void setExec(Exec exec) {
                this.exec = exec;
            }

            public static class Exec {
                private String apiVersion;
                private List<String> args;
                private String command;
                private String env;

                public String getApiVersion() {
                    return apiVersion;
                }

                public void setApiVersion(String apiVersion) {
                    this.apiVersion = apiVersion;
                }

                public List<String> getArgs() {
                    return args;
                }

                public void setArgs(List<String> args) {
                    this.args = args;
                }

                public String getCommand() {
                    return command;
                }

                public void setCommand(String command) {
                    this.command = command;
                }

                public String getEnv() {
                    return env;
                }

                public void setEnv(String env) {
                    this.env = env;
                }
            }
        }
    }
}
