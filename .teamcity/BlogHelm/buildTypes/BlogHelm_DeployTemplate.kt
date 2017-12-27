package BlogHelm.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script

object BlogHelm_DeployTemplate : Template({
    uuid = "bdb9db38-14a7-4b33-a762-f84f97141b1c"
    id = "BlogHelm_DeployTemplate"
    name = "Deploy Template"

    enablePersonalBuilds = false
    type = BuildTypeSettings.Type.DEPLOYMENT
    maxRunningBuilds = 1

    params {
        text("env", "", label = "Environment", description = "Select the environment to deploy to",
              regex = "^test|acc|prod${'$'}", validationMessage = "Must be one of test acc prod")
        param("helm.host", "192.168.99.101:30200")
    }

    vcs {
        root(BlogHelm.vcsRoots.BlogHelm_BlogHelm)

        showDependenciesChanges = true
    }

    steps {
        script {
            id = "RUNNER_1"
            scriptContent = """
                IMAGE_TAG=${'$'}(cat artifacts/image-tag.txt)
                echo "Using version ${'$'}IMAGE_TAG"
                
                helm upgrade --install blog-helm-%env% \
                  ./artifacts/blog-helm-${'$'}{IMAGE_TAG}.tgz \
                  --set image.tag=${'$'}IMAGE_TAG \
                  --values ./artifacts/values-%env%.yaml \
                  --debug \
                  --wait
            """.trimIndent()
            dockerImage = "lachlanevenson/k8s-helm:v2.6.2"
            dockerRunParameters = "--rm -e HELM_HOST=%helm.host%"
        }
        stepsOrder = arrayListOf("RUNNER_1")
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
                    *.txt => artifacts
                    values-*.yaml => artifacts
                """.trimIndent()
            }
        }
    }
})
