package BlogHelm.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.exec
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script

object BlogHelm_DeployTemplate : Template({
    uuid = "bdb9db38-14a7-4b33-a762-f84f97141b1c"
    id = "BlogHelm_DeployTemplate"
    name = "Deploy Template"
    buildNumberPattern = "%dep.BlogHelm_CommitStage.build.number%"
    enablePersonalBuilds = false
    type = BuildTypeSettings.Type.DEPLOYMENT
    maxRunningBuilds = 1

    params {
        text("env", "", label = "Environment", description = "Select the environment to deploy to",
              regex = "^test|acc|prod${'$'}", validationMessage = "Must be one of test acc prod")
        param("helm.host", "192.168.99.101:30200")
        param("app.host", "")
        param("app.baseurl", "http://%app.host%")
        param("app.version.url", "%app.baseurl%/version")
    }

    vcs {
        root(BlogHelm.vcsRoots.BlogHelm_BlogHelm)
        showDependenciesChanges = true
    }

    steps {
        script {
            name = "Deploy using Helm"
            scriptContent = """
                helm upgrade --install blog-helm-%env% \
                  ./artifacts/blog-helm-%build.number%.tgz \
                  --set image.tag=%build.number% \
                  --values ./artifacts/values-%env%.yaml \
                  --debug \
                  --wait
            """.trimIndent()
            dockerImage = "lachlanevenson/k8s-helm:%lachlanevenson.k8s-helm.tag%"
            dockerRunParameters = "--rm -e HELM_HOST=%helm.host%"
        }

        exec {
            name = "Wait until the correct version is available"
            path = "ci-scripts/wait-for-version.sh"
            arguments = "%app.version.url% %build.number%"
        }

        script {
            name = "Run WebdriverIO tests"
            scriptContent = """
                docker run \
                  --rm -v ${'$'}(pwd)/test-reports:/app/test-reports \
                  blog-helm-ci:%build.number% \
                  npm run wdio -- -b %app.baseurl%

                docker run \
                  --rm -v ${'$'}(pwd)/test-reports:/app/test-reports \
                  blog-helm-ci:%build.number% \
                  chown -R ${'$'}(id -u):${'$'}(id -g) test-reports
            """.trimIndent()
        }
    }

    dependencies {
        dependency(BlogHelm.buildTypes.BlogHelm_CommitStage) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
            }

            artifacts {
                id = "ARTIFACT_DEPENDENCY_1"
                cleanDestination = true
                artifactRules = """
                    *.tgz => artifacts
                    values-*.yaml => artifacts
                """.trimIndent()
            }
        }
    }

    features {
        feature {
            type = "perfmon"
        }
        feature {
            type = "xml-report-plugin"
            param("xmlReportParsing.reportType", "junit")
            param("xmlReportParsing.reportDirs", "test-reports/WD*.xml")
            param("xmlReportParsing.verboseOutput", "true")
        }
    }
})
