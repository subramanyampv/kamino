package BlogHelm.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*

object BlogHelm_DeployAcceptance : BuildType({
    template(BlogHelm.buildTypes.BlogHelm_DeployTemplate)
    uuid = "b39778ac-2a13-46db-ab56-5b17798e4a84"
    id = "BlogHelm_DeployAcceptance"
    name = "Deploy To Acceptance"

    params {
        param("env", "acc")
    }

    dependencies {
        dependency(BlogHelm.buildTypes.BlogHelm_DeployTest) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
            }
        }
    }
})
