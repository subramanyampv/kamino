package BlogHelm.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.finishBuildTrigger

object BlogHelm_DeployAcceptance : BuildType({
    uuid = "b39778ac-2a13-46db-ab56-5b17798e4a84"
    id("BlogHelm_DeployAcceptance")
    name = "Deploy To Acceptance"
    templates = arrayListOf(AbsoluteId("BlogHelm_DeployTemplate"))

    params {
        param("app.env", "acc")
    }

    dependencies {
        dependency(BlogHelm.buildTypes.BlogHelm_DeployTest) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
            }
        }
    }

    triggers {
        finishBuildTrigger {
            buildTypeExtId = "BlogHelm_DeployTest"
            successfulOnly = true
            branchFilter   = "+:*"
        }
    }
})
