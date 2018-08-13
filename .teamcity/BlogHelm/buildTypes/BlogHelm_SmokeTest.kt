package BlogHelm.buildTypes

import BlogHelm.vcsRoots.BlogHelm_BlogHelm
import jetbrains.buildServer.configs.kotlin.v2018_1.*
import jetbrains.buildServer.configs.kotlin.v2018_1.buildSteps.exec
import jetbrains.buildServer.configs.kotlin.v2018_1.buildSteps.script

object BlogHelm_SmokeTest : BuildType({
    uuid = "d555deaf-076e-4997-8756-95da85e8d785"
    id("BlogHelm_SmokeTest")
    name = "Smoke Test"
    buildNumberPattern = "%dep.BlogHelm_CommitStage.build.number%"
    enablePersonalBuilds = false
    maxRunningBuilds = 1

    vcs {
        root(BlogHelm.vcsRoots.BlogHelm_BlogHelm)
        showDependenciesChanges = true
    }

    steps {
        script {
            name = "Login to Docker registry"
            scriptContent = "docker login -u %docker.username% -p %docker.password% %docker.server%"
            enabled = false
        }
        exec {
            name = "Smoke test Docker image"
            path = "ci-scripts/smoke-test-docker-image.sh"
            arguments = "%docker.registry%blog-helm:%build.number%"
        }
        script {
            name = "Logout from Docker registry"
            scriptContent = "docker logout %docker.server%"
            executionMode = BuildStep.ExecutionMode.ALWAYS
            enabled = false
        }
    }

    dependencies {
        dependency(BlogHelm.buildTypes.BlogHelm_CommitStage) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
            }
        }
    }

    features {
        feature {
            type = "perfmon"
        }
    }
})
