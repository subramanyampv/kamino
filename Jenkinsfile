def version = ""

pipeline {
  agent none
  environment {
    CI = "1"
    HOME = "/tmp"
    HELM_HOME = "/tmp"
    KUBECTL_CONFIG = credentials("kubectl_config")
  }

  stages {
    stage("Diagnostics") {
      agent any

      steps {
        sh "./ci-scripts/diagnostics.sh"
        sh "./ci-scripts/merge.sh"
      }
    }

    stage("Versioning") {
      agent {
        docker {
          image "gittools/gitversion:5.0.2-linux-ubuntu-18.04-netcoreapp3.0"
          args "--entrypoint=''"
        }
      }

      steps {
        script {
          version = sh(script: "./ci-scripts/version.sh", returnStdout: true).trim()
        }
        buildName version
      }
    }

    stage("Preparation") {
      agent {
        docker { image "node:lts" }
      }

      steps {
        sh "node ./ci-scripts/package-json-version.js ${version}"
        sh "npm i"
      }
    }

    stage("Linting and Unit Tests") {
      agent {
        docker { image "node:lts" }
      }

      steps {
        sh "npm run lint-junit"
        sh "npm run nyc-junit"
      }
    }

    stage("Functional Tests") {
      parallel {
        stage("Functional Tests (Chrome)") {
          agent {
            docker { image "ngeor/node-chrome:v77.0.3865.120"}
          }
          steps {
            sh "npm run start-wdio"
          }
        }

        stage("Functional Tests (Firefox)") {
          agent {
            docker { image "ngeor/node-firefox"}
          }
          environment {
            BROWSER_NAME = "firefox"
          }
          steps {
            sh "npm run start-wdio"
          }
        }
      }
    }

    stage("Build docker image") {
      agent any
      steps {
        sh "docker build . -t blog-helm:${version}"
      }
    }

    stage("Helm init, lint, package") {
      agent {
        docker {
          image "lachlanevenson/k8s-helm:v2.15.0"
          args "--entrypoint=''"
        }
      }
      steps {
        sh "mkdir -p artifacts"
        sh "helm init --client-only"
        sh "helm lint ./helm/blog-helm"
        sh "helm package --debug --version ${version} -d artifacts ./helm/blog-helm"
        sh "cp ./helm/blog-helm/values-*.yaml artifacts"
      }
      post {
        always{
          junit "**/test-reports/ci-*.xml"
          archiveArtifacts artifacts: "artifacts/*${version}.tgz", fingerprint: true
          archiveArtifacts artifacts: "artifacts/values-*.yaml", fingerprint: true
        }
      }
    }

    stage("Smoke test Docker image") {
      agent any
      steps {
        sh "./ci-scripts/smoke-test-docker-image.sh blog-helm:${version}"
      }
    }

    // TODO fail when code coverage drops
    stage("Deploy to Test") {
      options {
        lock("blog-helm-test")
      }
      stages {
        stage("Deploy (Test)") {
          agent {
            docker {
              image "lachlanevenson/k8s-helm:v2.15.0"
              args "--entrypoint=''"
            }
          }
          steps {
            sh "./ci-scripts/deploy.sh --kube-config ${KUBECTL_CONFIG} --env test --tag ${version}"
          }
        }

        stage("Smoke tests (Test)") {
          agent any
          steps {
            sh "./ci-scripts/wdio.sh http://blog-helm-test-blog-helm"
          }
        }
      }
    }

    stage("Deploy to Acceptance") {
      options {
        lock("blog-helm-acc")
      }
      stages {
        stage("Deploy (Acceptance)") {
          agent {
            docker {
              image "lachlanevenson/k8s-helm:v2.15.0"
              args "--entrypoint=''"
            }
          }
          steps {
            sh "./ci-scripts/deploy.sh --kube-config ${KUBECTL_CONFIG} --env acc --tag ${version}"
          }
        }

        stage("Smoke tests (Acceptance)") {
          agent any
          steps {
            sh "./ci-scripts/wdio.sh http://blog-helm-acc-blog-helm"
          }
        }
      }
    }

    stage("Deploy to Production") {
      options {
        lock("blog-helm-prod")
      }
      when {
        branch "master"
      }
      stages {
        stage("Deploy (Production)") {
          agent {
            docker {
              image "lachlanevenson/k8s-helm:v2.15.0"
              args "--entrypoint=''"
            }
          }
          steps {
            sh "./ci-scripts/deploy.sh --kube-config ${KUBECTL_CONFIG} --env prod --tag ${version}"
          }
        }

        stage("Smoke tests (Production)") {
          agent any
          steps {
            sh "./ci-scripts/wdio.sh http://blog-helm-prod-blog-helm"
          }
        }
      }
    }

    stage("Tag master") {
      when {
        branch "master"
      }
      agent any
      steps {
        sh "git tag -m 'Releasing version ${version}' v${version}"
        sh "git push --follow-tags"
      }
    }
  }
}
