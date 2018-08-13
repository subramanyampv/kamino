package BlogHelm.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_1.*

object BlogHelm_DeployAcceptance : BuildType({
    uuid = "b39778ac-2a13-46db-ab56-5b17798e4a84"
    id("BlogHelm_DeployAcceptance")
    name = "Deploy To Acceptance"
    templates = arrayListOf(AbsoluteId("BlogHelm_DeployTemplate"))

    params {
        param("app.env", "acc")
        param("app.host", "acc.blog-helm.local")
    }

    dependencies {
        dependency(BlogHelm.buildTypes.BlogHelm_DeployTest) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
            }
        }
    }
})
