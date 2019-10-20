package BlogHelm.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.finishBuildTrigger

object BlogHelm_DeployTest : BuildType({
    uuid = "2c559e38-b9b4-4dcf-a79f-2faa91c9f5af"
    id("BlogHelm_DeployTest")
    name = "Deploy To Test"
    templates = arrayListOf(AbsoluteId("BlogHelm_DeployTemplate"))

    params {
        param("app.env", "test")
    }

    dependencies {
        dependency(BlogHelm.buildTypes.BlogHelm_SmokeTest) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
            }
        }
    }

    triggers {
        finishBuildTrigger {
            buildTypeExtId = "BlogHelm_SmokeTest"
            successfulOnly = true
            branchFilter   = "+:*"
        }
    }

})
