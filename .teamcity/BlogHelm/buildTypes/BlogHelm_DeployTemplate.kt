package BlogHelm.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.exec
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.script

object BlogHelm_DeployTemplate : Template({
    uuid = "bdb9db38-14a7-4b33-a762-f84f97141b1c"
    id("BlogHelm_DeployTemplate")
    name = "Deploy Template"
    buildNumberPattern = "%dep.BlogHelm_CommitStage.build.number%"
    enablePersonalBuilds = false
    type = BuildTypeSettings.Type.DEPLOYMENT
    maxRunningBuilds = 1

    params {
        text("app.env", "", label = "Environment", description = "Select the environment to deploy to",
              regex = "^test|acc|prod${'$'}", validationMessage = "Must be one of test acc prod")
        param("app.host", "")
        param("app.baseurl", "http://%app.host%")
        param("app.version.url", "%app.baseurl%/version")
    }

    vcs {
        root(BlogHelm.vcsRoots.BlogHelm_BlogHelm)
        showDependenciesChanges = true
    }

    steps {
        exec {
            name = "Deploy using Helm"
            path = "./ci-scripts/deploy.sh"
            arguments = "--kube-config %env.KUBECTL_CONFIG% --env %app.env% --tag %build.number%"
            dockerImage = "lachlanevenson/k8s-helm:%lachlanevenson.k8s-helm.tag%"
            dockerRunParameters = "--rm -v %teamcity.build.workingDir%/.helm:/root/.helm"
        }
        exec {
            name = "Wait until the correct version is available"
            path = "ci-scripts/wait-for-version.sh"
            arguments = "%app.version.url% %build.number%"
        }
        exec {
            name = "Run WebdriverIO tests"
            path = "npm"
            arguments = "run wdio -- -b %app.baseurl%"
            dockerImage = "%ci.image%"
            dockerRunParameters = "--rm"
        }
    }

    dependencies {
        dependency(BlogHelm.buildTypes.BlogHelm_CommitStage) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
            }

            artifacts {
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
