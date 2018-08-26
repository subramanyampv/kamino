package BlogHelm.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_1.BuildType
import jetbrains.buildServer.configs.kotlin.v2018_1.buildFeatures.sshAgent
import jetbrains.buildServer.configs.kotlin.v2018_1.buildFeatures.vcsLabeling
import jetbrains.buildServer.configs.kotlin.v2018_1.buildSteps.dockerCommand
import jetbrains.buildServer.configs.kotlin.v2018_1.buildSteps.exec
import jetbrains.buildServer.configs.kotlin.v2018_1.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.v2018_1.failureConditions.failOnMetricChange
import jetbrains.buildServer.configs.kotlin.v2018_1.triggers.vcs

object BlogHelm_CommitStage : BuildType({
    uuid = "3f8adc5d-5b14-4a13-9ecd-70b624f828de"
    id("BlogHelm_CommitStage")
    name = "Commit Stage"
    enablePersonalBuilds = false
    artifactRules = """
        %app.name%-%env.IMAGE_TAG%.tgz
        helm/%app.name%/values-*.yaml
    """.trimIndent()
    maxRunningBuilds = 1

    params {
        param("env.IMAGE_TAG", "")
    }

    vcs {
        root(BlogHelm.vcsRoots.BlogHelm_BlogHelm)
        showDependenciesChanges = true
    }

    steps {
        exec {
            name = "Basic diagnostics"
            path = "ci-scripts/diagnostics.sh"
        }
        exec {
            name = "Ensure feature branch is ahead of master"
            path = "ci-scripts/merge.sh"
        }
        exec {
            name = "Determine version"
            path = "ci-scripts/version.sh"
        }
        exec {
            name = "Install dependencies (npm install)"
            path = "npm"
            arguments = "install"
            dockerImage = "%ci.image%"
            dockerRunParameters = "--rm"
        }
        exec {
            name = "Linting"
            path = "npm"
            arguments = "run lint-junit"
            dockerImage = "%ci.image%"
            dockerRunParameters = "--rm"
        }
        exec {
            name = "Unit Tests"
            path = "npm"
            arguments = "run nyc-junit"
            dockerImage = "%ci.image%"
            dockerRunParameters = "--rm"
        }
        dockerCommand {
            name = "Build production Docker image"
            commandType = build {
                source = path {
                    path = "Dockerfile"
                }
                namesAndTags = """
                    %docker.registry%%app.name%:%build.number%
                """.trimIndent()
            }
        }
        exec {
            name = "Helm Init"
            path = "helm"
            arguments = "init --client-only"
            dockerImage = "lachlanevenson/k8s-helm:%lachlanevenson.k8s-helm.tag%"
            dockerRunParameters = "--rm -v %teamcity.build.workingDir%/.helm:/root/.helm"
        }
        exec {
            name = "Helm Lint"
            path = "helm"
            arguments = "lint ./helm/%app.name%"
            dockerImage = "lachlanevenson/k8s-helm:%lachlanevenson.k8s-helm.tag%"
            dockerRunParameters = "--rm -v %teamcity.build.workingDir%/.helm:/root/.helm"
        }
        exec {
            name = "Helm Package"
            path = "helm"
            arguments = "package --debug --version %build.number% ./helm/%app.name%"
            dockerImage = "lachlanevenson/k8s-helm:%lachlanevenson.k8s-helm.tag%"
            dockerRunParameters = "--rm -v %teamcity.build.workingDir%/.helm:/root/.helm"
        }
    }

    failureConditions {
        failOnMetricChange {
            metric = BuildFailureOnMetric.MetricType.COVERAGE_LINE_PERCENTAGE
            units = BuildFailureOnMetric.MetricUnit.DEFAULT_UNIT
            comparison = BuildFailureOnMetric.MetricComparison.LESS
            compareTo = build {
                buildRule = lastSuccessful()
            }
        }
    }

    triggers {
        vcs {
        }
    }

    features {
        feature {
            type = "perfmon"
        }
        feature {
            type = "xml-report-plugin"
            param("xmlReportParsing.reportType", "junit")
            param("xmlReportParsing.reportDirs", "test-reports/ci-*.xml")
            param("xmlReportParsing.verboseOutput", "true")
        }
        sshAgent {
            teamcitySshKey = "ENVY"
        }

        vcsLabeling {
            vcsRootId = "BlogHelm_BlogHelm"
            labelingPattern = "v%system.build.number%"
            successfulOnly = true
        }
    }
})
