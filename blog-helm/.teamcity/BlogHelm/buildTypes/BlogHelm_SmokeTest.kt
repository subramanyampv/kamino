package BlogHelm.buildTypes

import BlogHelm.vcsRoots.BlogHelm_BlogHelm
import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.exec
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.finishBuildTrigger

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
        exec {
            name = "Smoke test Docker image"
            path = "ci-scripts/smoke-test-docker-image.sh"
            arguments = "%docker.registry%%app.name%:%build.number%"
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

    triggers {
        finishBuildTrigger {
            buildTypeExtId = "BlogHelm_CommitStage"
            successfulOnly = true
            branchFilter   = "+:*"
        }
    }
})
