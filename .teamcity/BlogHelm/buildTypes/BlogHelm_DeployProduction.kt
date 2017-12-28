package BlogHelm.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.finishBuildTrigger

object BlogHelm_DeployProduction : BuildType({
    template(BlogHelm.buildTypes.BlogHelm_DeployTemplate)
    uuid = "961a48d2-8e68-4405-85c9-6af47bda89ab"
    id = "BlogHelm_DeployProduction"
    name = "Deploy To Production"

    params {
        param("env", "prod")
    }

    dependencies {
        dependency(BlogHelm.buildTypes.BlogHelm_DeployAcceptance) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
            }
        }
    }

    triggers {
        finishBuildTrigger {
            buildTypeExtId = "BlogHelm_CommitStage"
            successfulOnly = true
        }
    }
})
